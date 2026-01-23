'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, ChefHat, ShoppingCart, TrendingUp, Search, Clock, Users, Utensils, Leaf, Home, Check, AlertTriangle } from 'lucide-react';

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

// Sample Recipes
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Low-Salt Jollof Rice',
    category: 'lunch',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400',
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
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
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
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
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
    imageUrl: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400',
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
  }
];

// Context
const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nigerianMealPlanner');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setRecipes(data.recipes || SAMPLE_RECIPES);
          setMealPlan(data.mealPlan || null);
        } catch (e) {
          console.error('Error loading data:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nigerianMealPlanner', JSON.stringify({ recipes, mealPlan }));
      } catch (e) {
        console.error('Error saving data:', e);
      }
    }
  }, [recipes, mealPlan]);

  return (
    <AppContext.Provider value={{ recipes, setRecipes, mealPlan, setMealPlan, currentPage, setCurrentPage }}>
      {children}
    </AppContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Nigerian Meal Planner</h1>
          </div>
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

// HomePage Component
const HomePage = () => {
  const { recipes, setCurrentPage } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Nigerian Meal Planner</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Total Recipes</h3>
            <Utensils className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{recipes.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Healthy Recipes</h3>
            <Leaf className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {recipes.filter(r => r.isHealthy).length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lime-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Low Salt Options</h3>
            <Check className="w-6 h-6 text-lime-600" />
          </div>
          <p className="text-3xl font-bold text-lime-600">
            {recipes.filter(r => r.nutrition.sodium < 300).length}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentPage('recipes')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <Utensils className="w-8 h-8 text-emerald-600 mb-2" />
          <h4 className="font-bold text-gray-900">Browse Recipes</h4>
          <p className="text-sm text-gray-600">Explore Nigerian recipes</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('planner')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <Calendar className="w-8 h-8 text-orange-600 mb-2" />
          <h4 className="font-bold text-gray-900">Plan Week</h4>
          <p className="text-sm text-gray-600">Create meal plan</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('grocery')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <ShoppingCart className="w-8 h-8 text-lime-600 mb-2" />
          <h4 className="font-bold text-gray-900">Grocery List</h4>
          <p className="text-sm text-gray-600">Generate list</p>
        </button>
      </div>
    </div>
  );
};

// RecipesPage Component
const RecipesPage = () => {
  const { recipes } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Nigerian Recipes</h2>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              {recipe.isHealthy && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Leaf className="w-3 h-3 mr-1" />
                  Healthy
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{recipe.name}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2 space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {recipe.prepTime + recipe.cookTime}min
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {recipe.servings}
                </div>
              </div>
              
              <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <p className="font-semibold">{recipe.nutrition.calories}</p>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <p className="font-semibold">{recipe.nutrition.protein}g</p>
                </div>
                <div>
                  <span className={`${recipe.nutrition.sodium > 600 ? 'text-red-600' : 'text-gray-600'}`}>
                    Sodium:
                  </span>
                  <p className={`font-semibold ${recipe.nutrition.sodium > 600 ? 'text-red-600' : ''}`}>
                    {recipe.nutrition.sodium}mg
                    {recipe.nutrition.sodium > 600 && ' ⚠️'}
                  </p>
                </div>
                <div>
                  <span className={`${recipe.nutrition.sugar > 10 ? 'text-red-600' : 'text-gray-600'}`}>
                    Sugar:
                  </span>
                  <p className={`font-semibold ${recipe.nutrition.sugar > 10 ? 'text-red-600' : ''}`}>
                    {recipe.nutrition.sugar}g
                    {recipe.nutrition.sugar > 10 && ' ⚠️'}
                  </p>
                </div>
              </div>

              {recipe.healthNotes && (
                <div className="mt-3 bg-emerald-50 p-2 rounded text-xs text-emerald-800">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {recipe.healthNotes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder Pages
const MealPlannerPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Meal Planner</h2>
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 text-lg mb-2">Weekly Meal Planning</p>
      <p className="text-gray-500">Plan your meals for the entire week</p>
    </div>
  </div>
);

const NutritionPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Nutrition Dashboard</h2>
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 text-lg mb-2">Track Your Nutrition</p>
      <p className="text-gray-500">Monitor your daily intake and health goals</p>
    </div>
  </div>
);

const GroceryListPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Grocery List</h2>
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 text-lg mb-2">Shopping Made Easy</p>
      <p className="text-gray-500">Auto-generate your grocery list from meal plans</p>
    </div>
  </div>
);

// Main App
export default function NigerianMealPlanner() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
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
