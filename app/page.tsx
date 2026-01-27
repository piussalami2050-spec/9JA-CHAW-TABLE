'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Calendar, ChefHat, ShoppingCart, TrendingUp, Search, Clock, Users, Utensils, 
  Leaf, Home, Check, AlertTriangle, X, Plus, ChevronLeft, ChevronRight, 
  Heart, Moon, Sun 
} from 'lucide-react';

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  tags: string[];
  isHealthy: boolean;
  healthNotes?: string;
  isFavorite?: boolean;
}

interface MealPlan {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD (Monday of the week)
  meals: Record<string, {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  }>;
}

interface GroceryItem {
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  estimatedCost?: number;
}

// ────────────────────────────────────────────────
// SAMPLE RECIPES (all 11)
// ────────────────────────────────────────────────

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Low-Salt Jollof Rice',
    category: 'lunch',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Fried_Rice%2C_Jolof_Rice_with_Plantain_and_Chicken.jpg',
    ingredients: [
      { name: 'Rice', amount: 3, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Tomatoes', amount: 4, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Red bell pepper', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Blend tomatoes, peppers, and half the onions until smooth',
      'Heat oil in a pot and fry the tomato blend until oil rises',
      'Add curry, thyme, and bay leaves',
      'Pour in low-sodium stock and bring to boil',
      'Add washed rice, stir, and cover to cook',
      'Cook for 30-35 minutes until rice is tender'
    ],
    nutrition: { calories: 320, protein: 6, carbs: 58, fats: 7, fiber: 2, sodium: 280, sugar: 4 },
    tags: ['low-salt', 'vegetarian'],
    isHealthy: true,
    healthNotes: 'Reduced salt version using low-sodium stock'
  },
  {
    id: '2',
    name: 'Vegetable Egusi Soup',
    category: 'lunch',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    imageUrl: 'https://get.pxhere.com/photo/food-dish-cuisine-vegetarian-food-meal-asian-food-recipe-middle-eastern-food-1454791.jpg',
    ingredients: [
      { name: 'Ground egusi', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Ugwu leaves', amount: 4, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Spinach', amount: 2, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Stockfish', amount: 200, unit: 'g', category: 'Proteins' },
      { name: 'Palm oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Soak and cook stockfish until tender',
      'Mix ground egusi with water to form paste',
      'Heat palm oil, add onions and pepper',
      'Add egusi paste in small lumps',
      'Add stockfish and simmer',
      'Add vegetables and cook for 5 minutes'
    ],
    nutrition: { calories: 380, protein: 18, carbs: 12, fats: 28, fiber: 5, sodium: 420, sugar: 3 },
    tags: ['high-protein', 'traditional'],
    isHealthy: true,
    healthNotes: 'Rich in vegetables and protein'
  },
  {
    id: '3',
    name: 'Grilled Fish with Pepper Sauce',
    category: 'dinner',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    ingredients: [
      { name: 'Tilapia', amount: 2, unit: 'pieces', category: 'Proteins' },
      { name: 'Bell peppers', amount: 3, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Scotch bonnet', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Clean fish and season lightly',
      'Grill fish for 10-12 minutes each side',
      'Blend peppers, onions, garlic, and ginger',
      'Heat oil and fry pepper blend',
      'Pour sauce over grilled fish'
    ],
    nutrition: { calories: 280, protein: 35, carbs: 8, fats: 12, fiber: 2, sodium: 180, sugar: 5 },
    tags: ['low-salt', 'high-protein', 'grilled'],
    isHealthy: true,
    healthNotes: 'Excellent protein source, grilled not fried'
  },
  {
    id: '4',
    name: 'Moi Moi',
    category: 'breakfast',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ofada_Rice_and_stew_on_leaf.jpg',
    ingredients: [
      { name: 'Peeled beans', amount: 3, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Red bell pepper', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Eggs', amount: 3, unit: 'pieces', category: 'Proteins' }
    ],
    instructions: [
      'Blend beans with peppers and onions',
      'Add minimal salt and oil',
      'Whisk mixture until fluffy',
      'Pour into greased containers',
      'Steam for 45 minutes'
    ],
    nutrition: { calories: 220, protein: 12, carbs: 28, fats: 6, fiber: 8, sodium: 160, sugar: 2 },
    tags: ['low-salt', 'high-fiber'],
    isHealthy: true,
    healthNotes: 'High in protein and fiber'
  },
  {
    id: '5',
    name: 'Beans and Plantain',
    category: 'lunch',
    prepTime: 10,
    cookTime: 50,
    servings: 4,
    imageUrl: 'https://fooddrinkdestinations.com/wp-content/uploads/2023/02/Tostones.jpg',
    ingredients: [
      { name: 'Honey beans', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Ripe plantains', amount: 4, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Palm oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' }
    ],
    instructions: [
      'Boil beans until soft',
      'Peel and cut plantains',
      'Add plantains to beans',
      'Heat palm oil with onions',
      'Pour oil over beans and plantain'
    ],
    nutrition: { calories: 340, protein: 14, carbs: 52, fats: 8, fiber: 12, sodium: 120, sugar: 18 },
    tags: ['vegetarian', 'high-fiber'],
    isHealthy: true,
    healthNotes: 'Excellent fiber source'
  },
  {
    id: '6',
    name: 'Efo Riro',
    category: 'lunch',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/%E1%BA%B8f%E1%BB%8D_t%E1%BA%B9t%E1%BA%B9.jpg',
    ingredients: [
      { name: 'Spinach', amount: 6, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Lean beef', amount: 300, unit: 'g', category: 'Proteins' },
      { name: 'Palm oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Cook lean beef until tender',
      'Heat palm oil, fry onions',
      'Add meat and cook',
      'Add chopped spinach and stir'
    ],
    nutrition: { calories: 290, protein: 22, carbs: 14, fats: 16, fiber: 4, sodium: 340, sugar: 6 },
    tags: ['high-protein', 'iron-rich'],
    isHealthy: true,
    healthNotes: 'Rich in iron and vitamins'
  },
  {
    id: '7',
    name: 'Yam Porridge',
    category: 'lunch',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://images.pexels.com/photos/32000626/pexels-photo-32000626.jpeg?cs=srgb&dl=pexels-najim-kurfi-483155737-32000626.jpg&fm=jpg',
    ingredients: [
      { name: 'Yam', amount: 1, unit: 'medium tuber', category: 'Grains & Cereals' },
      { name: 'Palm oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Smoked fish', amount: 150, unit: 'g', category: 'Proteins' }
    ],
    instructions: [
      'Peel and cut yam',
      'Boil yam until soft',
      'Add palm oil and fish',
      'Mash slightly'
    ],
    nutrition: { calories: 380, protein: 14, carbs: 58, fats: 10, fiber: 6, sodium: 380, sugar: 4 },
    tags: ['comfort-food', 'filling'],
    isHealthy: true,
    healthNotes: 'Good energy source'
  },
  {
    id: '8',
    name: 'Akara',
    category: 'breakfast',
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1601001435828-419e309a20e7?w=400',
    ingredients: [
      { name: 'Peeled beans', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 2, unit: 'cups', category: 'Oils & Fats' }
    ],
    instructions: [
      'Blend beans until smooth',
      'Add onions and pepper',
      'Whip mixture until fluffy',
      'Fry in hot oil'
    ],
    nutrition: { calories: 180, protein: 10, carbs: 20, fats: 6, fiber: 6, sodium: 140, sugar: 1 },
    tags: ['low-salt', 'protein-rich'],
    isHealthy: true,
    healthNotes: 'Good protein source'
  },
  {
    id: '9',
    name: 'Grilled Chicken Suya',
    category: 'dinner',
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://i0.wp.com/jamdownfoodie.com/wp-content/uploads/2021/05/37-2.jpg?resize=720%2C540',
    ingredients: [
      { name: 'Chicken breast', amount: 500, unit: 'g', category: 'Proteins' },
      { name: 'Suya spice', amount: 3, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Vegetable oil', amount: 2, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Cut chicken into strips',
      'Marinate with suya spice',
      'Thread onto skewers',
      'Grill for 8-10 minutes each side'
    ],
    nutrition: { calories: 240, protein: 32, carbs: 6, fats: 10, fiber: 2, sodium: 320, sugar: 2 },
    tags: ['high-protein', 'grilled'],
    isHealthy: true,
    healthNotes: 'Lean protein, grilled'
  },
  {
    id: '10',
    name: 'Fish Pepper Soup',
    category: 'dinner',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    ingredients: [
      { name: 'Fresh catfish', amount: 4, unit: 'pieces', category: 'Proteins' },
      { name: 'Pepper soup spice', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Scotch bonnet', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' }
    ],
    instructions: [
      'Clean fish thoroughly',
      'Boil water with spices',
      'Add fish and cook for 15-20 minutes',
      'Serve hot'
    ],
    nutrition: { calories: 180, protein: 28, carbs: 4, fats: 6, fiber: 1, sodium: 280, sugar: 2 },
    tags: ['low-carb', 'high-protein'],
    isHealthy: true,
    healthNotes: 'Low calorie, high protein'
  },
  {
    id: '11',
    name: 'Pounded Yam',
    category: 'lunch',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
    ingredients: [
      { name: 'Yam', amount: 1, unit: 'large tuber', category: 'Grains & Cereals' },
      { name: 'Water', amount: 4, unit: 'cups', category: 'Other' }
    ],
    instructions: [
      'Peel the yam and cut into cubes',
      'Boil in water until soft',
      'Drain and pound in a mortar until smooth',
      'Serve with soup'
    ],
    nutrition: { calories: 300, protein: 4, carbs: 70, fats: 1, fiber: 5, sodium: 20, sugar: 2 },
    tags: ['traditional', 'gluten-free'],
    isHealthy: true,
    healthNotes: 'Good source of carbohydrates'
  }
];

// ────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────

interface AppContextType {
  recipes: Recipe[];
  mealPlan: MealPlan | null;
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan | null>>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes] = useState<Recipe[]>(SAMPLE_RECIPES);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('nigerianMealPlanner');
      if (stored) {
        const data = JSON.parse(stored);
        setMealPlan(data.mealPlan || null);
        setTheme(data.theme || 'light');
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nigerianMealPlanner', JSON.stringify({ mealPlan, theme }));
  }, [mealPlan, theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{
      recipes,
      mealPlan,
      setMealPlan,
      currentPage,
      setCurrentPage,
      theme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ────────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────────

const Header = () => {
  const ctx = useContext(AppContext)!;
  const { currentPage, setCurrentPage, theme, toggleTheme } = ctx;

  return (
    <header className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <ChefHat className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Nigerian Meal Planner</h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-emerald-600 transition">
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex gap-2 mt-4 overflow-x-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'recipes', icon: Utensils, label: 'Recipes' },
            { id: 'planner', icon: Calendar, label: 'Planner' },
            { id: 'grocery', icon: ShoppingCart, label: 'Grocery' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                currentPage === item.id
                  ? 'bg-white text-emerald-700'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

// ────────────────────────────────────────────────
// RECIPE MODAL
// ────────────────────────────────────────────────

const RecipeModal = ({ recipe, onClose }: { recipe: Recipe | null; onClose: () => void }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.name}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
          </button>
        </div>
        <div className="p-6">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={e => (e.currentTarget.src = `https://via.placeholder.com/600x400?text=${encodeURIComponent(recipe.name)}`)}
          />
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
            <div><Clock className="inline mr-1" /> Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min</div>
            <div><Users className="inline mr-1" /> {recipe.servings} servings</div>
          </div>

          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Ingredients</h3>
          <ul className="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing.amount} {ing.unit} {ing.name}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Instructions</h3>
          <ol className="list-decimal pl-5 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>

          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Nutrition (per serving)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>Calories: {recipe.nutrition.calories}</div>
            <div>Protein: {recipe.nutrition.protein}g</div>
            <div>Carbs: {recipe.nutrition.carbs}g</div>
            <div>Fats: {recipe.nutrition.fats}g</div>
            <div>Fiber: {recipe.nutrition.fiber}g</div>
            <div>Sodium: {recipe.nutrition.sodium}mg</div>
            <div>Sugar: {recipe.nutrition.sugar}g</div>
          </div>

          {recipe.healthNotes && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <AlertTriangle className="inline mr-2 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-200">{recipe.healthNotes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// HOMEPAGE
// ────────────────────────────────────────────────

const HomePage = () => {
  const ctx = useContext(AppContext)!;
  const { recipes, setCurrentPage } = ctx;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Welcome</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-emerald-500">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Recipes</h3>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{recipes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Healthy Recipes</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{recipes.filter(r => r.isHealthy).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-lime-500">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Low Sodium</h3>
          <p className="text-4xl font-bold text-lime-600 mt-2">{recipes.filter(r => r.nutrition.sodium < 300).length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button onClick={() => setCurrentPage('recipes')} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition text-left">
          <Utensils className="w-10 h-10 text-emerald-600 mb-4" />
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Browse Recipes</h4>
          <p className="text-gray-600 dark:text-gray-400">Discover Nigerian classics</p>
        </button>
        <button onClick={() => setCurrentPage('planner')} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition text-left">
          <Calendar className="w-10 h-10 text-orange-600 mb-4" />
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Plan Meals</h4>
          <p className="text-gray-600 dark:text-gray-400">Create your weekly plan</p>
        </button>
        <button onClick={() => setCurrentPage('grocery')} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition text-left">
          <ShoppingCart className="w-10 h-10 text-lime-600 mb-4" />
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Grocery List</h4>
          <p className="text-gray-600 dark:text-gray-400">Auto-generated shopping list</p>
        </button>
      </div>
    </main>
  );
};

// ────────────────────────────────────────────────
// RECIPES PAGE
// ────────────────────────────────────────────────

const RecipesPage = () => {
  const ctx = useContext(AppContext)!;
  const { recipes } = ctx;

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Recipe | null>(null);

  const filtered = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recipes</h2>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelected(recipe)}
          >
            <div className="relative h-48">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={e => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(recipe.name))}
              />
              {recipe.isHealthy && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> Healthy
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{recipe.name}</h3>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {recipe.prepTime + recipe.cookTime} min</div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {recipe.servings}</div>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Calories: </span>
                <span className="font-semibold text-gray-900 dark:text-white">{recipe.nutrition.calories}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

// ────────────────────────────────────────────────
// MEAL PLANNER PAGE
// ────────────────────────────────────────────────

const MealPlannerPage = () => {
  const ctx = useContext(AppContext)!;
  const { recipes, mealPlan, setMealPlan } = ctx;

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday;
  });

  const [addModal, setAddModal] = useState<{ date: string; type: 'breakfast' | 'lunch' | 'dinner' | 'snacks' } | null>(null);

  useEffect(() => {
    if (mealPlan) return;

    const newPlan: MealPlan = {
      id: `plan-${Date.now()}`,
      name: 'Weekly Plan',
      startDate: startDate.toISOString().split('T')[0],
      meals: {}
    };

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      newPlan.meals[d.toISOString().split('T')[0]] = {};
    }

    setMealPlan(newPlan);
  }, [mealPlan, startDate, setMealPlan]);

  const changeWeek = (delta: number) => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + delta * 7);
    setStartDate(newStart);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr,
      display: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  const addMeal = (date: string, type: 'breakfast' | 'lunch' | 'dinner' | 'snacks', recipe: Recipe) => {
    if (!mealPlan) return;
    const updated = { ...mealPlan };
    if (type === 'snacks') {
      if (!updated.meals[date].snacks) updated.meals[date].snacks = [];
      updated.meals[date].snacks.push(recipe);
    } else {
      updated.meals[date][type] = recipe;
    }
    setMealPlan(updated);
  };

  const removeMeal = (date: string, type: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index?: number) => {
    if (!mealPlan) return;
    const updated = { ...mealPlan };
    if (type === 'snacks' && index !== undefined) {
      updated.meals[date].snacks = updated.meals[date].snacks?.filter((_, i) => i !== index) ?? [];
    } else {
      delete updated.meals[date][type];
    }
    setMealPlan(updated);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meal Planner</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => changeWeek(-1)} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            Week of {startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeWeek(1)} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map(day => {
          const dayMeals = mealPlan?.meals[day.date] || {};

          return (
            <div key={day.date} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h3 className="text-center font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-gray-700">
                {day.display}
              </h3>

              {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map(type => (
                <div key={type} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize font-medium text-gray-700 dark:text-gray-300 text-sm">{type}</span>
                    <button onClick={() => setAddModal({ date: day.date, type })} className="text-emerald-600 hover:text-emerald-800">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {type !== 'snacks' ? (
                    dayMeals[type] ? (
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white truncate">{dayMeals[type]!.name}</span>
                        <button onClick={() => removeMeal(day.date, type)} className="text-red-500 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic">No meal</div>
                    )
                  ) : (
                    <div className="space-y-2">
                      {dayMeals.snacks?.map((snack, idx) => (
                        <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white truncate">{snack.name}</span>
                          <button onClick={() => removeMeal(day.date, 'snacks', idx)} className="text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )) || <div className="text-xs text-gray-500 dark:text-gray-400 italic">No snacks</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Add {addModal.type}
            </h3>
            <select
              onChange={e => {
                const recipe = recipes.find(r => r.id === e.target.value);
                if (recipe) {
                  addMeal(addModal.date, addModal.type, recipe);
                  setAddModal(null);
                }
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            >
              <option value="">Select recipe...</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.category})
                </option>
              ))}
            </select>
            <button
              onClick={() => setAddModal(null)}
              className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

// ────────────────────────────────────────────────
// GROCERY PAGE
// ────────────────────────────────────────────────

const GroceryListPage = () => {
  const ctx = useContext(AppContext)!;
  const { mealPlan } = ctx;

  const [list, setList] = useState<GroceryItem[]>([]);

  useEffect(() => {
    if (!mealPlan) {
      setList([]);
      return;
    }

    const map = new Map<string, GroceryItem>();

    Object.values(mealPlan.meals).forEach(day => {
      ['breakfast', 'lunch', 'dinner'].forEach(type => {
        const r = day[type as keyof typeof day];
        if (r) {
          r.ingredients.forEach(ing => {
            const key = `${ing.name}|${ing.unit}`;
            if (map.has(key)) {
              map.get(key)!.amount += ing.amount;
            } else {
              map.set(key, { ...ing, checked: false });
            }
          });
        }
      });

      day.snacks?.forEach(s => {
        s.ingredients.forEach(ing => {
          const key = `${ing.name}|${ing.unit}`;
          if (map.has(key)) {
            map.get(key)!.amount += ing.amount;
          } else {
            map.set(key, { ...ing, checked: false });
          }
        });
      });
    });

    setList(Array.from(map.values()));
  }, [mealPlan]);

  const toggle = (index: number) => {
    setList(prev => {
      const next = [...prev];
      next[index].checked = !next[index].checked;
      return next;
    });
  };

  const grouped = list.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Grocery List</h2>

      {list.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No items yet — create a meal plan first</p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">{cat}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md divide-y dark:divide-gray-700">
              {items.map((item, i) => (
                <div key={i} className="flex items-center p-4">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggle(list.indexOf(item))}
                    className="w-5 h-5 text-emerald-600 rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className={`ml-4 ${item.checked ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {item.amount} {item.unit} {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
};

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────

export default function NigerianMealPlanner() {
  const ctx = useContext(AppContext);

  return (
    <AppProvider>
      <div className={`min-h-screen ${ctx?.theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        {ctx?.currentPage === 'home' && <HomePage />}
        {ctx?.currentPage === 'recipes' && <RecipesPage />}
        {ctx?.currentPage === 'planner' && <MealPlannerPage />}
        {ctx?.currentPage === 'grocery' && <GroceryListPage />}
      </div>
    </AppProvider>
  );
}
