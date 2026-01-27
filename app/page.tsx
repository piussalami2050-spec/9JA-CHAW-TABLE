'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, ChefHat, ShoppingCart, TrendingUp, Search, Clock, Users, Utensils, Leaf, Home, Check, AlertTriangle, X, Plus, ChevronLeft, ChevronRight, Save, Download, Share2, Edit, Trash2, BookOpen, Heart, Filter } from 'lucide-react';

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

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Low-Salt Jollof Rice',
    category: 'lunch',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Long grain rice', amount: 3, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Fresh tomatoes', amount: 4, unit: 'large', category: 'Vegetables & Fruits' },
      { name: 'Red bell peppers', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Scotch bonnet pepper', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 2, unit: 'medium', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Curry powder', amount: 1, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Thyme', amount: 1, unit: 'tsp', category: 'Spices & Condiments' },
      { name: 'Bay leaves', amount: 2, unit: 'pieces', category: 'Spices & Condiments' },
      { name: 'Low-sodium chicken stock', amount: 4, unit: 'cups', category: 'Others' },
      { name: 'Salt', amount: 0.5, unit: 'tsp', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Wash the rice thoroughly in cold water until water runs clear. Drain and set aside.',
      'Blend tomatoes, red bell peppers, scotch bonnet, and 1 onion together until smooth.',
      'Heat vegetable oil in a large pot over medium heat.',
      'Dice the remaining onion and fry in the hot oil until translucent (about 2 minutes).',
      'Pour in the blended tomato mixture and fry for 15-20 minutes, stirring occasionally until the sauce thickens and oil rises to the top.',
      'Add curry powder, thyme, bay leaves, and minimal salt. Stir well.',
      'Pour in the low-sodium chicken stock and bring to a boil.',
      'Add the washed rice and stir gently to combine.',
      'Cover the pot with a tight-fitting lid and reduce heat to low.',
      'Cook for 30-35 minutes without opening the lid, until rice is tender and liquid is absorbed.',
      'Turn off heat and let it sit covered for 5 minutes.',
      'Fluff with a fork and serve hot with fried plantains or salad.'
    ],
    nutrition: { calories: 320, protein: 6, carbs: 58, fats: 7, fiber: 2, sodium: 280, sugar: 4 },
    tags: ['low-salt', 'vegetarian', 'Nigerian classic'],
    isHealthy: true,
    healthNotes: 'Reduced salt version using low-sodium stock and natural flavors from tomatoes and peppers'
  },
  {
    id: '2',
    name: 'Vegetable Egusi Soup',
    category: 'lunch',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Ground egusi (melon seeds)', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Fresh ugwu leaves (pumpkin leaves)', amount: 4, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Fresh spinach', amount: 2, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Stockfish (soaked)', amount: 200, unit: 'g', category: 'Proteins' },
      { name: 'Red palm oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Crayfish (ground)', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Fresh pepper (blended)', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Onions', amount: 1, unit: 'medium', category: 'Vegetables & Fruits' },
      { name: 'Stock cubes', amount: 1, unit: 'piece', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Soak stockfish in hot water for 30 minutes, then debone and cut into small pieces.',
      'Cook stockfish in 3 cups of water with half of the onions for 20 minutes until tender. Keep the stock.',
      'In a bowl, mix ground egusi with 1 cup of water to form a thick paste.',
      'Heat palm oil in a large pot over medium heat.',
      'Add chopped onions and blended pepper, fry for 2 minutes.',
      'Using a spoon, scoop egusi paste in small lumps into the pot. Do not stir.',
      'Allow egusi to fry for 5-7 minutes until lumps are golden.',
      'Add stockfish, crayfish, stock cube, and the reserved stock.',
      'Cover and simmer for 15 minutes on low heat.',
      'Wash and chop ugwu and spinach leaves.',
      'Add vegetables to the soup and stir gently.',
      'Cook for 5 more minutes until vegetables are wilted.',
      'Taste and adjust seasoning with minimal salt if needed.',
      'Serve hot with pounded yam, eba, or fufu.'
    ],
    nutrition: { calories: 380, protein: 18, carbs: 12, fats: 28, fiber: 5, sodium: 420, sugar: 3 },
    tags: ['high-protein', 'traditional', 'nutritious'],
    isHealthy: true,
    healthNotes: 'Rich in vegetables and protein with moderate palm oil for heart health'
  },
  {
    id: '3',
    name: 'Grilled Fish with Pepper Sauce',
    category: 'dinner',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Fresh tilapia or mackerel', amount: 2, unit: 'whole fish', category: 'Proteins' },
      { name: 'Red bell peppers', amount: 3, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Scotch bonnet peppers', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'large', category: 'Vegetables & Fruits' },
      { name: 'Fresh garlic', amount: 3, unit: 'cloves', category: 'Spices & Condiments' },
      { name: 'Fresh ginger', amount: 1, unit: 'inch', category: 'Spices & Condiments' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Lemon juice', amount: 2, unit: 'tbsp', category: 'Others' },
      { name: 'Black pepper', amount: 1, unit: 'tsp', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Clean fish thoroughly, remove scales and guts. Rinse under cold water.',
      'Make 3 diagonal cuts on each side of the fish.',
      'Mix 1 tbsp olive oil, lemon juice, minced garlic, black pepper, and minimal salt.',
      'Rub this marinade all over the fish and inside the cuts. Let it marinate for 15 minutes.',
      'Preheat your grill or oven to 200°C (400°F).',
      'Place fish on grill or in oven and cook for 10-12 minutes on each side until skin is crispy.',
      'While fish cooks, prepare pepper sauce: Roughly chop bell peppers, scotch bonnet, onions, ginger, and garlic.',
      'Blend all vegetables together until smooth (you can add 2 tbsp water if needed).',
      'Heat 1 tbsp olive oil in a pan over medium heat.',
      'Pour blended pepper mixture into pan and fry for 8-10 minutes, stirring occasionally.',
      'Season with minimal salt and cook until oil rises to the top.',
      'Remove grilled fish from heat and place on a serving plate.',
      'Pour hot pepper sauce over the fish or serve on the side.',
      'Garnish with lemon slices and serve with boiled yam or salad.'
    ],
    nutrition: { calories: 280, protein: 35, carbs: 8, fats: 12, fiber: 2, sodium: 180, sugar: 5 },
    tags: ['low-salt', 'high-protein', 'grilled', 'omega-3'],
    isHealthy: true,
    healthNotes: 'Excellent lean protein source, grilled not fried, rich in omega-3 fatty acids'
  },
  {
    id: '4',
    name: 'Moi Moi (Bean Pudding)',
    category: 'breakfast',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    imageUrl: 'https://images.unsplash.com/photo-1606314378876-b84c290b3b0c?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Black-eyed beans (peeled)', amount: 3, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Red bell peppers', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'medium', category: 'Vegetables & Fruits' },
      { name: 'Scotch bonnet pepper', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Crayfish (ground)', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Hard-boiled eggs', amount: 3, unit: 'pieces', category: 'Proteins' },
      { name: 'Stock cubes', amount: 2, unit: 'pieces', category: 'Spices & Condiments' }
    ],
    instructions: [
      'If beans are not already peeled, soak them in water for 10 minutes, then rub between hands to remove skins.',
      'Blend beans with red peppers, onions, scotch bonnet, and 1 cup of water until very smooth. Blend in batches if needed.',
      'Pour blended mixture into a large bowl.',
      'Add vegetable oil, ground crayfish, crumbled stock cubes, and minimal salt.',
      'Whisk mixture vigorously for 5 minutes until it becomes light and fluffy.',
      'Prepare your moi moi containers: use small bowls, ramekins, or banana leaves.',
      'Grease containers lightly with oil.',
      'Fill each container halfway with the bean mixture.',
      'Place a quarter of hard-boiled egg in the center of each.',
      'Fill to 3/4 full with more bean mixture.',
      'Cover each container with foil or leaves.',
      'Place containers in a large pot with 2 inches of water at the bottom.',
      'Cover pot and steam on medium heat for 45 minutes. Add more water if needed.',
      'Check if done by inserting a toothpick - it should come out clean.',
      'Allow to cool for 5 minutes before serving.',
      'Serve warm with pap (ogi), bread, or custard.'
    ],
    nutrition: { calories: 220, protein: 12, carbs: 28, fats: 6, fiber: 8, sodium: 160, sugar: 2 },
    tags: ['low-salt', 'high-fiber', 'protein-rich'],
    isHealthy: true,
    healthNotes: 'High in plant-based protein and fiber, minimal salt, nutrient-dense breakfast'
  },
  {
    id: '5',
    name: 'Beans and Plantain',
    category: 'lunch',
    prepTime: 10,
    cookTime: 50,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Honey beans or brown beans', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Ripe plantains', amount: 4, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Red palm oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Onions', amount: 1, unit: 'medium', category: 'Vegetables & Fruits' },
      { name: 'Fresh pepper (blended)', amount: 1, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Stock cube', amount: 1, unit: 'piece', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Rinse beans thoroughly and remove any stones or debris.',
      'Place beans in a pot with 6 cups of water.',
      'Bring to a boil, then reduce heat and cook for 35-40 minutes until beans are soft but not mushy.',
      'While beans cook, peel ripe plantains and cut into chunks (about 2 inches each).',
      'When beans are soft, add cut plantains to the pot.',
      'Add crumbled stock cube and minimal salt to taste.',
      'Cook together for 10-12 more minutes until plantains are soft.',
      'The water should be almost absorbed - if too much water remains, cook uncovered for a few minutes.',
      'In a separate small pan, heat palm oil.',
      'Add chopped onions and blended pepper to the oil.',
      'Fry for 2-3 minutes until fragrant.',
      'Pour the hot oil mixture over the beans and plantain.',
      'Stir gently to combine without mashing the plantains too much.',
      'Let it sit for 2 minutes to absorb flavors.',
      'Serve hot as a complete meal.'
    ],
    nutrition: { calories: 340, protein: 14, carbs: 52, fats: 8, fiber: 12, sodium: 120, sugar: 18 },
    tags: ['vegetarian', 'high-fiber', 'budget-friendly'],
    isHealthy: true,
    healthNotes: 'Excellent source of plant-based protein and fiber, natural sweetness from ripe plantains'
  },
  {
    id: '6',
    name: 'Efo Riro (Spinach Stew)',
    category: 'lunch',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Fresh spinach or efo shoko', amount: 6, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Lean beef or goat meat', amount: 300, unit: 'g', category: 'Proteins' },
      { name: 'Red palm oil', amount: 3, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Fresh tomatoes (blended)', amount: 3, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Red bell peppers (blended)', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'large', category: 'Vegetables & Fruits' },
      { name: 'Crayfish (ground)', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Stock cube', amount: 1, unit: 'piece', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Wash and cut lean meat into small pieces.',
      'Season meat with half the onions (diced), stock cube, and minimal salt.',
      'Cook meat in 2 cups of water for 20 minutes until tender. Keep the stock.',
      'Blend tomatoes and peppers together until smooth.',
      'Heat palm oil in a large pot over medium heat.',
      'Add remaining chopped onions and fry for 1 minute.',
      'Pour in blended tomato mixture and fry for 10 minutes, stirring frequently.',
      'Add cooked meat with its stock to the tomato sauce.',
      'Add ground crayfish and stir well.',
      'Simmer for 5 minutes to blend flavors.',
      'Wash spinach thoroughly and chop roughly.',
      'Add chopped spinach to the pot and stir.',
      'Cook for only 3-5 minutes to maintain bright green color and nutrients.',
      'Taste and adjust seasoning if needed.',
      'Turn off heat immediately when spinach is wilted.',
      'Serve hot with rice, yam, or any swallow of choice.'
    ],
    nutrition: { calories: 290, protein: 22, carbs: 14, fats: 16, fiber: 4, sodium: 340, sugar: 6 },
    tags: ['high-protein', 'iron-rich', 'traditional'],
    isHealthy: true,
    healthNotes: 'Rich in iron, vitamins, and minerals from spinach with lean protein'
  },
  {
    id: '7',
    name: 'Yam Porridge (Asaro)',
    category: 'lunch',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1628773822990-202c13f982e5?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'White yam', amount: 1, unit: 'medium tuber', category: 'Grains & Cereals' },
      { name: 'Red palm oil', amount: 4, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Fresh tomatoes (blended)', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Fresh pepper (blended)', amount: 1, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Smoked fish', amount: 150, unit: 'g', category: 'Proteins' },
      { name: 'Onions', amount: 1, unit: 'medium', category: 'Vegetables & Fruits' },
      { name: 'Fresh spinach', amount: 2, unit: 'cups', category: 'Vegetables & Fruits' },
      { name: 'Stock cube', amount: 1, unit: 'piece', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Peel yam and cut into medium-sized chunks (about 2 inches).',
      'Rinse yam pieces in cold water.',
      'Place yam in a pot and add enough water to just cover it.',
      'Add half of the onions (chopped) and bring to a boil.',
      'Cook for 10-15 minutes until yam is partially soft (not fully cooked).',
      'Clean smoked fish, remove bones, and break into pieces.',
      'Add palm oil, blended tomatoes, and blended pepper to the yam.',
      'Add smoked fish pieces and stock cube.',
      'Stir gently and continue cooking for 10 more minutes.',
      'As yam cooks, it will become very soft and begin to break down.',
      'Use a wooden spoon to mash some of the yam pieces to thicken the porridge.',
      'Add remaining chopped onions and spinach.',
      'Stir and cook for 3 more minutes.',
      'The consistency should be thick and porridge-like.',
      'Taste and adjust seasoning with minimal salt.',
      'Serve hot as a complete meal.'
    ],
    nutrition: { calories: 380, protein: 14, carbs: 58, fats: 10, fiber: 6, sodium: 380, sugar: 4 },
    tags: ['comfort-food', 'filling', 'traditional'],
    isHealthy: true,
    healthNotes: 'Good source of complex carbohydrates for sustained energy with vegetables and protein'
  },
  {
    id: '8',
    name: 'Akara (Bean Cakes)',
    category: 'breakfast',
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Black-eyed beans (peeled)', amount: 2, unit: 'cups', category: 'Grains & Cereals' },
      { name: 'Onions', amount: 1, unit: 'small', category: 'Vegetables & Fruits' },
      { name: 'Scotch bonnet pepper', amount: 1, unit: 'small piece', category: 'Vegetables & Fruits' },
      { name: 'Vegetable oil for frying', amount: 3, unit: 'cups', category: 'Oils & Fats' },
      { name: 'Salt', amount: 0.5, unit: 'tsp', category: 'Spices & Condiments' }
    ],
    instructions: [
      'Soak beans in water for 10 minutes to soften the skin.',
      'Rub beans between your palms to remove all the skins.',
      'Rinse beans several times until all skins float away.',
      'Blend beans with very little water (just enough to blend) until very smooth and fluffy.',
      'Pour blended beans into a large bowl.',
      'Finely chop onions and pepper, add to the bean paste.',
      'Add minimal salt to taste.',
      'Whisk the mixture vigorously in one direction for 3-5 minutes. The mixture should be thick and fluffy.',
      'Test consistency by dropping a small amount in cold water - it should float.',
      'Heat vegetable oil in a deep pot over medium-high heat.',
      'Oil is ready when a small drop of batter sizzles immediately.',
      'Using a spoon, scoop bean mixture and gently drop into hot oil.',
      'Fry 4-5 balls at a time, don't overcrowd the pot.',
      'Fry for 3-4 minutes until golden brown, turning occasionally.',
      'Remove with a slotted spoon and drain on paper towels.',
      'Serve hot with pap (ogi), custard, or bread.'
    ],
    nutrition: { calories: 180, protein: 10, carbs: 20, fats: 6, fiber: 6, sodium: 140, sugar: 1 },
    tags: ['low-salt', 'protein-rich', 'breakfast'],
    isHealthy: true,
    healthNotes: 'Good source of plant-based protein and fiber with minimal salt'
  },
  {
    id: '9',
    name: 'Grilled Chicken Suya',
    category: 'dinner',
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Chicken breast', amount: 500, unit: 'g', category: 'Proteins' },
      { name: 'Suya spice (yaji)', amount: 3, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Groundnut powder (roasted)', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Vegetable oil', amount: 2, unit: 'tbsp', category: 'Oils & Fats' },
      { name: 'Onions (sliced)', amount: 1, unit: 'piece', category: 'Vegetables & Fruits' }
    ],
    instructions: [
      'Cut chicken breast into long strips about 1 inch wide.',
      'In a bowl, mix suya spice with vegetable oil to form a paste.',
      'Add chicken strips to the spice paste and massage well to coat evenly.',
      'Cover and marinate in the refrigerator for at least 20 minutes (or up to 2 hours).',
      'If using wooden skewers, soak them in water for 10 minutes.',
      'Thread marinated chicken strips onto skewers.',
      'Preheat your grill, oven (200°C), or grill pan over medium-high heat.',
      'Place chicken skewers on the grill.',
      'Grill for 8-10 minutes on the first side without moving.',
      'Flip skewers and grill for another 8-10 minutes until chicken is fully cooked.',
      'Chicken is done when juices run clear and internal temperature reaches 75°C.',
      'In the last 2 minutes, sprinkle groundnut powder over the chicken.',
      'Remove from heat and let rest for 3 minutes.',
      'Serve hot with sliced onions, tomatoes, and cabbage on the side.',
      'Optional: Serve with extra suya spice for dipping.'
    ],
    nutrition: { calories: 240, protein: 32, carbs: 6, fats: 10, fiber: 2, sodium: 320, sugar: 2 },
    tags: ['high-protein', 'grilled', 'low-carb'],
    isHealthy: true,
    healthNotes: 'Lean protein grilled instead of fried, controlled spice levels for flavor without excess sodium'
  },
  {
    id: '10',
    name: 'Fish Pepper Soup',
    category: 'dinner',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop',
    ingredients: [
      { name: 'Fresh catfish', amount: 4, unit: 'pieces', category: 'Proteins' },
      { name: 'Pepper soup spice', amount: 2, unit: 'tbsp', category: 'Spices & Condiments' },
      { name: 'Scotch bonnet peppers', amount: 2, unit: 'pieces', category: 'Vegetables & Fruits' },
      { name: 'Onions', amount: 1, unit: 'medium', category: 'Vegetables & Fruits' },
      { name: 'Fresh garlic', amount: 3, unit: 'cloves', category: 'Spices & Condiments' },
      { name: 'Fresh ginger', amount: 1, unit: 'inch', category: 'Spices & Condiments' },
      { name: 'Scent leaves (optional)', amount: 10, unit: 'leaves', category: 'Vegetables & Fruits' }
    ],
    instructions: [
      'Clean catfish thoroughly by rubbing with salt and lemon, then rinse well.',
      'Cut fish into medium-sized pieces if not already cut.',
      'Peel and slice ginger and garlic.',
      'Chop onions and scotch bonnet peppers.',
      'In a pot, add 6 cups of water and bring to a boil.',
      'Add sliced ginger, garlic, half the onions, and scotch bonnet peppers.',
      'Add pepper soup spice and minimal salt.',
      'Boil for 5 minutes to infuse flavors into the broth.',
      'Gently add fish pieces to the boiling water.',
      'Reduce heat to medium and cook for 15-20 minutes.',
      'Do not stir too much to prevent fish from breaking apart.',
      'Add remaining chopped onions.',
      'If using scent leaves, tear them and add in the last 2 minutes.',
      'Taste and adjust seasoning if needed.',
      'Serve hot as soup alone or with boiled yam, plantains, or rice.'
    ],
    nutrition: { calories: 180, protein: 28, carbs: 4, fats: 6, fiber: 1, sodium: 280, sugar: 2 },
    tags: ['low-carb', 'high-protein', 'light', 'warming'],
    isHealthy: true,
    healthNotes: 'Low calorie, high protein, perfect for light dinner or when feeling under the weather'
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

  const toggleFavorite = (recipeId: string) => {
    setRecipes(recipes.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  return (
    <AppContext.Provider value={{ 
      recipes, 
      setRecipes, 
      mealPlan, 
      setMealPlan, 
      currentPage, 
      setCurrentPage,
      toggleFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
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
            <h3 className="text-lg font-semibold text-gray-800">Low Salt</h3>
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
          <p className="text-sm text-gray-600">Create meal plan</p>
        </button>
        
        <button
          onClick={() => setCurrentPage('grocery')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <ShoppingCart className="w-8 h-8 text-lime-600 mb-2" />
          <h4 className="font-bold text-gray-900">Grocery List</h4>
          <p className="text-sm text-gray-600">Auto-generate list</p>
        </button>
      </div>
    </div>
  );
};

// RecipesPage Component
const RecipesPage = () => {
  const { recipes, toggleFavorite } = useContext(AppContext);
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
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
              >
                <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              {recipe.isHealthy && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Leaf className="w-3 h-3 mr-1" />
                  Healthy
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{recipe.name}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
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
