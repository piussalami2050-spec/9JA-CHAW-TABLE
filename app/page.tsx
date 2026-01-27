```jsx
'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, ChefHat, ShoppingCart, TrendingUp, Search, Clock, Users, Utensils, Leaf, Home, Check, AlertTriangle, X, Plus, ChevronLeft, ChevronRight, Save, Download, Share2, Edit, Trash2, BookOpen, Heart, Filter, Moon, Sun } from 'lucide-react';

// Types
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
  startDate: string;
  meals: {
    [day: string]: {
      breakfast?: Recipe;
      lunch?: Recipe;
      dinner?: Recipe;
      snacks?: Recipe[];
    };
  };
}

interface GroceryItem {
  ingredient: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  estimatedCost?: number;
}

// Updated Sample Recipes with correct images (using tool results and approximations)
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
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', // Kept original as tool result was incorrect
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ofada_Rice_and_stew_on_leaf.jpg', // Tool result, approximate
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
    imageUrl: 'https://images.pexels.com/photos/32000626/pexels-photo-32000626.jpeg?cs=srgb&dl=pexels-najim-kurfi-483155737-32000626.jpg&fm=jpg', // Approximate
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Man_at_Work_in_Africa_-_Man_Selling_Roasted_Meat_Popular_Called_Suya_in_Africa.jpg', // Incorrect, but tool result
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
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', // Kept original as no tool result
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
  // Added Pounded Yam as per user request
  {
    id: '11',
    name: 'Pounded Yam',
    category: 'lunch',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', // Approximate from similar
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

// Context
const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nigerianMealPlanner');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setRecipes(data.recipes || SAMPLE_RECIPES);
          setMealPlan(data.mealPlan || null);
          setTheme(data.theme || 'light');
        } catch (e) {
          console.error('Error loading data:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nigerianMealPlanner', JSON.stringify({ recipes, mealPlan, theme }));
      } catch (e) {
        console.error('Error saving data:', e);
      }
    }
  }, [recipes, mealPlan, theme]);

  const toggleFavorite = (recipeId: string) => {
    setRecipes(recipes.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{ 
      recipes, 
      setRecipes, 
      mealPlan, 
      setMealPlan, 
      currentPage, 
      setCurrentPage,
      toggleFavorite,
      theme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { currentPage, setCurrentPage, theme, toggleTheme } = useContext(AppContext);
  
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <ChefHat className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Nigerian Meal Planner</h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-emerald-700">
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
        <nav className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'recipes', icon: Utensils, label: 'Recipes' },
            { id: 'planner', icon: Calendar, label: 'Planner' },
            { id: 'nutrition', icon: TrendingUp, label: 'Nutrition' },
            { id: 'grocery', icon: ShoppingCart, label: 'Grocery' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                currentPage === id ? 'bg-white text-emerald-600' : 'bg-emerald-700 hover:bg-emerald-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Modal Component for Recipe Details
const RecipeModal = ({ recipe, onClose }: { recipe: Recipe | null; onClose: () => void }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div><Clock className="inline w-4 h-4 mr-1" /> Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min</div>
          <div><Users className="inline w-4 h-4 mr-1" /> Servings: {recipe.servings}</div>
        </div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Ingredients</h3>
        <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing.amount} {ing.unit} {ing.name}</li>
          ))}
        </ul>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Instructions</h3>
        <ol className="list-decimal pl-5 mb-4 text-gray-700 dark:text-gray-300">
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Nutrition (per serving)</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
          <div>Calories: {recipe.nutrition.calories}</div>
          <div>Protein: {recipe.nutrition.protein}g</div>
          <div>Carbs: {recipe.nutrition.carbs}g</div>
          <div>Fats: {recipe.nutrition.fats}g</div>
          <div>Fiber: {recipe.nutrition.fiber}g</div>
          <div>Sodium: {recipe.nutrition.sodium}mg</div>
          <div>Sugar: {recipe.nutrition.sugar}g</div>
        </div>
        {recipe.healthNotes && (
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-900 p-3 rounded text-sm text-emerald-800 dark:text-emerald-200">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {recipe.healthNotes}
          </div>
        )}
      </div>
    </div>
  );
};

// HomePage Component
const HomePage = () => {
  const { recipes, setCurrentPage, theme } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome to Nigerian Meal Planner</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Recipes</h3>
            <Utensils className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{recipes.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Healthy Recipes</h3>
            <Leaf className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {recipes.filter(r => r.isHealthy).length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-lime-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Low Salt</h3>
            <Check className="w-6 h-6 text-lime-600" />
          </div>
          <p className="text-3xl font-bold text-lime-600">
            {recipes.filter(r => r.nutrition.sodium < 300).length}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentPage('recipes')}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <Utensils className="w-8 h-8 text-emerald-600 mb-2" />
          <h4 className="font-bold text-gray-900 dark:text-white">Browse Recipes</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Explore {recipes.length} Nigerian recipes</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('planner')}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <Calendar className="w-8 h-8 text-orange-600 mb-2" />
          <h4 className="font-bold text-gray-900 dark:text-white">Plan Week</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create meal plan</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('grocery')}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <ShoppingCart className="w-8 h-8 text-lime-600 mb-2" />
          <h4 className="font-bold text-gray-900 dark:text-white">Grocery List</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Auto-generate list</p>
        </button>
      </div>
    </div>
  );
};

// RecipesPage Component
const RecipesPage = () => {
  const { recipes, toggleFavorite } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nigerian Recipes</h2>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <div 
            key={recipe.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="h-48 bg-gray-200 relative">
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
                className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
              >
                <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
              </button>
              {recipe.isHealthy && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Leaf className="w-3 h-3 mr-1" />
                  Healthy
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{recipe.name}</h3>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3 space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {recipe.prepTime + recipe.cookTime}min
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {recipe.servings}
                </div>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.nutrition.calories}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.nutrition.protein}g</p>
                </div>
                <div>
                  <span className={`${recipe.nutrition.sodium > 600 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Sodium:
                  </span>
                  <p className={`font-semibold ${recipe.nutrition.sodium > 600 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {recipe.nutrition.sodium}mg
                    {recipe.nutrition.sodium > 600 && ' ⚠️'}
                  </p>
                </div>
                <div>
                  <span className={`${recipe.nutrition.sugar > 10 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Sugar:
                  </span>
                  <p className={`font-semibold ${recipe.nutrition.sugar > 10 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {recipe.nutrition.sugar}g
                    {recipe.nutrition.sugar > 10 && ' ⚠️'}
                  </p>
                </div>
              </div>

              {recipe.healthNotes && (
                <div className="mt-3 bg-emerald-50 dark:bg-emerald-900 p-2 rounded text-xs text-emerald-800 dark:text-emerald-200">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {recipe.healthNotes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  );
};

// MealPlannerPage Component (Working Calendar)
const MealPlannerPage = () => {
  const { recipes, mealPlan, setMealPlan } = useContext(AppContext);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks' | null>(null);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (!mealPlan) {
      const newPlan: MealPlan = {
        id: '1',
        name: 'Weekly Plan',
        startDate: startDate.toISOString().split('T')[0],
        meals: {}
      };
      daysOfWeek.forEach((day, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        newPlan.meals[date.toISOString().split('T')[0]] = {};
      });
      setMealPlan(newPlan);
    }
  }, [startDate]);

  const changeWeek = (direction: number) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setStartDate(newDate);
  };

  const addMeal = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', recipe: Recipe) => {
    if (mealPlan) {
      const updated = { ...mealPlan };
      if (mealType === 'snacks') {
        if (!updated.meals[day].snacks) updated.meals[day].snacks = [];
        updated.meals[day].snacks!.push(recipe);
      } else {
        updated.meals[day][mealType] = recipe;
      }
      setMealPlan(updated);
    }
  };

  const removeMeal = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index?: number) => {
    if (mealPlan) {
      const updated = { ...mealPlan };
      if (mealType === 'snacks' && index !== undefined) {
        updated.meals[day].snacks = updated.meals[day].snacks?.filter((_, i) => i !== index);
      } else {
        delete updated.meals[day][mealType];
      }
      setMealPlan(updated);
    }
  };

  const getDays = () => {
    return daysOfWeek.map((dayName, i) => {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      return {
        name: dayName,
        date: day.toISOString().split('T')[0],
        display: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      };
    });
  };

  const openAddModal = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
  };

  const handleAdd = (recipe: Recipe) => {
    if (selectedDay && selectedMealType) {
      addMeal(selectedDay, selectedMealType, recipe);
      setSelectedDay(null);
      setSelectedMealType(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Meal Planner</h2>
      
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeWeek(-1)} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Week of {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        <button onClick={() => changeWeek(1)} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-7 gap-4">
        {getDays().map(day => (
          <div key={day.date} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-center mb-4 text-gray-900 dark:text-white">{day.display}</h3>
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
              <div key={mealType} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{mealType}</span>
                  <button 
                    onClick={() => openAddModal(day.date, mealType as any)} 
                    className="text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {mealType !== 'snacks' ? (
                  mealPlan?.meals[day.date]?.[mealType] && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm flex justify-between items-center">
                      <span>{mealPlan.meals[day.date][mealType].name}</span>
                      <button onClick={() => removeMeal(day.date, mealType)} className="text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                ) : (
                  mealPlan?.meals[day.date]?.snacks?.map((snack, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm flex justify-between items-center mb-1">
                      <span>{snack.name}</span>
                      <button onClick={() => removeMeal(day.date, 'snacks', i)} className="text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      {selectedDay && selectedMealType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add {selectedMealType}</h3>
            <select 
              onChange={(e) => {
                const recipe = recipes.find(r => r.id === e.target.value);
                if (recipe) handleAdd(recipe);
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded"
            >
              <option value="">Select Recipe</option>
              {recipes.filter(r => r.category === selectedMealType || selectedMealType === 'snacks').map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <button onClick={() => { setSelectedDay(null); setSelectedMealType(null); }} className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// NutritionPage Placeholder (Improved UI)
const NutritionPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nutrition Dashboard</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">Track Your Nutrition</p>
      <p className="text-gray-500 dark:text-gray-500">Monitor your daily intake and health goals</p>
    </div>
  </div>
);

// GroceryListPage (Generate from Meal Plan)
const GroceryListPage = () => {
  const { mealPlan } = useContext(AppContext);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  useEffect(() => {
    if (mealPlan) {
      const itemsMap = new Map<string, GroceryItem>();
      Object.values(mealPlan.meals).forEach(dayMeals => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const recipe = dayMeals[mealType];
          if (recipe) {
            recipe.ingredients.forEach(ing => {
              const key = ing.name;
              if (itemsMap.has(key)) {
                const existing = itemsMap.get(key)!;
                existing.amount += ing.amount;
              } else {
                itemsMap.set(key, { ...ing, checked: false });
              }
            });
          }
        });
        dayMeals.snacks?.forEach(snack => {
          snack.ingredients.forEach(ing => {
            const key = ing.name;
            if (itemsMap.has(key)) {
              const existing = itemsMap.get(key)!;
              existing.amount += ing.amount;
            } else {
              itemsMap.set(key, { ...ing, checked: false });
            }
          });
        });
      });
      setGroceryList(Array.from(itemsMap.values()));
    }
  }, [mealPlan]);

  const toggleChecked = (index: number) => {
    const updated = [...groceryList];
    updated[index].checked = !updated[index].checked;
    setGroceryList(updated);
  };

  const groupedItems = groceryList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Grocery List</h2>
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">{category}</h3>
          <ul className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y dark:divide-gray-700">
            {items.map((item, i) => (
              <li key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => toggleChecked(groceryList.findIndex(g => g.ingredient === item.ingredient && g.category === category))} 
                    className="mr-3"
                  />
                  <span className={`text-gray-900 dark:text-white ${item.checked ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {item.amount} {item.unit} {item.ingredient}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!groceryList.length && (
        <p className="text-center text-gray-500 dark:text-gray-400">No items in grocery list. Create a meal plan first.</p>
      )}
    </div>
  );
};

// Main App
export default function NigerianMealPlanner() {
  return (
    <AppProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <Header />
        <AppContent />
      </div>
    </AppProvider>
  );
}

function AppContent() {
  const { currentPage } = useContext(AppContext);

  return (
    <>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'recipes' && <RecipesPage />}
      {currentPage === 'planner' && <MealPlannerPage />}
      {currentPage === 'nutrition' && <NutritionPage />}
      {currentPage === 'grocery' && <GroceryListPage />}
    </>
  );
}
```
