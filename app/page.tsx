'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, ChefHat, ShoppingCart, TrendingUp, Plus, Search, Filter, X, Check, Download, Share2, AlertTriangle, Clock, Users, Utensils, Leaf, ChevronLeft, ChevronRight, Edit, Trash2, Save, Home } from 'lucide-react';

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

interface GroceryItem {
  ingredient: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  estimatedCost?: number;
}

// Sample Nigerian Recipes Data
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
      { name: 'Vegetable oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Curry powder', amount: 1, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Thyme', amount: 1, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Bay leaves', amount: 2, unit: 'pieces', category: 'Spices & Condiments' },
      { name: 'Chicken stock (low-sodium)', amount: 4, unit: 'cups', category: 'Others' }
    ],
    instructions: [
      'Blend tomatoes, peppers, and half the onions until smooth',
      'Heat oil in a pot and fry the tomato blend until oil rises (about 20 mins)',
      'Add curry, thyme, and bay leaves. Stir well',
      'Pour in the low-sodium stock and bring to boil',
      'Add washed rice, stir, and cover to cook on low heat',
      'Cook for 30-35 minutes until rice is tender',
      'Fluff with a fork and serve hot'
    ],
    nutrition: {
      calories: 320,
      protein: 6,
      carbs: 58,
      fats: 7,
      fiber: 2,
      sodium: 280,
      sugar: 4
    },
    tags: ['low-salt', 'vegetarian', 'Nigerian classic'],
    isHealthy: true,
    healthNotes: 'Reduced salt version using low-sodium stock and natural flavors'
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
      { name: 'Ground egusi (melon seeds)', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Ugwu (pumpkin leaves)', amount: 4, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Spinach', amount: 2, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Stockfish', amount: 200, unit: 'g', category: 'Proteins' },
      { name: 'Palm oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Pepper', amount: 2, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Crayfish', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' }
    ],
    instructions: [
      'Soak and debone stockfish, then cook until tender',
      'Mix ground egusi with water to form a paste',
      'Heat palm oil in a pot, add onions and pepper',
      'Add egusi paste in small lumps, cook for 10 minutes',
      'Add stockfish and stock, simmer for 15 minutes',
      'Add washed ugwu and spinach, cook for 5 minutes',
      'Season lightly and serve with your choice of swallow'
    ],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 12,
      fats: 28,
      fiber: 5,
      sodium: 420,
      sugar: 3
    },
    tags: ['high-protein', 'nutritious', 'traditional'],
    isHealthy: true,
    healthNotes: 'Rich in vegetables and protein, moderate palm oil use'
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
      { name: 'Tilapia or Mackerel', amount: 2, unit: 'pieces', category: 'Proteins' },
      { name: 'Bell peppers', amount: 3, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Scotch bonnet', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Garlic', amount: 3, unit: 'cloves', category: 'Spices & Condiments' },
      { name: 'Ginger', amount: 1, unit: 'inch', category: 'Spices & Condiments' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Clean fish and season with minimal salt, pepper, and garlic',
      'Grill fish for 10-12 minutes each side until cooked',
      'Blend peppers, onions, garlic, and ginger',
      'Heat oil and fry pepper blend for 8-10 minutes',
      'Pour sauce over grilled fish and serve with salad'
    ],
    nutrition: {
      calories: 280,
      protein: 35,
      carbs: 8,
      fats: 12,
      fiber: 2,
      sodium: 180,
      sugar: 5
    },
    tags: ['low-salt', 'high-protein', 'grilled'],
    isHealthy: true,
    healthNotes: 'Excellent protein source, grilled not fried, rich in omega-3'
  },
  {
    id: '4',
    name: 'Moi Moi (Reduced Salt)',
    category: 'breakfast',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    ingredients: [
      { name: 'Beans (peeled)', amount: 3, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Red bell pepper', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Crayfish', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Eggs', amount: 3, unit: 'pieces', category: 'Proteins' }
    ],
    instructions: [
      'Blend beans with peppers and onions until smooth',
      'Add crayfish, minimal salt, and oil to the blend',
      'Whisk mixture until light and fluffy',
      'Pour into greased containers or leaves',
      'Steam for 45 minutes until firm',
      'Allow to cool slightly before serving'
    ],
    nutrition: {
      calories: 220,
      protein: 12,
      carbs: 28,
      fats: 6,
      fiber: 8,
      sodium: 160,
      sugar: 2
    },
    tags: ['low-salt', 'high-fiber', 'protein-rich'],
    isHealthy: true,
    healthNotes: 'High in protein and fiber, minimal salt, nutrient-dense'
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
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Pepper', amount: 2, unit: 'tsp', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Boil beans with minimal salt until soft (about 40 mins)',
      'Peel and cut plantains into chunks',
      'Add plantains to beans and cook for 10 more minutes',
      'Heat palm oil separately with onions and pepper',
      'Pour oil mixture over beans and plantain',
      'Stir gently and serve warm'
    ],
    nutrition: {
      calories: 340,
      protein: 14,
      carbs: 52,
      fats: 8,
      fiber: 12,
      sodium: 120,
      sugar: 18
    },
    tags: ['vegetarian', 'high-fiber', 'budget-friendly'],
    isHealthy: true,
    healthNotes: 'Excellent fiber source, plant-based protein, natural sweetness'
  }
];

// Context
const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const stored = localStorage.getItem('nigerianMealPlanner');
    if (stored) {
      const data = JSON.parse(stored);
      setRecipes(data.recipes || SAMPLE_RECIPES);
      setMealPlan(data.mealPlan || null);
    } else {
      setRecipes(SAMPLE_RECIPES);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nigerianMealPlanner', JSON.stringify({ recipes, mealPlan }));
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
            { id: 'planner', icon: Calendar, label: 'Meal Planner' },
            { id: 'nutrition', icon: TrendingUp, label: 'Nutrition' },
            { id: 'grocery', icon: ShoppingCart, label: 'Grocery List' }
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
  const { mealPlan, recipes, setCurrentPage } = useContext(AppContext);
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mealPlan?.meals[today];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Nigerian Meal Planner</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentPage('recipes')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <Utensils className="w-8 h-8 text-emerald-600 mb-2" />
          <h4 className="font-bold text-gray-900">Browse Recipes</h4>
          <p className="text-sm text-gray-600">Explore {recipes.length} Nigerian recipes</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('planner')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <Calendar className="w-8 h-8 text-orange-600 mb-2" />
          <h4 className="font-bold text-gray-900">Plan Week</h4>
          <p className="text-sm text-gray-600">Create your meal plan</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('grocery')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <ShoppingCart className="w-8 h-8 text-lime-600 mb-2" />
          <h4 className="font-bold text-gray-900">Grocery List</h4>
          <p className="text-sm text-gray-600">Generate shopping list</p>
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
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200">
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{recipe.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                {recipe.prepTime + recipe.cookTime}min
              </div>
              <div className="flex justify-between text-sm">
                <span className={recipe.nutrition.sodium > 600 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                  Sodium: {recipe.nutrition.sodium}mg
                </span>
                <span className={recipe.nutrition.sugar > 10 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                  Sugar: {recipe.nutrition.sugar}g
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// MealPlannerPage Component
const MealPlannerPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Meal Planner</h2>
      <p className="text-gray-600">Coming soon: Weekly meal planning interface</p>
    </div>
  );
};

// NutritionPage Component
const NutritionPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Nutrition Dashboard</h2>
      <p className="text-gray-600">Coming soon: Nutrition tracking and insights</p>
    </div>
  );
};

// GroceryListPage Component
const GroceryListPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Grocery List</h2>
      <p className="text-gray-600">Coming soon: Auto-generated grocery lists</p>
    </div>
  );
};

// Main App Component
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
