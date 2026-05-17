export interface PlantSpecies {
  id: string;
  name: string;
  scientificName: string;
  category: "Succulent" | "Tropical" | "Fern" | "Arid" | "Creeper";
  light: "Low" | "Medium" | "High";
  careLevel: "Easy" | "Intermediate" | "Expert";
  waterInterval: number; // days
  toxic: boolean;
  description: string;
}

export const PLANT_DATABASE: PlantSpecies[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    category: "Tropical",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: true,
    description: "Iconic split leaves. Loves bright indirect light and climbing moss poles."
  },
  {
    id: "2",
    name: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    category: "Arid",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: true,
    description: "Virtually indestructible. Purifies air and thrives in low light conditions."
  },
  {
    id: "3",
    name: "Boston Fern",
    scientificName: "Nephrolepis exalta",
    category: "Fern",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 3,
    toxic: false,
    description: "Loves humidity and consistent moisture. Perfect for bathrooms."
  },
  {
    id: "4",
    name: "Jade Plant",
    scientificName: "Crassula ovata",
    category: "Succulent",
    light: "High",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: true,
    description: "A slow-growing succulent that resembles a miniature tree."
  },
  {
    id: "5",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    category: "Arid",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: true,
    description: "Shiny, waxy leaves. Perfect for offices with no windows."
  },
  {
    id: "6",
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    category: "Tropical",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: false,
    description: "Produces tiny plantlets that hang down like spiders on a web."
  },
  {
    id: "7",
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    category: "Creeper",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: true,
    description: "Extremely easy to propagate and grows long, trailing vines."
  },
  {
    id: "8",
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    category: "Tropical",
    light: "High",
    careLevel: "Expert",
    waterInterval: 7,
    toxic: true,
    description: "Large, violin-shaped leaves. Temperamental but rewarding."
  },
  {
    id: "9",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis",
    category: "Succulent",
    light: "High",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: false,
    description: "Useful medicinal sap. Needs very well-draining soil."
  },
  {
    id: "10",
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    category: "Tropical",
    light: "Low",
    careLevel: "Intermediate",
    waterInterval: 4,
    toxic: true,
    description: "Tells you when it's thirsty by drooping its leaves."
  },
  {
    id: "11",
    name: "Chinese Money Plant",
    scientificName: "Pilea peperomioides",
    category: "Tropical",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: false,
    description: "Famous for its pancake-shaped leaves. Likes to dry out between waterings."
  },
  {
    id: "12",
    name: "Rubber Plant",
    scientificName: "Ficus elastica",
    category: "Tropical",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: true,
    description: "Sturdy, thick wax-like leaves. Can grow into a large indoor tree."
  },
  {
    id: "13",
    name: "Bird of Paradise",
    scientificName: "Strelitzia reginae",
    category: "Tropical",
    light: "High",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: true,
    description: "Dramatic large leaves. Needs lots of sun to flower indoors."
  },
  {
    id: "14",
    name: "Cast Iron Plant",
    scientificName: "Aspidistra elatior",
    category: "Arid",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 10,
    toxic: false,
    description: "Thrives on neglect and low light. Very difficult to kill."
  },
  {
    id: "15",
    name: "Calathea Orbifolia",
    scientificName: "Goeppertia orbifolia",
    category: "Tropical",
    light: "Medium",
    careLevel: "Expert",
    waterInterval: 5,
    toxic: false,
    description: "Stunning oversized leaves with silver stripes. Loves high humidity."
  },
  {
    id: "16",
    name: "Prayer Plant",
    scientificName: "Maranta leuconeura",
    category: "Tropical",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 5,
    toxic: false,
    description: "Leaves fold up at night as if in prayer. Likes stable temperatures."
  },
  {
    id: "17",
    name: "String of Pearls",
    scientificName: "Senecio rowleyanus",
    category: "Succulent",
    light: "High",
    careLevel: "Intermediate",
    waterInterval: 14,
    toxic: true,
    description: "Trailing succulent with bead-like leaves. Avoid overwatering at all costs."
  },
  {
    id: "18",
    name: "Croton",
    scientificName: "Codiaeum variegatum",
    category: "Tropical",
    light: "High",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: true,
    description: "Vibrant, multicolored foliage. Needs high light to maintain colors."
  },
  {
    id: "19",
    name: "Burro's Tail",
    scientificName: "Sedum morganianum",
    category: "Succulent",
    light: "High",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: false,
    description: "Beautiful trailing succulent. Handle with care as leaves drop easily."
  },
  {
    id: "20",
    name: "Bird's Nest Fern",
    scientificName: "Asplenium nidus",
    category: "Fern",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 6,
    toxic: false,
    description: "Rippled, bright green fronds that grow in a nest-like shape."
  },
  {
    id: "21",
    name: "Areca Palm",
    scientificName: "Dypsis lutescens",
    category: "Tropical",
    light: "High",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: false,
    description: "Feathery fronds that bring a tropical feel to any room."
  },
  {
    id: "22",
    name: "Lucky Bamboo",
    scientificName: "Dracaena sanderiana",
    category: "Arid",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: true,
    description: "Grown in water or soil. Popular for Feng Shui and low light."
  },
  {
    id: "23",
    name: "English Ivy",
    scientificName: "Hedera helix",
    category: "Creeper",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: true,
    description: "A classic climbing or trailing plant. Helps purify indoor air."
  },
  {
    id: "24",
    name: "African Violet",
    scientificName: "Saintpaulia",
    category: "Tropical",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: false,
    description: "Produces beautiful blooms year-round if kept in bright indirect light."
  },
  {
    id: "25",
    name: "Sago Palm",
    scientificName: "Cycas revoluta",
    category: "Succulent",
    light: "High",
    careLevel: "Intermediate",
    waterInterval: 14,
    toxic: true,
    description: "Not a true palm, but a slow-growing cycad with stiff fronds."
  },
  {
    id: "26",
    name: "Dragon Tree",
    scientificName: "Dracaena marginata",
    category: "Arid",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 10,
    toxic: true,
    description: "Architectural plant with sword-like leaves. Very drought tolerant."
  },
  {
    id: "27",
    name: "Parlor Palm",
    scientificName: "Chamaedorea elegans",
    category: "Tropical",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: false,
    description: "Classic indoor palm. Loves low light and high humidity."
  },
  {
    id: "28",
    name: "Chinese Evergreen",
    scientificName: "Aglaonema",
    category: "Tropical",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: true,
    description: "Hardy plant with patterned leaves. Thrives in dry air and low light."
  },
  {
    id: "29",
    name: "Hoya Carnosa",
    scientificName: "Hoya carnosa",
    category: "Creeper",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 10,
    toxic: false,
    description: "Waxy, thick leaves. Produces beautiful porcelain-like flowers."
  },
  {
    id: "30",
    name: "Majesty Palm",
    scientificName: "Ravenea rivularis",
    category: "Tropical",
    light: "High",
    careLevel: "Intermediate",
    waterInterval: 4,
    toxic: false,
    description: "Regal palm with arching fronds. Needs lots of water and light."
  },
  {
    id: "31",
    name: "Heartleaf Philodendron",
    scientificName: "Philodendron hederaceum",
    category: "Creeper",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: true,
    description: "Fast-growing vine with heart-shaped leaves. Very forgiving."
  },
  {
    id: "32",
    name: "Swiss Cheese Vine",
    scientificName: "Monstera adansonii",
    category: "Creeper",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: true,
    description: "Smaller relative of the Deliciosa, with holes in the leaves."
  },
  {
    id: "33",
    name: "Air Plant",
    scientificName: "Tillandsia",
    category: "Arid",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: false,
    description: "Epiphytes that don't need soil. Soak once a week."
  },
  {
    id: "34",
    name: "Money Tree",
    scientificName: "Pachira aquatica",
    category: "Tropical",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 7,
    toxic: false,
    description: "Braided trunk and palmate leaves. Symbol of good luck."
  },
  {
    id: "35",
    name: "Cast Iron Plant",
    scientificName: "Aspidistra elatior",
    category: "Arid",
    light: "Low",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: false,
    description: "Nearly indestructible indoor plant. tolerates low light."
  },
  {
    id: "36",
    name: "String of Hearts",
    scientificName: "Ceropegia woodii",
    category: "Succulent",
    light: "Medium",
    careLevel: "Easy",
    waterInterval: 10,
    toxic: false,
    description: "Delicate trailing vine with heart-shaped, silver-marbled leaves."
  },
  {
    id: "37",
    name: "Panda Plant",
    scientificName: "Kalanchoe tomentosa",
    category: "Succulent",
    light: "High",
    careLevel: "Easy",
    waterInterval: 14,
    toxic: true,
    description: "Fuzzy, silver-green leaves with brown spots on the tips."
  },
  {
    id: "38",
    name: "Bromeliad",
    scientificName: "Guzmania",
    category: "Tropical",
    light: "Medium",
    careLevel: "Intermediate",
    waterInterval: 7,
    toxic: false,
    description: "Colorful tropical plant. Water the central 'cup' and soil."
  },
  {
    id: "39",
    name: "Zebra Plant",
    scientificName: "Aphelandra squarrosa",
    category: "Tropical",
    light: "High",
    careLevel: "Expert",
    waterInterval: 4,
    toxic: false,
    description: "Glossy leaves with bold white veins. Dramatic yellow flowers."
  },
  {
    id: "40",
    name: "Staghorn Fern",
    scientificName: "Platycerium",
    category: "Fern",
    light: "Medium",
    careLevel: "Expert",
    waterInterval: 5,
    toxic: false,
    description: "Unique fern with antler-like fronds. Often mounted on wood."
  }
];
