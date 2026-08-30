export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'extra-spicy';

export type MenuCategory = 
  | 'all'
  | 'kottu'
  | 'fried-rice'
  | 'devilled'
  | 'seafood'
  | 'noodles'
  | 'chicken-bites'
  | 'sharing'
  | 'desserts'
  | 'drinks';

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}

export interface ItemPortion {
  id: string;
  portionName: string; // 'Small (S)', 'Medium (M)', 'Large (L)', 'Regular (R)'
  portionCode: 'S' | 'M' | 'L' | 'R';
  price: number;
  servesCount: number; // e.g. S=1, M=2, L=3-4
  description?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number; // Base or starting price (Small / Regular)
  portions: ItemPortion[];
  defaultPortionId?: string;
  image: string; // Local path e.g. /assets/images/foods/chicken-kottu.jpg
  fallbackImage: string; // High quality curated food visual
  spiceLevel: SpiceLevel;
  spicy: boolean;
  vegetarian: boolean;
  popular: boolean;
  chefSpecial?: boolean;
  portionInfo: string;
  prepTimeMinutes: number;
  ingredients?: string[];
  tags: string[];
  addons?: FoodAddon[];
  pairingItemIds?: string[];
}

export interface CartItem {
  cartItemId: string;
  food: FoodItem;
  selectedPortion: ItemPortion;
  quantity: number;
  spiceLevel: SpiceLevel;
  specialInstructions: string;
  selectedAddons: FoodAddon[];
  itemTotal: number;
}

export type OrderStatus = 'received' | 'accepted' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  loyaltyDiscount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'online';
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  orderType: 'dine-in' | 'takeaway';
  specialNotes?: string;
  needIceBucket?: boolean;
  needGlassware?: boolean;
}

export interface RewardVoucher {
  id: string;
  title: string;
  pointsCost: number;
  discountAmount: number;
  discountType: 'fixed' | 'free_item' | 'percentage';
  freeDishName?: string;
  minSpend?: number;
  description: string;
  isUnlocked: boolean;
}

export interface LoyaltyHistoryItem {
  id: string;
  date: string;
  title: string;
  points: number;
  type: 'earned' | 'redeemed';
  orderNumber?: string;
}

export interface LoyaltyAccount {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
  totalSpent: number;
  ordersCount: number;
  rewards: RewardVoucher[];
  history: LoyaltyHistoryItem[];
}

export interface BudgetRecommendationItem {
  food: FoodItem;
  portion: ItemPortion;
  quantity: number;
  itemTotal: number;
}

export interface PortionSwapSuggestion {
  originalItem: FoodItem;
  originalPortion: ItemPortion;
  suggestedItem: FoodItem;
  suggestedPortion: ItemPortion;
  priceDifference: number; // positive = saves money, negative = upgrade cost
  type: 'downscale' | 'upscale' | 'variety';
  explanation: string;
}

export interface BudgetRecommendation {
  items: BudgetRecommendationItem[];
  totalCost: number;
  budget: number;
  remaining: number;
  totalServings: number;
  targetHeadcount: number;
  comboTitle: string;
  isOverBudget: boolean;
  overAmount: number;
  swapSuggestions?: PortionSwapSuggestion[];
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  dish: string;
  avatarBg: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  originalPrice?: number;
  discountedPrice: number;
  description: string;
  image: string;
  fallbackImage: string;
  code: string;
  applicableDishId?: string;
  validUntil: string;
}

