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
  },
  {
    id: '6',
    name: 'Efo Riro with Lean Meat',
    category: 'lunch',
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    ingredients: [
      { name: 'Spinach (Efo)', amount: 6, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Lean beef', amount: 300, unit: 'g', category: 'Proteins' },
      { name: 'Palm oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Tomatoes', amount: 3, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Pepper', amount: 2, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Crayfish', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Cook lean beef until tender, reserve stock',
      'Blend tomatoes and pepper',
      'Heat palm oil, fry onions and tomato blend',
      'Add meat and crayfish, cook for 10 minutes',
      'Add washed and chopped spinach',
      'Stir and cook for 5 minutes, serve hot'
    ],
    nutrition: {
      calories: 290,
      protein: 22,
      carbs: 14,
      fats: 16,
      fiber: 4,
      sodium: 340,
      sugar: 6
    },
    tags: ['high-protein', 'iron-rich', 'traditional'],
    isHealthy: true,
    healthNotes: 'Rich in iron and vitamins from spinach, lean protein source'
  },
  {
    id: '7',
    name: 'Yam Porridge (Asaro)',
    category: 'lunch',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
    ingredients: [
      { name: 'Yam', amount: 1, unit: 'medium tuber', category: 'Grains & Cereals' },
      { name: 'Palm oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Tomatoes', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Pepper', amount: 2, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Smoked fish', amount: 150, unit: 'g', category: 'Proteins' },
      { name: 'Spinach', amount: 2, unit: 'cups', category: 'Vegetables & Fruits' }
    ],
    instructions: [
      'Peel and cut yam into chunks',
      'Boil yam in water until partially soft',
      'Blend tomatoes, pepper, and onions',
      'Add palm oil and tomato blend to yam',
      'Add smoked fish and cook until yam is very soft',
      'Mash slightly, add spinach, cook 3 minutes',
      'Serve hot as a complete meal'
    ],
    nutrition: {
      calories: 380,
      protein: 14,
      carbs: 58,
      fats: 10,
      fiber: 6,
      sodium: 380,
      sugar: 4
    },
    tags: ['comfort-food', 'filling', 'traditional'],
    isHealthy: true,
    healthNotes: 'Good energy source, contains vegetables and protein'
  },
  {
    id: '8',
    name: 'Akara (Reduced Salt)',
    category: 'breakfast',
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
    ingredients: [
      { name: 'Beans (peeled)', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Pepper', amount: 1, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Vegetable oil', amount: 2, unit: 'cups', category: 'Oils & Fats' }
    ],
    instructions: [
      'Blend beans with minimal water until smooth',
      'Chop onions and pepper finely',
      'Mix into bean paste with minimal salt',
      'Whip mixture until fluffy',
      'Heat oil in a pan',
      'Scoop and fry bean balls until golden',
      'Drain on paper towels and serve'
    ],
    nutrition: {
      calories: 180,
      protein: 10,
      carbs: 20,
      fats: 6,
      fiber: 6,
      sodium: 140,
      sugar: 1
    },
    tags: ['low-salt', 'protein-rich', 'breakfast'],
    isHealthy: true,
    healthNotes: 'Good protein source, minimal salt, fiber-rich'
  },
  {
    id: '9',
    name: 'Grilled Chicken Suya',
    category: 'dinner',
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    ingredients: [
      { name: 'Chicken breast', amount: 500, unit: 'g', category: 'Proteins' },
      { name: 'Suya spice (yaji)', amount: 3, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Groundnut powder', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 2, unit: 'tbsp', category: 'Oils & Fats' }
    ],
    instructions: [
      'Cut chicken into strips or cubes',
      'Mix suya spice with oil to form a paste',
      'Marinate chicken for at least 20 minutes',
      'Thread chicken onto skewers',
      'Grill for 8-10 minutes each side',
      'Sprinkle with groundnut powder',
      'Serve with sliced onions and tomatoes'
    ],
    nutrition: {
      calories: 240,
      protein: 32,
      carbs: 6,
      fats: 10,
      fiber: 2,
      sodium: 320,
      sugar: 2
    },
    tags: ['high-protein', 'grilled', 'low-carb'],
    isHealthy: true,
    healthNotes: 'Lean protein, grilled not fried, controlled spice levels'
  },
  {
    id: '10',
    name: 'Fish Pepper Soup',
    category: 'dinner',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    ingredients: [
      { name: 'Fresh fish (catfish)', amount: 4, unit: 'pieces', category: 'Proteins' },
      { name: 'Pepper soup spice', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Scotch bonnet', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Garlic', amount: 3, unit: 'cloves', category: 'Spices & Condiments' },
      { name: 'Ginger', amount: 1, unit: 'inch', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Clean fish thoroughly',
      'Boil water with onions, pepper, ginger, and garlic',
      'Add pepper soup spice and minimal salt',
      'Add fish pieces and cook for 15-20 minutes',
      'Adjust seasoning if needed',
      'Serve hot as soup or with boiled yam'
    ],
    nutrition: {
      calories: 180,
      protein: 28,
      carbs: 4,
      fats: 6,
      fiber: 1,
      sodium: 280,
      sugar: 2
    },
    tags: ['low-carb', 'high-protein', 'light'],
    isHealthy: true,
    healthNotes: 'Low calorie, high protein, warming and nutritious'
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

// Components
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

const HomePage = () => {
  const { mealPlan, recipes, setCurrentPage } = useContext(AppContext);
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mealPlan?.meals[today];

  const weeklyNutrition = React.useMemo(() => {
    if (!mealPlan) return null;
    
    let totals = { calories: 0, protein: 0, carbs: 0, fats: 0, sodium: 0, sugar: 0 };
    Object.values(mealPlan.meals).forEach(day => {
      [day.breakfast, day.lunch, day.dinner, ...(day.snacks || [])].forEach(meal => {
        if (meal) {
          totals.calories += meal.nutrition.calories;
          totals.protein += meal.nutrition.protein;
          totals.carbs += meal.nutrition.carbs;
          totals.fats += meal.nutrition.fats;
          totals.sodium += meal.nutrition.sodium;
          totals.sugar += meal.nutrition.sugar;
        }
      });
    });
    
    return totals;
  }, [mealPlan]);

  const healthTips = [
    "Use herbs like basil, thyme, and bay leaves instead of extra salt",
    "Swap white rice for brown rice or add vegetables to reduce portions",
    "Grill or bake proteins instead of frying to reduce oil intake",
    "Add more leafy greens like ugwu and spinach to your soups",
    "Use natural sweeteners like dates in moderation for desserts"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Your Meal Planner</h2>
      
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
            <h3 className="text-lg font-semibold text-gray-800">Planned Days</h3>
            <Calendar className="w-6 h-6 text-lime-600" />
          </div>
          <p className="text-3xl font-bold text-lime-600">
            {mealPlan ? Object.keys(mealPlan.meals).length : 0}
          </p>
        </div>
      </div>

      {weeklyNutrition && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
            Weekly Nutrition Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Calories</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(weeklyNutrition.calories)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Sodium/Day</p>
              <p className={`text-2xl font-bold ${weeklyNutrition.sodium/7 > 2000 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.round(weeklyNutrition.sodium/7)}mg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Sugar/Day</p>
              <p className={`text-2xl font-bold ${weeklyNutrition.sugar/7 > 50 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.round(weeklyNutrition.sugar/7)}g
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Meals</h3>
        {todayMeals ? (
          <div className="space-y-4">
            {todayMeals.breakfast && (
              <div className="border-l-4 border-emerald-500 pl-4">
                <p className="text-sm text-gray-600">Breakfast</p>
                <p className="font-semibold text-gray-900">{todayMeals.breakfast.name}</p>
              </div>
            )}
            {todayMeals.lunch && (
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm text-gray-600">Lunch</p>
                <p className="font-semibold text-gray-900">{todayMeals.lunch.name}</p>
              </div>
            )}
            {todayMeals.dinner && (
              <div className="border-l-4 border-lime-500 pl-4">
                <p className="text-sm text-gray-600">Dinner</p>
                <p className="font-semibold text-gray-900">{todayMeals.dinner.name}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-4">No meals planned for today</p>
            <button
              onClick={() => setCurrentPage('planner')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Plan Your Meals
            </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-emerald-600" />
          Health Tip of the Day
        </h3>
        <p className="text-gray-700">{healthTips[Math.floor(Math.random() * healthTips.length)]}</p>
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

const RecipesPage = () => {
  const { recipes, setCurrentPage } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nigerian Recipes</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snacks</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
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
              
              <div className="flex flex-wrap gap-1 mb-3">
                {recipe.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="border-t pt-3 flex justify-between items-center text-sm">
                <div>
                  <span className={`font-semibold ${recipe.nutrition.sodium > 600 ? 'text-red-600' : 'text-gray-700'}`}>
                    Sodium: {recipe.nutrition.sodium}mg
                  </span>
                </div>
                <div>
                  <span className={`font-semibold ${recipe.nutrition.sugar > 10 ? 'text-red-600' : 'text-gray-700'}`}>
                    Sugar: {recipe.nutrition.sugar}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No recipes found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

const RecipeDetail = ({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) => {
  const { mealPlan, setMealPlan } = useContext(AppContext);
  const [servings, setServings] = useState(recipe.servings);
  
  const multiplier = servings / recipe.servings;
  
  const scaledNutrition = {
    calories: Math.round(recipe.nutrition.calories * multiplier),
    protein: Math.round(recipe.nutrition.protein * multiplier),
    carbs: Math.round(recipe.nutrition.carbs * multiplier),
    fats: Math.round(recipe.nutrition.fats * multiplier),
    fiber: Math.round(recipe.nutrition.fiber * multiplier),
    sodium: Math.round(recipe.nutrition.sodium * multiplier),
    sugar: Math.round(recipe.nutrition.sugar * multiplier)
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Recipes
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 md:h-96 bg-gray-200">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {recipe.isHealthy && (
              <div className="bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center">
                <Leaf className="w-4 h-4 mr-2" />
                Healthy Choice
              </div>
            )}
          </div>

          {recipe.healthNotes && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
              <p className="text-emerald-800 flex items-start">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                {recipe.healthNotes}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Prep Time</p>
                <p className="font-semibold">{recipe.prepTime} mins</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Cook Time</p>
                <p className="font-semibold">{recipe.cookTime} mins</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-2 text-lime-600" />
              <div>
                <p className="text-sm text-gray-500">Servings</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-semibold">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      {(ing.amount * multiplier).toFixed(1)} {ing.unit} {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Calories</span>
                  <span>{scaledNutrition.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein</span>
                  <span>{scaledNutrition.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbohydrates</span>
                  <span>{scaledNutrition.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fats</span>
                  <span>{scaledNutrition.fats}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fiber</span>
                  <span>{scaledNutrition.fiber}g</span>
                </div>
                <div className={`flex justify-between font-semibold ${scaledNutrition.sodium > 600 ? 'text-red-600' : ''}`}>
                  <span>Sodium {scaledNutrition.sodium > 600 && '⚠️'}</span>
                  <span>{scaledNutrition.sodium}mg</span>
                </div>
                <div className={`flex justify-between font-semibold ${scaledNutrition.sugar > 10 ? 'text-red-600' : ''}`}>
                  <span>Sugar {scaledNutrition.sugar > 10 && '⚠️'}</span>
                  <span>{scaledNutrition.sugar}g</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex">
                  <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

const MealPlannerPage = () => {
  const { recipes, mealPlan, setMealPlan } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [showRecipeBrowser, setShowRecipeBrowser] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; meal: string } | null>(null);

  function getMonday(d: Date) {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const initializeMealPlan = () => {
    if (!mealPlan) {
      const newPlan: MealPlan = {
        id: Date.now().toString(),
        name: 'My Meal Plan',
        startDate: weekDates[0],
        meals: {}
      };
      weekDates.forEach(date => {
        newPlan.meals[date] = {};
      });
      setMealPlan(newPlan);
    }
  };

  useEffect(() => {
    initializeMealPlan();
  }, []);

  const addMealToSlot = (recipe: Recipe) => {
    if (!selectedSlot || !mealPlan) return;
    
    const updatedPlan = { ...mealPlan };
    if (!updatedPlan.meals[selectedSlot.date]) {
      updatedPlan.meals[selectedSlot.date] = {};
    }
    
    if (selectedSlot.meal === 'snacks') {
      if (!updatedPlan.meals[selectedSlot.date].snacks) {
        updatedPlan.meals[selectedSlot.date].snacks = [];
      }
      updatedPlan.meals[selectedSlot.date].snacks!.push(recipe);
    } else {
      updatedPlan.meals[selectedSlot.date][selectedSlot.meal as 'breakfast' | 'lunch' | 'dinner'] = recipe;
    }
    
    setMealPlan(updatedPlan);
    setShowRecipeBrowser(false);
    setSelectedSlot(null);
  };

  const removeMeal = (date: string, mealType: string, index?: number) => {
    if (!mealPlan) return;
    
    const updatedPlan = { ...mealPlan };
    if (mealType === 'snacks' && index !== undefined) {
      updatedPlan.meals[date].snacks = updatedPlan.meals[date].snacks?.filter((_, i) => i !== index);
    } else {
      delete updatedPlan.meals[date][mealType as 'breakfast' | 'lunch' | 'dinner'];
    }
    setMealPlan(updatedPlan);
  };

  const getDayNutrition = (date: string) => {
    if (!mealPlan?.meals[date]) return null;
    
    const day = mealPlan.meals[date];
    let totals = { calories: 0, sodium: 0, sugar: 0 };
    
    [day.breakfast, day.lunch, day.dinner, ...(day.snacks || [])].forEach(meal => {
      if (meal) {
        totals.calories += meal.nutrition.calories;
        totals.sodium += meal.nutrition.sodium;
        totals.sugar += meal.nutrition.sugar;
      }
    });
    
    return totals;
  };

  if (!mealPlan) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Weekly Meal Planner</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newStart = new Date(weekStart);
              newStart.setDate(newStart.getDate() - 7);
              setWeekStart(newStart);
            }}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              const newStart = new Date(weekStart);
              newStart.setDate(newStart.getDate() + 7);
              setWeekStart(newStart);
            }}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        {weekDates.map((date, idx) => {
          const dateObj = new Date(date);
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
          const dayMeals = mealPlan.meals[date] || {};
          const nutrition = getDayNutrition(date);
          
          return (
            <div key={date} className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center mb-3">
                <p className="font-bold text-gray-900">{dayName}</p>
                <p className="text-sm text-gray-600">{dateObj.getDate()}/{dateObj.getMonth() + 1}</p>
              </div>

              {nutrition && (
                <div className="bg-gray-50 rounded p-2 mb-3 text-xs">
                  <div className="flex justify-between">
                    <span>Cal:</span>
                    <span className="font-semibold">{nutrition.calories}</span>
                  </div>
                  <div className={`flex justify-between ${nutrition.sodium > 2000 ? 'text-red-600' : ''}`}>
                    <span>Na:</span>
                    <span className="font-semibold">{nutrition.sodium}mg</span>
                  </div>
                  <div className={`flex justify-between ${nutrition.sugar > 50 ? 'text-red-600' : ''}`}>
                    <span>Sugar:</span>
                    <span className="font-semibold">{nutrition.sugar}g</span>
                  </div>
                </div>
              )}

              {['breakfast', 'lunch', 'dinner'].map(mealType => {
                const meal = dayMeals[mealType as 'breakfast' | 'lunch' | 'dinner'];
                return (
                  <div key={mealType} className="mb-2">
                    <p className="text-xs text-gray-500 capitalize mb-1">{mealType}</p>
                    {meal ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs group relative">
                        <p className="font-medium text-gray-900">{meal.name}</p>
                        <button
                          onClick={() => removeMeal(date, mealType)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedSlot({ date, meal: mealType });
                          setShowRecipeBrowser(true);
                        }}
                        className="w-full border-2 border-dashed border-gray-300 rounded p-2 text-xs text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {showRecipeBrowser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Choose a Recipe</h3>
              <button
                onClick={() => {
                  setShowRecipeBrowser(false);
                  setSelectedSlot(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {recipes
                .filter(r => !selectedSlot || r.category === selectedSlot.meal || selectedSlot.meal === 'snacks')
                .map(recipe => (
                  <div
                    key={recipe.id}
                    onClick={() => addMealToSlot(recipe)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <img src={recipe.imageUrl} alt={recipe.name} className="w-20 h-20 rounded object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{recipe.name}</h4>
                        <p className="text-sm text-gray-600">{recipe.prepTime + recipe.cookTime} mins</p>
                        <div className="flex space-x-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{recipe.nutrition.calories} cal</span>
                          {recipe.isHealthy && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center">
                              <Leaf className="w-3 h-3 mr-1" />
                              Healthy
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NutritionPage = () => {
  const { mealPlan } = useContext(AppContext);

  const weeklyData = React.useMemo(() => {
    if (!mealPlan) return null;

    const days = Object.keys(mealPlan.meals).slice(0, 7);
    return days.map(date => {
      const day = mealPlan.meals[date];
      let totals = { calories: 0, protein: 0, carbs: 0, fats: 0, sodium: 0, sugar: 0, fiber: 0 };
      
      [day.breakfast, day.lunch, day.dinner, ...(day.snacks || [])].forEach(meal => {
        if (meal) {
          totals.calories += meal.nutrition.calories;
          totals.protein += meal.nutrition.protein;
          totals.carbs += meal.nutrition.carbs;
          totals.fats += meal.nutrition.fats;
          totals.sodium += meal.nutrition.sodium;
          totals.sugar += meal.nutrition.sugar;
          totals.fiber += meal.nutrition.fiber;
        }
      });

      const dateObj = new Date(date);
      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()],
        ...totals
      };
    });
  }, [mealPlan]);

  if (!mealPlan || !weeklyData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No meal plan data available</p>
          <p className="text-gray-500 text-sm mb-4">Create a meal plan to see nutrition insights</p>
        </div>
      </div>
    );
  }

  const averages = {
    calories: Math.round(weeklyData.reduce((sum, d) => sum + d.calories, 0) / weeklyData.length),
    protein: Math.round(weeklyData.reduce((sum, d) => sum + d.protein, 0) / weeklyData.length),
    carbs: Math.round(weeklyData.reduce((sum, d) => sum + d.carbs, 0) / weeklyData.length),
    fats: Math.round(weeklyData.reduce((sum, d) => sum + d.fats, 0) / weeklyData.length),
    sodium: Math.round(weeklyData.reduce((sum, d) => sum + d.sodium, 0) / weeklyData.length),
    sugar: Math.round(weeklyData.reduce((sum, d) => sum + d.sugar, 0) / weeklyData.length),
    fiber: Math.round(weeklyData.reduce((sum, d) => sum + d.fiber, 0) / weeklyData.length)
  };

  const rdaPercentages = {
    calories: (averages.calories / 2000) * 100,
    protein: (averages.protein / 50) * 100,
    carbs: (averages.carbs / 275) * 100,
    fats: (averages.fats / 78) * 100,
    sodium: (averages.sodium / 2300) * 100,
    sugar: (averages.sugar / 50) * 100,
    fiber: (averages.fiber / 28) * 100
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Nutrition Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Averages vs RDA</h3>
          <div className="space-y-4">
            {[
              { name: 'Calories', value: averages.calories, rda: 2000, unit: 'kcal' },
              { name: 'Protein', value: averages.protein, rda: 50, unit: 'g' },
              { name: 'Carbs', value: averages.carbs, rda: 275, unit: 'g' },
              { name: 'Fats', value: averages.fats, rda: 78, unit: 'g' },
              { name: 'Fiber', value: averages.fiber, rda: 28, unit: 'g' }
            ].map(item => {
              const percentage = Math.min((item.value / item.rda) * 100, 100);
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm text-gray-600">{item.value} / {item.rda}{item.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Health Alerts</h3>
          <div className="space-y-3">
            {averages.sodium > 2300 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">High Sodium Intake</p>
                    <p className="text-sm text-red-700">
                      Your average daily sodium ({averages.sodium}mg) exceeds the recommended limit of 2,300mg.
                      Consider reducing salt in recipes.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {averages.sugar > 50 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">High Sugar Intake</p>
                    <p className="text-sm text-red-700">
                      Your average daily sugar ({averages.sugar}g) exceeds the recommended limit of 50g.
                      Try reducing sugary foods and drinks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {averages.sodium <= 2300 && averages.sugar <= 50 && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-800">Great Job!</p>
                    <p className="text-sm text-emerald-700">
                      Your sodium and sugar intake are within healthy limits. Keep up the good work!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {averages.fiber < 25 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800">Low Fiber Intake</p>
                    <p className="text-sm text-yellow-700">
                      Consider adding more vegetables, beans, and whole grains to increase fiber intake.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Calorie Trends</h3>
        <div className="flex items-end space-x-2 h-48">
          {weeklyData.map((day, idx) => {
            const height = (day.calories / 3000) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors relative group" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.calories} cal
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{day.day}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Macronutrient Distribution</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Protein', value: averages.protein, color: 'bg-blue-500', calories: averages.protein * 4 },
            { name: 'Carbohydrates', value: averages.carbs, color: 'bg-yellow-500', calories: averages.carbs * 4 },
            { name: 'Fats', value: averages.fats, color: 'bg-red-500', calories: averages.fats * 9 }
          ].map(macro => {
            const percentage = ((macro.calories / averages.calories) * 100).toFixed(1);
            return (
              <div key={macro.name} className="text-center">
                <div className={`${macro.color} text-white rounded-lg p-6 mb-3`}>
                  <p className="text-3xl font-bold">{percentage}%</p>
                  <p className="text-sm opacity-90">{macro.value}g</p>
                </div>
                <p className="font-semibold text-gray-800">{macro.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const GroceryListPage = () => {
  const { mealPlan } = useContext(AppContext);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (mealPlan) {
      generateGroceryList();
    }
  }, [mealPlan]);

  const generateGroceryList = () => {
    if (!mealPlan) return;

    const ingredientMap = new Map<string, GroceryItem>();

    Object.values(mealPlan.meals).forEach(day => {
      [day.breakfast, day.lunch, day.dinner, ...(day.snacks || [])].forEach(meal => {
        if (meal) {
          meal.ingredients.forEach(ing => {
            const key = `${ing.name}-${ing.unit}`;
            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key)!;
              existing.amount += ing.amount;
            } else {
              ingredientMap.set(key, {
                ingredient: ing.name,
                amount: ing.amount,
                unit: ing.unit,
                category: ing.category,
                checked: false,
                estimatedCost: Math.round(ing.amount * (Math.random() * 500 + 200))
              });
            }
          });
        }
      });
    });

    setGroceryList(Array.from(ingredientMap.values()).sort((a, b) => a.category.localeCompare(b.category)));
  };

  const toggleCheck = (index: number) => {
    const updated = [...groceryList];
    updated[index].checked = !updated[index].checked;
    setGroceryList(updated);
  };

  const toggleCategoryCheck = (category: string, checked: boolean) => {
    const updated = groceryList.map(item =>
      item.category === category ? { ...item, checked } : item
    );
    setGroceryList(updated);
  };

  const totalCost = groceryList.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const categories = Array.from(new Set(groceryList.map(item => item.category)));

  const shareList = () => {
    const text = groceryList
      .map(item => `${item.checked ? '✓' : '○'} ${item.amount} ${item.unit} ${item.ingredient}`)
      .join('\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'Grocery List',
        text: text
      });
    } else {
      alert('Copy this list:\n\n' + text);
    }
  };

  if (!mealPlan || groceryList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No grocery list available</p>
          <p className="text-gray-500 text-sm">Create a meal plan to generate your grocery list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Grocery List</h2>
        <div className="flex space-x-2">
          <button
            onClick={shareList}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <Download className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Estimated Total Cost</p>
            <p className="text-3xl font-bold text-gray-900">₦{totalCost.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Items</p>
            <p className="text-2xl font-bold text-emerald-600">
              {groceryList.filter(i => i.checked).length} / {groceryList.length}
            </p>
          </div>
        </div>
      </div>

      {categories.map(category => {
        const categoryItems = groceryList.filter(item => item.category === category);
        const allChecked = categoryItems.every(item => item.checked);
        
        return (
          <div key={category} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{category}</h3>
              <button
                onClick={() => toggleCategoryCheck(category, !allChecked)}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                {allChecked ? 'Uncheck All' : 'Check All'}
              </button>
            </div>

            <div className="space-y-2">
              {categoryItems.map((item, idx) => {
                const globalIdx = groceryList.indexOf(item);
                return (
                  <div
                    key={globalIdx}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      item.checked ? 'bg-gray-50 border-gray-200' : 'border-gray-200 hover:border-emerald-300'
                    } transition-colors`}
                  >
                    <button
                      onClick={() => toggleCheck(globalIdx)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        item.checked ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                      }`}
                    >
                      {item.checked && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1">
                      <p className={`font-medium ${item.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.amount.toFixed(1)} {item.unit} {item.ingredient}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600">₦{item.estimatedCost?.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
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
