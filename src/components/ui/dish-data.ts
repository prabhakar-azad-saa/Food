import {
  IMG_EGG,
  IMG_FISH,
  IMG_MATCHA,
  IMG_ORANGE,
  IMG_PASTA,
  IMG_RAMEN,
  IMG_SALAD,
  IMG_STEAK,
  IMG_WALL,
} from "./dish-assets"
import type { Dish } from "./dish-orbit-carousel"

export { IMG_WALL }

export type ExtendedDish = Dish & {
  id: string
  price: number
  category: "Signature" | "Mains" | "Seafood" | "Botanical" | "Dessert"
  prepTime: string
  calories: string
  spiceLevel?: string
  pairing?: string
  videoLength?: string
  steps?: string[]
}

export const ALL_DISHES: ExtendedDish[] = [
  {
    id: "ribeye",
    title: "Char grill",
    subtitle: "Ribeye",
    image: IMG_STEAK,
    eyebrow: "#1 Most loved dish",
    rating: 4.9,
    chef: "Chef Marco Rossi",
    kitchen: "Ember & Oak Kitchen",
    description:
      "Dry-aged prime ribeye seared over white oak embers, finished with bone marrow herb butter and flaky Maldon sea salt.",
    likes: 342,
    ingredients: ["Prime Ribeye", "Bone Marrow", "Rosemary", "Thyme", "Roasted Garlic", "Maldon Salt"],
    accent: "#e8a598",
    price: 48,
    category: "Signature",
    prepTime: "18 mins",
    calories: "680 kcal",
    pairing: "Cabernet Sauvignon 2018",
    videoLength: "02:45",
    steps: [
      "Temper 28-day dry-aged ribeye to room temperature and season generously with flaky sea salt.",
      "Sear over 450°C white oak embers for 3 minutes per side to build a caramelized crust.",
      "Baste continuously with foaming bone marrow butter, crushed garlic, and fresh thyme.",
      "Rest on a warm cedar board for 7 minutes before slicing against the grain.",
    ],
  },
  {
    id: "salad",
    title: "Garden",
    subtitle: "Harvest",
    image: IMG_SALAD,
    eyebrow: "#2 Most loved dish",
    rating: 4.7,
    chef: "Chef Elena Vance",
    kitchen: "Verde Botanicals",
    description:
      "Crisp heirloom greens, charred avocado, pickled watermelon radishes, and toasted pepitas tossed in bright yuzu vinaigrette.",
    likes: 218,
    ingredients: ["Heirloom Greens", "Charred Avocado", "Radish", "Pepitas", "Yuzu Citrus", "Cold-Pressed Olive Oil"],
    accent: "#a8d5ba",
    price: 24,
    category: "Botanical",
    prepTime: "10 mins",
    calories: "340 kcal",
    pairing: "Sparkling Elderflower Pressé",
    videoLength: "01:50",
    steps: [
      "Char halved Hass avocados lightly with a kitchen torch for smoky depth.",
      "Whisk cold-pressed olive oil with aged yuzu juice, mirin, and white miso.",
      "Toss crisp baby kale and mizuna leaves gently to coat without bruising.",
      "Crown with shaved watermelon radish and warm spiced pumpkin seeds.",
    ],
  },
  {
    id: "halibut",
    title: "Pan seared",
    subtitle: "Halibut",
    image: IMG_FISH,
    eyebrow: "#3 Most loved dish",
    rating: 4.8,
    chef: "Chef Kenji Takahashi",
    kitchen: "Tide & Table",
    description:
      "Wild-caught Pacific halibut with glass-crisp skin, served over saffron beurre blanc with blistered heirloom cherry tomatoes.",
    likes: 289,
    ingredients: ["Pacific Halibut", "Saffron Threads", "Shallots", "Dry White Wine", "Cherry Tomatoes", "Sea Asparagus"],
    accent: "#9ec5e8",
    price: 42,
    category: "Seafood",
    prepTime: "15 mins",
    calories: "490 kcal",
    pairing: "Sancerre Blanc 2021",
    videoLength: "03:10",
    steps: [
      "Score the halibut skin lightly and press dry to guarantee a glass-crisp sear.",
      "Reduce shallots, dry white wine, and Spanish saffron threads, then emulsify cold cultured butter.",
      "Pan-sear skin-side down in clarified butter until golden and translucent at the core.",
      "Plate over a velvet pool of saffron beurre blanc with sea asparagus.",
    ],
  },
  {
    id: "duck",
    title: "Citrus",
    subtitle: "Glazed",
    image: IMG_ORANGE,
    eyebrow: "#4 Most loved dish",
    rating: 4.6,
    chef: "Chef Amélie Laurent",
    kitchen: "Soleil Bistro",
    description:
      "Slow-roasted Moulard duck breast lacquered with blood orange reduction, accompanied by caramelized fennel and star anise.",
    likes: 195,
    ingredients: ["Duck Breast", "Blood Orange", "Baby Fennel", "Star Anise", "Wildflower Honey", "Tellicherry Pepper"],
    accent: "#f5c489",
    price: 39,
    category: "Mains",
    prepTime: "22 mins",
    calories: "590 kcal",
    pairing: "Pinot Noir Reserve",
    videoLength: "02:30",
    steps: [
      "Render scored duck breast starting in a cold skillet for 10 minutes until golden and crisp.",
      "Simmer freshly pressed blood orange juice with wildflower honey and whole star anise.",
      "Brush the breast repeatedly with citrus lacquer and roast for 4 minutes.",
      "Serve alongside braised baby fennel bulbs and orange supremes.",
    ],
  },
  {
    id: "truffle-egg",
    title: "Soft poached",
    subtitle: "Truffle",
    image: IMG_EGG,
    eyebrow: "#5 Most loved dish",
    rating: 4.9,
    chef: "Chef Luca Moretti",
    kitchen: "Osteria Bosco",
    description:
      "Pasture-raised poached egg over stone-ground creamy polenta, shaved black Périgord truffle, and 36-month aged Parmigiano.",
    likes: 310,
    ingredients: ["Pasture Egg", "Black Truffle", "Stone-Ground Polenta", "Parmigiano", "Chives", "Hazelnut Brown Butter"],
    accent: "#d9c2e8",
    price: 34,
    category: "Signature",
    prepTime: "14 mins",
    calories: "460 kcal",
    pairing: "Barolo DOCG 2017",
    videoLength: "02:15",
    steps: [
      "Slow-whisk heritage cornmeal in rich vegetable stock for 45 minutes, folding in mascarpone and Parmigiano.",
      "Poach a farm-fresh organic egg in a gentle vortex for 2 minutes 45 seconds.",
      "Nut-brown Normandy butter with toasted Piedmont hazelnuts.",
      "Finish tableside with generous shavings of fresh black Périgord truffle.",
    ],
  },
  {
    id: "lobster-pasta",
    title: "Artisan",
    subtitle: "Tagliolini",
    image: IMG_PASTA,
    eyebrow: "#6 Chef's Reserve",
    rating: 4.9,
    chef: "Chef Luca Moretti",
    kitchen: "Osteria Bosco",
    description:
      "Hand-cut egg yolk tagliolini ribbons tossed in roasted Maine lobster bisque reduction, sweet Datterini tomatoes, and basil.",
    likes: 276,
    ingredients: ["Maine Lobster", "40-Yolk Tagliolini", "Datterini Tomatoes", "Lobster Coral Butter", "Sweet Basil", "Chili Flakes"],
    accent: "#f4a28c",
    price: 46,
    category: "Seafood",
    prepTime: "16 mins",
    calories: "540 kcal",
    pairing: "Vermentino di Gallura",
    videoLength: "02:55",
    steps: [
      "Roll 40-yolk pasta dough paper-thin and hand-cut into delicate tagliolini strands.",
      "Create an intense bisque emulsion from roasted lobster shells, brandy, and sweet cherry tomatoes.",
      "Toss al dente pasta in the skillet with butter-poached lobster medallions.",
      "Twirl into a high nest and garnish with micro-basil leaves.",
    ],
  },
  {
    id: "truffle-ramen",
    title: "Smoked",
    subtitle: "Tonkotsu",
    image: IMG_RAMEN,
    eyebrow: "#7 Midnight Favorite",
    rating: 4.8,
    chef: "Chef Kenji Takahashi",
    kitchen: "Tide & Table",
    description:
      "18-hour collagen-rich broth infused with smoked dashi, charred pork belly chashu, ajitama jammy egg, and black garlic oil.",
    likes: 364,
    ingredients: ["18h Tonkotsu Broth", "Charred Chashu", "Ajitama Egg", "Black Garlic Tare", "Rye Noodles", "Nori Sheet"],
    accent: "#e8c589",
    price: 29,
    category: "Mains",
    prepTime: "12 mins",
    calories: "620 kcal",
    pairing: "Junmai Daiginjo Sake",
    videoLength: "03:40",
    steps: [
      "Warm aged shoyu tare and roasted black garlic oil in the base of a stoneware bowl.",
      "Ladle piping hot 18-hour emulsified broth and fold in springy alkaline rye noodles.",
      "Torch thick-cut pork belly chashu until the fat cap blisters and caramelizes.",
      "Top with a 6-minute marinated soft-boiled egg, scallions, and crisp nori.",
    ],
  },
  {
    id: "matcha-torte",
    title: "Ceremonial",
    subtitle: "Matcha",
    image: IMG_MATCHA,
    eyebrow: "#8 Sweet Finale",
    rating: 4.9,
    chef: "Chef Amélie Laurent",
    kitchen: "Soleil Bistro",
    description:
      "Velvety Uji ceremonial matcha mousse sphere over black sesameshortbread, paired with wild raspberry coulis and 24k gold leaf.",
    likes: 254,
    ingredients: ["Uji Matcha", "White Chocolate", "Black Sesame", "Wild Raspberry", "Yuzu Gel", "24k Gold Leaf"],
    accent: "#b5dca0",
    price: 22,
    category: "Dessert",
    prepTime: "8 mins",
    calories: "380 kcal",
    pairing: "Hojicha Roasted Green Tea",
    videoLength: "02:05",
    steps: [
      "Whisk first-harvest Uji matcha into warm white chocolate ganache and fold into whipped cream.",
      "Set over a crisp toasted black sesame sablé biscuit base.",
      "Dot the plate with tart wild raspberry coulis and aromatic yuzu gel.",
      "Adorn with delicate 24-karat edible gold leaf before serving chilled.",
    ],
  },
]

export type ChefProfile = {
  name: string
  role: string
  kitchen: string
  specialty: string
  rating: number
  awards: string
  bio: string
  accent: string
  signatureDishId: string
}

export const CHEF_PROFILES: ChefProfile[] = [
  {
    name: "Chef Marco Rossi",
    role: "Executive Fire Master",
    kitchen: "Ember & Oak Kitchen",
    specialty: "Dry-Aged Cuts & Open-Hearth Wood Firing",
    rating: 4.9,
    awards: "2 Michelin Stars • James Beard Finalist",
    bio: "Trained in Florence and San Sebastián, Marco treats live white oak embers as a seasoning, coaxing deep umami from heritage meats.",
    accent: "#e8a598",
    signatureDishId: "ribeye",
  },
  {
    name: "Chef Kenji Takahashi",
    role: "Culinary Director",
    kitchen: "Tide & Table",
    specialty: "Coastal Seafood & Artisanal Broths",
    rating: 4.9,
    awards: "Tokyo Culinary Gold • Top 50 Coastal Kitchens",
    bio: "Merging Japanese precision with Pacific Northwest bounty, Kenji crafts crystal-clear consommés and glass-skinned wild fish.",
    accent: "#9ec5e8",
    signatureDishId: "halibut",
  },
  {
    name: "Chef Elena Vance",
    role: "Head of Botanicals",
    kitchen: "Verde Botanicals",
    specialty: "Hyper-Seasonal Farm-to-Plate Gastronomy",
    rating: 4.8,
    awards: "Green Michelin Star • Sustainable Chef 2025",
    bio: "Harvesting daily from rooftop hydroponics and biodynamic orchards, Elena transforms humble roots and leaves into vibrant showpieces.",
    accent: "#a8d5ba",
    signatureDishId: "salad",
  },
  {
    name: "Chef Amélie Laurent",
    role: "Pastry & Classic Sauce Virtuoso",
    kitchen: "Soleil Bistro",
    specialty: "Modern French Lacquers & Patisserie",
    rating: 4.8,
    awards: "Meilleur Ouvrier de France Nominee",
    bio: "Amélie balances classic Lyonnaise reductions with bright citrus aromatics and architectural desserts.",
    accent: "#f5c489",
    signatureDishId: "duck",
  },
  {
    name: "Chef Luca Moretti",
    role: "Artisanal Pasta & Truffle Maestro",
    kitchen: "Osteria Bosco",
    specialty: "40-Yolk Handmade Pasta & Piedmont Truffles",
    rating: 4.9,
    awards: "3 Gambero Rosso Forks • Milan Culinary Icon",
    bio: "Raised in Alba, Luca pairs heritage stone-ground grains and hand-rolled tagliolini with wild-foraged Périgord and Alba truffles.",
    accent: "#d9c2e8",
    signatureDishId: "truffle-egg",
  },
]

