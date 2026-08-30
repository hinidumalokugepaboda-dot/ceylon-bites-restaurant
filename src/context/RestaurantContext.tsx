import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FoodItem,
  ItemPortion,
  CartItem,
  Order,
  OrderStatus,
  MenuCategory,
  LoyaltyAccount,
  SpiceLevel,
  FoodAddon,
  BudgetRecommendation,
  PortionSwapSuggestion
} from '../types';
import { FOOD_ITEMS, REWARD_VOUCHERS } from '../data/menuData';

interface RestaurantContextType {
  // Table context
  tableNumber: string;
  setTableNumber: (table: string) => void;
  orderType: 'dine-in' | 'takeaway';
  setOrderType: (type: 'dine-in' | 'takeaway') => void;

  // Active View ('home' | 'tracking')
  activeView: 'home' | 'tracking';
  setActiveView: (view: 'home' | 'tracking') => void;

  // Target Budget Limit Tracker
  targetBudget: number | null;
  setTargetBudget: (budget: number | null) => void;
  targetHeadcount: number;
  setTargetHeadcount: (count: number) => void;

  // Navigation & Page State
  activeCategory: MenuCategory;
  setActiveCategory: (cat: MenuCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: 'all' | 'spicy' | 'vegetarian' | 'popular' | 'chef-special';
  setSelectedFilter: (filter: 'all' | 'spicy' | 'vegetarian' | 'popular' | 'chef-special') => void;

  // Selected Food Details Modal
  selectedFood: FoodItem | null;
  openFoodModal: (food: FoodItem) => void;
  closeFoodModal: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    food: FoodItem,
    quantity?: number,
    spiceLevel?: SpiceLevel,
    specialInstructions?: string,
    selectedAddons?: FoodAddon[],
    selectedPortion?: ItemPortion
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  appliedDiscount: number;
  appliedPromoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  appliedLoyaltyDiscount: number;
  redeemLoyaltyInCart: (points: number) => boolean;
  removeLoyaltyDiscount: () => void;
  finalCartTotal: number;

  // BYOB Accessories in Cart
  needIceBucket: boolean;
  setNeedIceBucket: (need: boolean) => void;
  needGlassware: boolean;
  setNeedGlassware: (need: boolean) => void;

  // Orders & Tracking
  currentOrder: Order | null;
  orderHistory: Order[];
  placeOrder: (
    customerName: string,
    customerPhone: string,
    paymentMethod: 'cash' | 'card' | 'online',
    notes?: string
  ) => Promise<Order>;
  activeTrackingOrder: Order | null;
  openOrderTracking: (order: Order) => void;
  closeOrderTracking: () => void;
  advanceOrderStatus: (orderId: string) => void;

  // Loyalty
  loyalty: LoyaltyAccount;
  addLoyaltyPoints: (points: number, reason: string) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderConfirmationOpen: boolean;
  setIsOrderConfirmationOpen: (open: boolean) => void;
  isTableModalOpen: boolean;
  setIsTableModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;

  // Customer Auth (Mock)
  customerUser: {
    name: string;
    phone: string;
    email: string;
    isLoggedIn: boolean;
  };
  loginCustomer: (name: string, phone: string, email?: string) => void;
  logoutCustomer: () => void;

  // Budget Optimizer Helper
  optimizeBudget: (
    budget: number,
    protein: string,
    foodType: string,
    drink: string,
    groupSize: number
  ) => BudgetRecommendation;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const INITIAL_LOYALTY: LoyaltyAccount = {
  points: 2450,
  tier: 'Gold',
  nextTierPoints: 3000,
  totalSpent: 24500,
  ordersCount: 9,
  rewards: REWARD_VOUCHERS,
  history: [
    { id: 'lh-1', date: 'Aug 10, 2026', title: 'Dine-in Table 12 Order #1037', points: 185, type: 'earned', orderNumber: '#1037' },
    { id: 'lh-2', date: 'Aug 02, 2026', title: 'Weekend Sizzle Bonus', points: 200, type: 'earned' },
    { id: 'lh-3', date: 'Jul 28, 2026', title: 'Redeemed Rs. 500 Food Discount', points: -500, type: 'redeemed' },
    { id: 'lh-4', date: 'Jul 20, 2026', title: 'Dine-in Table 05 Order #0988', points: 245, type: 'earned', orderNumber: '#0988' }
  ]
};

const getFood = (id: string): FoodItem => {
  return FOOD_ITEMS.find((f) => f.id === id) || FOOD_ITEMS[0];
};

const INITIAL_ORDER_HISTORY: Order[] = [
  {
    id: 'ord-1042',
    orderNumber: '1042',
    tableNumber: '12',
    customerName: 'Kavindu Senanayake',
    customerPhone: '077 123 4567',
    items: [
      {
        cartItemId: 'hist-1',
        food: getFood('kottu-chicken'),
        selectedPortion: getFood('kottu-chicken').portions[0],
        quantity: 2,
        spiceLevel: 'spicy',
        specialInstructions: 'Extra spicy with gravy',
        selectedAddons: [{ id: 'addon-extra-cheese', name: 'Add Melty Mozzarella Cheese', price: 300 }],
        itemTotal: 2500
      },
      {
        cartItemId: 'hist-2',
        food: getFood('drink-fresh-lime'),
        selectedPortion: getFood('drink-fresh-lime').portions[0],
        quantity: 2,
        spiceLevel: 'mild',
        specialInstructions: 'With soda',
        selectedAddons: [],
        itemTotal: 500
      }
    ],
    subtotal: 3000,
    discount: 550,
    loyaltyDiscount: 0,
    total: 2450,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: 'August 15, 2026 • 8:15 PM',
    estimatedMinutes: 0,
    orderType: 'dine-in',
    needIceBucket: true,
    needGlassware: true
  },
  {
    id: 'ord-1037',
    orderNumber: '1037',
    tableNumber: '12',
    customerName: 'Kavindu Senanayake',
    customerPhone: '077 123 4567',
    items: [
      {
        cartItemId: 'hist-3',
        food: getFood('rice-chicken'),
        selectedPortion: getFood('rice-chicken').portions[0],
        quantity: 1,
        spiceLevel: 'medium',
        specialInstructions: 'Less oil',
        selectedAddons: [],
        itemTotal: 900
      },
      {
        cartItemId: 'hist-4',
        food: getFood('devilled-chicken'),
        selectedPortion: getFood('devilled-chicken').portions[0],
        quantity: 1,
        spiceLevel: 'spicy',
        specialInstructions: 'Extra crispy',
        selectedAddons: [],
        itemTotal: 850
      },
      {
        cartItemId: 'hist-5',
        food: getFood('drink-ginger-beer'),
        selectedPortion: getFood('drink-ginger-beer').portions[0],
        quantity: 1,
        spiceLevel: 'medium',
        specialInstructions: '',
        selectedAddons: [],
        itemTotal: 180
      }
    ],
    subtotal: 1930,
    discount: 80,
    loyaltyDiscount: 0,
    total: 1850,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: 'August 10, 2026 • 7:45 PM',
    estimatedMinutes: 0,
    orderType: 'dine-in'
  }
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Table context from URL query parameter ?table=12
  const [tableNumber, setTableNumber] = useState<string>('12');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [activeView, setActiveView] = useState<'home' | 'tracking'>('home');

  // Sticky Target Budget Tracker
  const [targetBudget, setTargetBudget] = useState<number | null>(null);
  const [targetHeadcount, setTargetHeadcount] = useState<number>(2);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        setTableNumber(tableParam);
      }
    } catch {
      // ignore
    }
  }, []);

  // Navigation & filtering
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'spicy' | 'vegetarian' | 'popular' | 'chef-special'>('all');

  // Food modal
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [appliedLoyaltyDiscount, setAppliedLoyaltyDiscount] = useState<number>(0);
  const [needIceBucket, setNeedIceBucket] = useState<boolean>(true);
  const [needGlassware, setNeedGlassware] = useState<boolean>(true);

  // Orders & Tracking
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_bites_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDER_HISTORY;
  });
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Save orders to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('ceylon_bites_orders', JSON.stringify(orderHistory));
    } catch {
      // ignore
    }
  }, [orderHistory]);

  // Loyalty
  const [loyalty, setLoyalty] = useState<LoyaltyAccount>(INITIAL_LOYALTY);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Customer Auth (mock persistent state)
  const [customerUser, setCustomerUser] = useState({
    name: 'Kavindu Senanayake',
    phone: '077 123 4567',
    email: 'kavindu.s@gmail.com',
    isLoggedIn: true
  });

  const openFoodModal = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const closeFoodModal = () => {
    setSelectedFood(null);
  };

  const addToCart = (
    food: FoodItem,
    quantity = 1,
    spiceLevel: SpiceLevel = food.spiceLevel,
    specialInstructions = '',
    selectedAddons: FoodAddon[] = [],
    selectedPortion?: ItemPortion
  ) => {
    const portionToUse = selectedPortion || food.portions?.[0] || {
      id: `${food.id}-default`,
      portionName: 'Small (S)',
      portionCode: 'S',
      price: food.price,
      servesCount: 1
    };

    setCart((prev) => {
      // Check if identical item with same portion and addons exists
      const addonIds = selectedAddons.map((a) => a.id).sort().join(',');
      const existingIndex = prev.findIndex(
        (item) =>
          item.food.id === food.id &&
          item.selectedPortion?.id === portionToUse.id &&
          item.spiceLevel === spiceLevel &&
          item.specialInstructions.trim() === specialInstructions.trim() &&
          item.selectedAddons.map((a) => a.id).sort().join(',') === addonIds
      );

      const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = portionToUse.price + addonsTotal;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: unitPrice * newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `${food.id}-${portionToUse.portionCode}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          food,
          selectedPortion: portionToUse,
          quantity,
          spiceLevel,
          specialInstructions,
          selectedAddons,
          itemTotal: unitPrice * quantity
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const addonsTotal = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
          const unitPrice = (item.selectedPortion?.price || item.food.price) + addonsTotal;
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: unitPrice * newQuantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setAppliedPromoCode('');
    setAppliedLoyaltyDiscount(0);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WEEKEND799' || clean === 'WEEKEND') {
      setAppliedDiscount(151);
      setAppliedPromoCode(clean);
      return true;
    } else if (clean === 'SEAFOOD400') {
      setAppliedDiscount(400);
      setAppliedPromoCode(clean);
      return true;
    } else if (clean === 'GROUPFEAST' || clean === 'BYOB10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount > 0 ? discount : 250);
      setAppliedPromoCode(clean);
      return true;
    } else if (clean === 'SIZZLE15') {
      const discount = Math.round(cartSubtotal * 0.15);
      setAppliedDiscount(discount);
      setAppliedPromoCode(clean);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setAppliedDiscount(0);
    setAppliedPromoCode('');
  };

  const redeemLoyaltyInCart = (points: number): boolean => {
    if (loyalty.points >= points) {
      const discount = points === 100 ? 100 : points === 500 ? 500 : points === 1000 ? 1000 : points;
      setAppliedLoyaltyDiscount(discount);
      return true;
    }
    return false;
  };

  const removeLoyaltyDiscount = () => {
    setAppliedLoyaltyDiscount(0);
  };

  const finalCartTotal = Math.max(0, cartSubtotal - appliedDiscount - appliedLoyaltyDiscount);

  const addLoyaltyPoints = (points: number, reason: string) => {
    setLoyalty((prev) => ({
      ...prev,
      points: prev.points + points,
      totalSpent: prev.totalSpent + (points > 0 ? points * 10 : 0),
      history: [
        {
          id: `lh-${Date.now()}`,
          date: 'Just now',
          title: reason,
          points: points,
          type: points >= 0 ? 'earned' : 'redeemed'
        },
        ...prev.history
      ]
    }));
  };

  const placeOrder = async (
    customerName: string,
    customerPhone: string,
    paymentMethod: 'cash' | 'card' | 'online',
    notes = ''
  ): Promise<Order> => {
    const orderNum = (1045 + orderHistory.length).toString();
    const newOrder: Order = {
      id: `ord-${orderNum}`,
      orderNumber: orderNum,
      tableNumber: tableNumber,
      customerName: customerName || customerUser.name || 'Guest Diner',
      customerPhone: customerPhone || customerUser.phone || '077 000 0000',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: appliedDiscount,
      loyaltyDiscount: appliedLoyaltyDiscount,
      total: finalCartTotal,
      paymentMethod,
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      estimatedMinutes: 18,
      orderType: orderType,
      specialNotes: notes,
      needIceBucket,
      needGlassware
    };

    // Attempt live POST to PHP backend if available
    try {
      await fetch('/api/place_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: newOrder.id,
          order_number: newOrder.orderNumber,
          table_id: newOrder.tableNumber,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          order_type: newOrder.orderType,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount + newOrder.loyaltyDiscount,
          total_amount: newOrder.total,
          payment_method: newOrder.paymentMethod,
          special_notes: newOrder.specialNotes,
          need_ice_bucket: newOrder.needIceBucket,
          need_glassware: newOrder.needGlassware,
          items: newOrder.items.map((it) => ({
            item_id: it.food.id,
            portion_id: it.selectedPortion?.id || `${it.food.id}-portion-s`,
            portion_name: it.selectedPortion?.portionName || 'Small (S)',
            quantity: it.quantity,
            unit_price: it.selectedPortion?.price || it.food.price,
            item_total: it.itemTotal,
            spice_level: it.spiceLevel,
            special_instructions: it.specialInstructions,
            selected_addons: it.selectedAddons
          }))
        })
      });
    } catch {
      // Backend not running or offline; local state & localStorage handle state seamlessly
    }

    setCurrentOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);

    // Earn loyalty points
    const earnedPoints = Math.round(finalCartTotal * 0.1);
    if (appliedLoyaltyDiscount > 0) {
      addLoyaltyPoints(-appliedLoyaltyDiscount, `Redeemed on Order #${orderNum}`);
    }
    if (earnedPoints > 0) {
      addLoyaltyPoints(earnedPoints, `Earned from Table ${tableNumber} Order #${orderNum}`);
    }

    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsOrderConfirmationOpen(true);
    setActiveTrackingOrder(newOrder);

    return newOrder;
  };

  const openOrderTracking = (order: Order) => {
    setActiveTrackingOrder(order);
  };

  const closeOrderTracking = () => {
    setActiveTrackingOrder(null);
  };

  const advanceOrderStatus = (orderId: string) => {
    const sequence: OrderStatus[] = ['received', 'accepted', 'preparing', 'ready', 'completed'];
    const updateStatus = (currentStatus: OrderStatus): OrderStatus => {
      const nextIndex = sequence.indexOf(currentStatus) + 1;
      return nextIndex < sequence.length ? sequence[nextIndex] : 'completed';
    };

    setOrderHistory((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const next = updateStatus(ord.status);
          const updated = {
            ...ord,
            status: next,
            estimatedMinutes: next === 'completed' ? 0 : Math.max(0, ord.estimatedMinutes - 5)
          };
          if (activeTrackingOrder?.id === orderId) {
            setActiveTrackingOrder(updated);
          }
          if (currentOrder?.id === orderId) {
            setCurrentOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  const loginCustomer = (name: string, phone: string, email = '') => {
    setCustomerUser({
      name: name || 'Valued Guest',
      phone: phone || '077 123 4567',
      email: email || 'guest@ceylonbites.lk',
      isLoggedIn: true
    });
    setIsAuthModalOpen(false);
  };

  const logoutCustomer = () => {
    setCustomerUser({
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false
    });
  };

  // -------------------------------------------------------------
  // Dynamic Knapsack Multi-tier Portion Budget Optimizer
  // -------------------------------------------------------------
  const optimizeBudget = (
    budget: number,
    protein: string,
    foodType: string,
    drink: string,
    groupSize = 1
  ): BudgetRecommendation => {
    // 1. Filter candidate mains
    let candidateMains = FOOD_ITEMS.filter((item) => {
      if (item.category === 'desserts' || item.category === 'drinks' || item.category === 'sharing') return false;
      if (foodType !== 'any' && item.category !== foodType) return false;
      if (protein !== 'any') {
        const itemText = (item.name + ' ' + item.description).toLowerCase();
        if (protein === 'chicken' && !itemText.includes('chicken')) return false;
        if (protein === 'beef' && !itemText.includes('beef')) return false;
        if (protein === 'seafood' && !itemText.includes('seafood') && !itemText.includes('prawn') && !itemText.includes('cuttlefish') && !itemText.includes('calamari') && !itemText.includes('fish')) return false;
        if (protein === 'vegetarian' && !item.vegetarian) return false;
      }
      return true;
    });

    if (candidateMains.length === 0) {
      candidateMains = FOOD_ITEMS.filter(
        (item) => item.category === 'kottu' || item.category === 'fried-rice' || item.category === 'devilled'
      );
    }
    candidateMains.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.price - b.price);
    const mainDish = candidateMains[0] || FOOD_ITEMS[0];

    // 2. Candidate side bites
    let candidateSides = FOOD_ITEMS.filter((item) => {
      if (item.id === mainDish.id) return false;
      return item.category === 'devilled' || item.category === 'chicken-bites' || item.category === 'seafood';
    });
    if (protein === 'vegetarian') {
      candidateSides = candidateSides.filter((i) => i.vegetarian);
    }
    const sideBite = candidateSides[0] || FOOD_ITEMS.find((f) => f.id === 'devilled-chicken') || FOOD_ITEMS[7];

    // 3. Candidate drinks
    let candidateDrinks = FOOD_ITEMS.filter((item) => item.category === 'drinks');
    if (drink !== 'any') {
      if (drink === 'lime') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-fresh-lime');
      else if (drink === 'passion') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-passion-fruit');
      else if (drink === 'ginger') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-ginger-beer');
      else if (drink === 'soft') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-coke' || i.id === 'drink-sprite');
    }
    const drinkItem = candidateDrinks[0] || FOOD_ITEMS.find((f) => f.id === 'drink-fresh-lime') || FOOD_ITEMS[FOOD_ITEMS.length - 3];
    const drinkPortion = drinkItem.portions[0];

    // 4. Select Portions using Knapsack & Headcount Constraint
    // Determine target portion for Main:
    // If groupSize == 1 -> Small (S - serves 1)
    // If groupSize == 2 -> Medium (M - serves 2)
    // If groupSize >= 3 -> Large (L - serves 3)
    let chosenMainPortion = mainDish.portions.find((p) => p.portionCode === (groupSize === 1 ? 'S' : groupSize === 2 ? 'M' : 'L')) || mainDish.portions[0];

    // Determine target portion for Side:
    let chosenSidePortion = sideBite.portions.find((p) => p.portionCode === (groupSize === 1 ? 'S' : groupSize <= 3 ? 'M' : 'L')) || sideBite.portions[0];

    // Drinks count: 1 per person
    const drinkQty = Math.max(1, groupSize);

    // Initial item selection
    const recommendationItems: { food: FoodItem; portion: ItemPortion; quantity: number; itemTotal: number }[] = [
      {
        food: mainDish,
        portion: chosenMainPortion,
        quantity: 1,
        itemTotal: chosenMainPortion.price
      }
    ];

    let runningCost = chosenMainPortion.price;
    let totalServings = chosenMainPortion.servesCount;

    // Add drinks
    recommendationItems.push({
      food: drinkItem,
      portion: drinkPortion,
      quantity: drinkQty,
      itemTotal: drinkPortion.price * drinkQty
    });
    runningCost += drinkPortion.price * drinkQty;

    // Add side bite if budget permits or group >= 2
    if (runningCost + chosenSidePortion.price <= budget || groupSize >= 2) {
      recommendationItems.splice(1, 0, {
        food: sideBite,
        portion: chosenSidePortion,
        quantity: 1,
        itemTotal: chosenSidePortion.price
      });
      runningCost += chosenSidePortion.price;
      totalServings += chosenSidePortion.servesCount;
    }

    // 5. Knapsack Downscaling if over budget
    const swapSuggestions: PortionSwapSuggestion[] = [];

    if (runningCost > budget) {
      // Check if downscaling Main portion brings it under budget
      const smallerMainPortions = mainDish.portions.filter((p) => p.price < chosenMainPortion.price);
      if (smallerMainPortions.length > 0) {
        const smallerPortion = smallerMainPortions[smallerMainPortions.length - 1];
        const savings = chosenMainPortion.price - smallerPortion.price;
        swapSuggestions.push({
          originalItem: mainDish,
          originalPortion: chosenMainPortion,
          suggestedItem: mainDish,
          suggestedPortion: smallerPortion,
          priceDifference: savings,
          type: 'downscale',
          explanation: `Downscale ${mainDish.name} from ${chosenMainPortion.portionName} (Rs. ${chosenMainPortion.price}) to ${smallerPortion.portionName} (Rs. ${smallerPortion.price}) to save Rs. ${savings}.`
        });
      }

      // Check if downscaling side bite helps
      const sideItemInCombo = recommendationItems.find((it) => it.food.id === sideBite.id);
      if (sideItemInCombo) {
        const smallerSidePortions = sideBite.portions.filter((p) => p.price < sideItemInCombo.portion.price);
        if (smallerSidePortions.length > 0) {
          const smallerSide = smallerSidePortions[0];
          const savings = sideItemInCombo.portion.price - smallerSide.price;
          swapSuggestions.push({
            originalItem: sideBite,
            originalPortion: sideItemInCombo.portion,
            suggestedItem: sideBite,
            suggestedPortion: smallerSide,
            priceDifference: savings,
            type: 'downscale',
            explanation: `Downscale ${sideBite.name} to ${smallerSide.portionName} to save Rs. ${savings}.`
          });
        }
      }
    } else {
      // Upscaling Suggestion: If remaining budget allows upgrade
      const remainingBudget = budget - runningCost;
      const largerMainPortions = mainDish.portions.filter((p) => p.price > chosenMainPortion.price);
      if (largerMainPortions.length > 0) {
        const upgradePortion = largerMainPortions[0];
        const extraCost = upgradePortion.price - chosenMainPortion.price;
        if (extraCost <= remainingBudget) {
          swapSuggestions.push({
            originalItem: mainDish,
            originalPortion: chosenMainPortion,
            suggestedItem: mainDish,
            suggestedPortion: upgradePortion,
            priceDifference: -extraCost,
            type: 'upscale',
            explanation: `Upgrade to ${upgradePortion.portionName} for only Rs. ${extraCost} more within your budget!`
          });
        }
      }
    }

    const isOver = runningCost > budget;
    const overAmount = isOver ? runningCost - budget : 0;
    const remaining = isOver ? 0 : budget - runningCost;

    return {
      items: recommendationItems,
      totalCost: runningCost,
      budget,
      remaining,
      totalServings,
      targetHeadcount: groupSize,
      comboTitle: `${mainDish.name} (${chosenMainPortion.portionCode}) + ${recommendationItems[1]?.food.name} Combo`,
      isOverBudget: isOver,
      overAmount,
      swapSuggestions
    };
  };

  return (
    <RestaurantContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        orderType,
        setOrderType,
        activeView,
        setActiveView,
        targetBudget,
        setTargetBudget,
        targetHeadcount,
        setTargetHeadcount,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
        selectedFood,
        openFoodModal,
        closeFoodModal,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        appliedDiscount,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
        appliedLoyaltyDiscount,
        redeemLoyaltyInCart,
        removeLoyaltyDiscount,
        finalCartTotal,
        needIceBucket,
        setNeedIceBucket,
        needGlassware,
        setNeedGlassware,
        currentOrder,
        orderHistory,
        placeOrder,
        activeTrackingOrder,
        openOrderTracking,
        closeOrderTracking,
        advanceOrderStatus,
        loyalty,
        addLoyaltyPoints,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderConfirmationOpen,
        setIsOrderConfirmationOpen,
        isTableModalOpen,
        setIsTableModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileOpen,
        setIsProfileOpen,
        customerUser,
        loginCustomer,
        logoutCustomer,
        optimizeBudget
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

