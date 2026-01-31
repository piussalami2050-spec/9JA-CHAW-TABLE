'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, ChefHat, ShoppingCart, TrendingUp, Search, Clock, Users, Utensils, Leaf, Home, Check, X, ChevronLeft, ChevronRight, BookOpen, Heart } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl: string;
  ingredients: any[];
  instructions: string[];
  nutrition: any;
  tags: string[];
  isHealthy: boolean;
  healthNotes?: string;
  isFavorite?: boolean;
}

interface MealPlan {
  id: string;
  name: string;
  startDate: string;
  meals: any;
}

const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Low-Salt Jollof Rice',
    category: 'lunch',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
    ingredients: [],
    instructions: ['Wash rice', 'Blend tomatoes', 'Fry tomato blend', 'Add rice and cook'],
    nutrition: { calories: 320, protein: 6, sodium: 280, sugar: 4 },
    tags: ['low-salt'],
    isHealthy: true,
    healthNotes: 'Reduced salt version'
  },
  {
    id: '2',
    name: 'Vegetable Egusi Soup',
    category: 'lunch',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    ingredients: [],
    instructions: ['Cook stockfish', 'Mix egusi paste', 'Add vegetables', 'Serve hot'],
    nutrition: { calories: 380, protein: 18, sodium: 420, sugar: 3 },
    tags: ['high-protein'],
    isHealthy: true
  },
  {
    id: '3',
    name: 'Yam Porridge',
    category: 'lunch',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800',
    ingredients: [],
    instructions: ['Cut yam', 'Boil yam', 'Add tomatoes and fish', 'Serve warm'],
    nutrition: { calories: 380, protein: 14, sodium: 380, sugar: 4 },
    tags: ['comfort-food'],
    isHealthy: true
  },
  {
    id: '4',
    name: 'Moi Moi',
    category: 'breakfast',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    imageUrl: 'https://images.unsplash.com/photo-1612558085329-3fdbf6ae5724?w=800',
    ingredients: [],
    instructions: ['Peel beans', 'Blend smooth', 'Pour into containers', 'Steam for 45 minutes'],
    nutrition: { calories: 220, protein: 12, sodium: 160, sugar: 2 },
    tags: ['high-fiber'],
    isHealthy: true
  },
  {
    id: '5',
    name: 'Beans and Plantain',
    category: 'lunch',
    prepTime: 10,
    cookTime: 50,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800',
    ingredients: [],
    instructions: ['Boil beans', 'Add plantains', 'Pour palm oil', 'Serve'],
    nutrition: { calories: 340, protein: 14, sodium: 120, sugar: 18 },
    tags: ['vegetarian'],
    isHealthy: true
  }
];

const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleFavorite = (recipeId: string) => {
    setRecipes(recipes.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  return (
    <AppContext.Provider value={{ 
      recipes, 
      mealPlan, 
      setMealPlan, 
      currentPage, 
      setCurrentPage,
      selectedRecipe,
      setSelectedRecipe,
      toggleFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};

const Header = () => {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-3 cursor-pointer mb-4" onClick={() => setCurrentPage('home')}>
          <ChefHat className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">9ja Meal Planner</h1>
            <p className="text-xs text-emerald-100">Healthy Nigerian Cuisine</p>
          </div>
        </div>
        <nav className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'recipes', icon: Utensils, label: 'Recipes' },
            { id: 'planner', icon: Calendar, label: 'Planner' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap font-medium ${
                currentPage === id ? 'bg-white text-emerald-600 shadow-lg' : 'bg-emerald-700 hover:bg-emerald-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { recipes, setCurrentPage } = useContext(AppContext);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome Back!</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6">
          <p className="text-4xl font-bold mb-2">{recipes.length}</p>
          <p className="text-sm font-medium">Total Recipes</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-6">
          <p className="text-4xl font-bold mb-2">{recipes.filter(r => r.isHealthy).length}</p>
          <p className="text-sm font-medium">Healthy Options</p>
        </div>
        <div className="bg-gradient-to-br from-lime-500 to-lime-600 text-white rounded-2xl shadow-lg p-6">
          <p className="text-4xl font-bold mb-2">{recipes.filter(r => r.nutrition.sodium < 300).length}</p>
          <p className="text-sm font-medium">Low Sodium</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentPage('recipes')}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all text-left"
        >
          <Utensils className="w-12 h-12 text-emerald-600 mb-4" />
          <h4 className="font-bold text-lg mb-1">Browse Recipes</h4>
          <p className="text-sm text-gray-600">Explore Nigerian recipes</p>
        </button>
        <button
          onClick={() => setCurrentPage('planner')}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all text-left"
        >
          <Calendar className="w-12 h-12 text-orange-600 mb-4" />
          <h4 className="font-bold text-lg mb-1">Plan Your Week</h4>
          <p className="text-sm text-gray-600">Create meal plan</p>
        </button>
        <button
          onClick={() => setCurrentPage('recipes')}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all text-left"
        >
          <ShoppingCart className="w-12 h-12 text-lime-600 mb-4" />
          <h4 className="font-bold text-lg mb-1">Grocery List</h4>
          <p className="text-sm text-gray-600">Auto-generate list</p>
        </button>
      </div>
    </div>
  );
};

const RecipesPage = () => {
  const { recipes, toggleFavorite, setSelectedRecipe } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Nigerian Recipes</h2>
      
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <div key={recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
            <div className="h-56 bg-gray-200 relative cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe.id);
                }}
                className="absolute top-3 right-3 bg-white/90 p-2.5 rounded-full shadow-lg"
              >
                <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              {recipe.isHealthy && (
                <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                  <Leaf className="w-3 h-3 mr-1" />
                  Healthy
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-xl text-gray-900 mb-3">{recipe.name}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{recipe.prepTime + recipe.cookTime}min</span>
                </div>
                <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Users className="w-4 h-4 mr-1.5" />
                  <span>{recipe.servings}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Calories</p>
                  <p className="font-bold text-blue-600">{recipe.nutrition.calories}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Protein</p>
                  <p className="font-bold text-green-600">{recipe.nutrition.protein}g</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecipe(recipe)}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Recipe</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecipeDetailModal = () => {
  const { selectedRecipe, setSelectedRecipe } = useContext(AppContext);

  if (!selectedRecipe) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.name}</h2>
          <button onClick={() => setSelectedRecipe(null)} className="text-gray-500 hover:text-gray-700 p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="h-72 bg-gray-200 rounded-xl mb-6 overflow-hidden">
            <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="w-full h-full object-cover" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-blue-900">{selectedRecipe.prepTime + selectedRecipe.cookTime} mins</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <Users className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm text-gray-600">Servings</p>
              <p className="text-2xl font-bold text-orange-900">{selectedRecipe.servings}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-2xl font-bold text-green-900">{selectedRecipe.nutrition.calories} kcal</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cooking Instructions</h3>
            <ol className="space-y-4">
              {selectedRecipe.instructions.map((step, idx) => (
                <li key={idx} className="flex">
                  <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Calories</span>
                <span className="font-bold">{selectedRecipe.nutrition.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Protein</span>
                <span className="font-bold">{selectedRecipe.nutrition.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Sodium</span>
                <span className="font-bold">{selectedRecipe.nutrition.sodium}mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Sugar</span>
                <span className="font-bold">{selectedRecipe.nutrition.sugar}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MealPlannerPage = () => {
  const { mealPlan, setMealPlan, recipes } = useContext(AppContext);
  const [weekStart, setWeekStart] = useState(new Date());
  const [showRecipeBrowser, setShowRecipeBrowser] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return monday;
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(getMonday(weekStart));
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
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
  }, []);

  const addMealToSlot = (recipe: Recipe) => {
    if (!selectedSlot || !mealPlan) return;
    
    const updatedPlan = { ...mealPlan };
    if (!updatedPlan.meals[selectedSlot.date]) {
      updatedPlan.meals[selectedSlot.date] = {};
    }
    
    updatedPlan.meals[selectedSlot.date][selectedSlot.meal] = recipe;
    setMealPlan(updatedPlan);
    setShowRecipeBrowser(false);
    setSelectedSlot(null);
  };

  const removeMeal = (date: string, mealType: string) => {
    if (!mealPlan) return;
    const updatedPlan = { ...mealPlan };
    delete updatedPlan.meals[date][mealType];
    setMealPlan(updatedPlan);
  };

  if (!mealPlan) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-900">Weekly Meal Planner</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newStart = new Date(weekStart);
              newStart.setDate(newStart.getDate() - 7);
              setWeekStart(newStart);
            }}
            className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setWeekStart(new Date())} className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-semibold">
            Today
          </button>
          <button
            onClick={() => {
              const newStart = new Date(weekStart);
              newStart.setDate(newStart.getDate() + 7);
              setWeekStart(newStart);
            }}
            className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const dateObj = new Date(date);
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
          const dayMeals = mealPlan.meals[date] || {};
          const isToday = date === new Date().toISOString().split('T')[0];
          
          return (
            <div key={date} className={`bg-white rounded-2xl shadow-lg p-4 border-2 ${isToday ? 'border-emerald-500' : 'border-gray-100'}`}>
              <div className="text-center mb-4">
                <p className="font-bold text-lg">{dayName}</p>
                <p className="text-sm text-gray-600">{dateObj.getDate()}/{dateObj.getMonth() + 1}</p>
                {isToday && <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold mt-1 inline-block">Today</span>}
              </div>

              {['breakfast', 'lunch', 'dinner'].map(mealType => {
                const meal = dayMeals[mealType];
                return (
                  <div key={mealType} className="mb-3">
                    <p className="text-xs text-gray-500 capitalize mb-2 font-semibold">{mealType}</p>
                    {meal ? (
                      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-xs group relative">
                        <p className="font-semibold text-gray-900">{meal.name}</p>
                        <p className="text-gray-600 mt-1">{meal.nutrition.calories} cal</p>
                        <button
                          onClick={() => removeMeal(date, mealType)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
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
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 text-xs text-gray-500 hover:border-emerald-500 hover:bg-emerald-50"
                      >
                        + Add {mealType}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Choose a Recipe</h3>
              <button onClick={() => {
                setShowRecipeBrowser(false);
                setSelectedSlot(null);
              }} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {recipes.map((recipe: Recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => addMealToSlot(recipe)}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <img src={recipe.imageUrl} alt={recipe.name} className="w-24 h-24 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold">{recipe.name}</h4>
                      <p className="text-sm text-gray-600">{recipe.prepTime + recipe.cookTime} mins</p>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">{recipe.nutrition.calories} cal</span>
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

export default function NigerianMealPlanner() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AppContent />
        <RecipeDetailModal />
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
    </>
  );
}
