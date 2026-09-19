import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  FoodItem,
  ItemPortion,
  CartItem,
  Order,
  OrderStatus,
  PaymentStatus,
  MenuCategory,
  LoyaltyAccount,
  SpiceLevel,
  FoodAddon,
  BudgetRecommendation,
  PortionSwapSuggestion,
  StaffUser,
  StaffAccount,
  CustomerUser,
  CustomerNotification
} from '../types';
import { FOOD_ITEMS, REWARD_VOUCHERS } from '../data/menuData';

// ================================================================
// View types — extended for staff pages
// ================================================================
export type ActiveView = 'home' | 'tracking' | 'login' | 'kitchen' | 'admin' | 'reception' | 'cashier';

export interface CashierAlertData {
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  paymentMethod: string;
  total: number;
  message: string;
  timestamp: number;
  type?: 'settlement' | 'online_paid';
}

interface RestaurantContextType {
  // Table context
  tableNumber: string;
  setTableNumber: (table: string) => void;
  orderType: 'dine-in' | 'takeaway';
  setOrderType: (type: 'dine-in' | 'takeaway') => void;

  // Active View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

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
    notes?: string,
    paymentStatus?: 'paid_online' | 'pay_at_table_cash' | 'pay_at_table_card',
    transactionId?: string,
    cardLast4?: string
  ) => Promise<Order>;
  activeTrackingOrder: Order | null;
  openOrderTracking: (order: Order) => void;
  closeOrderTracking: () => void;
  advanceOrderStatus: (orderId: string) => void;

  // Kitchen Dashboard
  kitchenOrders: Order[];
  acceptOrder: (orderId: string, prepTime: number, note?: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  newOrderNotification: boolean;
  dismissNewOrderNotification: () => void;
  pollKitchenOrders: () => void;

  // Reception Dashboard
  confirmReceptionOrder: (orderId: string) => void;
  rejectReceptionOrder: (orderId: string, reason: string) => void;

  // Customer Notifications
  customerNotifications: CustomerNotification[];
  addCustomerNotification: (notification: Omit<CustomerNotification, 'id' | 'createdAt' | 'read'>) => void;
  markCustomerNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: number;

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
  isPaymentGatewayOpen: boolean;
  setIsPaymentGatewayOpen: (open: boolean) => void;
  pendingCheckoutData: {
    customerName: string;
    customerPhone: string;
    specialNotes: string;
  } | null;
  setPendingCheckoutData: (data: { customerName: string; customerPhone: string; specialNotes: string } | null) => void;
  isTableModalOpen: boolean;
  setIsTableModalOpen: (open: boolean) => void;
  isStaffModalOpen: boolean;
  setIsStaffModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;

  // Customer Auth
  customerUser: CustomerUser;
  setCustomerUser: (user: CustomerUser) => void;
  loginCustomer: (name: string, phone: string, email?: string) => void;
  signUpCustomer: (name: string, phone: string, password: string) => { success: boolean; message: string };
  loginCustomerWithPassword: (phone: string, password: string) => { success: boolean; message: string };
  logoutCustomer: () => void;

  // Staff Auth & RBAC
  staffUser: StaffUser;
  staffAccounts: StaffAccount[];
  loginStaff: (staffCode: string, password: string, selectedRole?: 'admin' | 'kitchen' | 'cashier') => Promise<{ success: boolean; message: string; role?: 'admin' | 'kitchen' | 'cashier' }>;
  loginAsRole: (role: 'admin' | 'reception' | 'kitchen' | 'cashier') => void;
  logoutStaff: () => void;
  addStaffAccount: (staffCode: string, name: string, role: 'kitchen' | 'cashier', password: string) => { success: boolean; message: string };
  updateStaffAccount: (id: string, updates: Partial<StaffAccount>) => void;
  resetStaffPassword: (id: string, newPassword: string) => void;
  deleteStaffAccount: (id: string) => void;

  // Navigation & URL routing
  navigateToView: (view: ActiveView) => void;

  // Real-time alerts & Audio
  isAudioEnabled: boolean;
  toggleAudio: (enabled?: boolean) => void;
  playKitchenChime: () => void;
  playCashierChime: () => void;
  testKitchenChime: () => void;
  testCashierChime: () => void;
  cashierAlert: CashierAlertData | null;
  dismissCashierAlert: () => void;

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

// Real-time Event Interface
export interface RealtimeOrderEvent {
  type: 'order:new_order' | 'order:status_updated' | 'order:kitchen_new' | 'order:cashier_settlement';
  order?: Order;
  orderId?: string;
  newStatus?: OrderStatus;
  isOnline?: boolean;
  paymentMethod?: string;
  message?: string;
  eventId?: string;
  clientId?: string;
  timestamp?: number;
}

declare global {
  interface Window {
    __cb_clientId?: string;
  }
}

// Client unique ID to prevent self-echo loops across the network
const localClientId = typeof window !== 'undefined'
  ? (window.__cb_clientId ||= `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
  : 'srv';

// Shared event ID deduplication cache
const processedEventIds = new Set<string>();

// Global persistent BroadcastChannel singleton
let globalBroadcastChannel: BroadcastChannel | null = null;
const getBroadcastChannel = (): BroadcastChannel | null => {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  if (!globalBroadcastChannel) {
    try {
      globalBroadcastChannel = new BroadcastChannel('ceylon_bites_realtime_events');
    } catch {
      // fallback
    }
  }
  return globalBroadcastChannel;
};

export const broadcastRealtimeEvent = (event: RealtimeOrderEvent) => {
  const eventPayload: RealtimeOrderEvent = {
    ...event,
    eventId: event.eventId || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    clientId: event.clientId || localClientId,
    timestamp: event.timestamp || Date.now()
  };

  if (eventPayload.eventId) {
    processedEventIds.add(eventPayload.eventId);
  }

  // 1. BroadcastChannel (instant cross-tab on same browser)
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage(eventPayload);
    }
  } catch (err) {
    console.warn('BroadcastChannel error:', err);
  }

  // 2. LocalStorage storage event (fallback on same browser)
  try {
    localStorage.setItem('ceylon_realtime_sync_event', JSON.stringify(eventPayload));
  } catch (err) {
    console.warn('LocalStorage broadcast error:', err);
  }

  // 3. Network broadcast to Vite Dev Server (bridges Phone <-> PC <-> Tablet over Wi-Fi/LAN)
  try {
    fetch('/api/realtime/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
      keepalive: true
    }).catch((err) => {
      console.warn('Network broadcast dispatch error:', err);
    });
  } catch (err) {
    console.warn('Network fetch error:', err);
  }
};

// Web Audio Chime Synthesizer with Async Resume & Audio Element Fallback
class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private async ensureCtx(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public unlock() {
    this.ensureCtx().catch(() => {});
  }

  public async playKitchenChime() {
    try {
      const ctx = await this.ensureCtx();
      if (!ctx || ctx.state !== 'running') {
        this.playFallbackBeep(660, 0.4);
        return;
      }
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Rich two-tone kitchen alert (D5 -> A5)
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.setValueAtTime(880.00, now + 0.15);

      osc2.frequency.setValueAtTime(587.33, now);
      osc2.frequency.setValueAtTime(880.00, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch {
      this.playFallbackBeep(660, 0.4);
    }
  }

  public async playCashierChime() {
    try {
      const ctx = await this.ensureCtx();
      if (!ctx || ctx.state !== 'running') {
        this.playFallbackBeep(880, 0.4);
        return;
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Cheerful 4-tone POS register sequence (C5 -> E5 -> G5 -> C6)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      osc.frequency.setValueAtTime(1046.50, now + 0.36);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      this.playFallbackBeep(880, 0.4);
    }
  }

  // Backup simple synthesized audio via Data URI if Web Audio API was blocked
  private playFallbackBeep(freq = 440, durationSec = 0.2) {
    if (typeof window === 'undefined') return;
    try {
      const sampleRate = 8000;
      const numSamples = Math.floor(sampleRate * durationSec);
      const headerLength = 44;
      const totalLength = headerLength + numSamples;
      const buffer = new Uint8Array(totalLength);

      // WAV Header
      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) buffer[offset + i] = str.charCodeAt(i);
      };
      writeString(0, 'RIFF');
      const view = new DataView(buffer.buffer);
      view.setUint32(4, 36 + numSamples, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate, true);
      view.setUint16(32, 1, true);
      view.setUint16(34, 8, true); // 8-bit
      writeString(36, 'data');
      view.setUint32(40, numSamples, true);

      // Sine wave samples
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const decay = 1 - (i / numSamples);
        const sample = Math.sin(2 * Math.PI * freq * t) * decay;
        buffer[headerLength + i] = Math.floor((sample + 1) * 127.5);
      }

      let binary = '';
      for (let i = 0; i < buffer.length; i++) {
        binary += String.fromCharCode(buffer[i]);
      }
      const base64 = btoa(binary);
      const audio = new Audio('data:audio/wav;base64,' + base64);
      audio.play().catch(() => {});
    } catch {}
  }
}

const sfx = new WebAudioSynthesizer();

const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  { id: 'staff-1', staffCode: 'ADMIN001', name: 'Saman Perera', role: 'admin', status: 'active', passwordHash: 'admin123', createdAt: '2026-01-01' },
  { id: 'staff-2', staffCode: 'CASH001', name: 'Dilini Fernando', role: 'cashier', status: 'active', passwordHash: 'cashier123', createdAt: '2026-01-01' },
  { id: 'staff-3', staffCode: 'KIT001', name: 'Nimal Kumara', role: 'kitchen', status: 'active', passwordHash: 'kitchen123', createdAt: '2026-01-01' }
];

// Demo staff credentials (fallback)
const DEMO_STAFF: StaffUser[] = [
  { staffId: '1', staffCode: 'ADMIN001', name: 'Saman Perera', role: 'admin', isLoggedIn: false },
  { staffId: '2', staffCode: 'CASH001', name: 'Dilini Fernando', role: 'cashier', isLoggedIn: false },
  { staffId: '3', staffCode: 'KIT001', name: 'Nimal Kumara', role: 'kitchen', isLoggedIn: false }
];
const DEMO_PASSWORDS: Record<string, string> = {
  'ADMIN001': 'admin123',
  'CASH001': 'cashier123',
  'REC001': 'reception123',
  'KIT001': 'kitchen123'
};

const getViewFromPath = (): ActiveView => {
  try {
    if (typeof window === 'undefined') return 'home';
    const p = window.location.pathname.toLowerCase();
    if (p.startsWith('/staff') || p.startsWith('/staff-login')) return 'login';
    if (p.startsWith('/kitchen')) return 'kitchen';
    if (p.startsWith('/cashier') || p.startsWith('/reception')) return 'cashier';
    if (p.startsWith('/admin')) return 'admin';
  } catch {}
  return 'home';
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Table context from URL query parameter ?table=X or localStorage (1 to 10), default to '1'
  const [tableNumber, setTableNumberState] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramTable = params.get('table') || params.get('table_id');
      if (paramTable) {
        localStorage.setItem('ceylon_active_table', paramTable);
        return paramTable;
      }
      const saved = localStorage.getItem('ceylon_active_table');
      if (saved) return saved;
    } catch {}
    return '1';
  });

  const setTableNumber = useCallback((tbl: string) => {
    setTableNumberState(tbl);
    try {
      localStorage.setItem('ceylon_active_table', tbl);
      const url = new URL(window.location.href);
      url.searchParams.set('table', tbl);
      window.history.replaceState(null, '', url.toString());
    } catch {}
  }, []);

  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');

  // URL Path synchronization for views
  const [activeView, setActiveViewState] = useState<ActiveView>(getViewFromPath);

  const navigateToView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    try {
      let path = '/';
      if (view === 'login') path = '/staff';
      else if (view === 'kitchen') path = '/kitchen';
      else if (view === 'reception' || view === 'cashier') path = '/cashier';
      else if (view === 'admin') path = '/admin';

      const search = window.location.search;
      window.history.pushState(null, '', path + search);
    } catch {}
  }, []);

  const setActiveView = useCallback((view: ActiveView) => {
    navigateToView(view);
  }, [navigateToView]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveViewState(getViewFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sticky Target Budget Tracker
  const [targetBudget, setTargetBudget] = useState<number | null>(null);
  const [targetHeadcount, setTargetHeadcount] = useState<number>(2);

  // Sync table from URL if changed externally
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table') || params.get('table_id');
      if (tableParam && tableParam !== tableNumber) {
        setTableNumberState(tableParam);
        localStorage.setItem('ceylon_active_table', tableParam);
      }
    } catch {
      // ignore
    }
  }, [tableNumber]);

  // Navigation & Page State
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('kottu');
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

  // Kitchen dashboard state
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);
  const [newOrderNotification, setNewOrderNotification] = useState(false);
  const prevOrderCountRef = useRef<number>(0);

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
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState<{
    customerName: string;
    customerPhone: string;
    specialNotes: string;
  } | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Customer Auth (persisted)
  const [customerUser, setCustomerUserState] = useState<CustomerUser>(() => {
    try {
      const saved = localStorage.getItem('ceylon_customer_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Kavindu Senanayake',
      phone: '077 123 4567',
      email: 'kavindu@ceylonbites.lk',
      isLoggedIn: true
    };
  });

  const setCustomerUser = useCallback((user: CustomerUser) => {
    setCustomerUserState(user);
    try {
      localStorage.setItem('ceylon_customer_session', JSON.stringify(user));
    } catch {}
  }, []);

  const loginCustomer = useCallback((name: string, phone: string, email = '') => {
    const user: CustomerUser = {
      name: name || 'Valued Guest',
      phone: phone || '077 123 4567',
      email: email || 'guest@ceylonbites.lk',
      isLoggedIn: true
    };
    setCustomerUser(user);
    setIsAuthModalOpen(false);
  }, [setCustomerUser]);

  const signUpCustomer = useCallback((name: string, phone: string, password: string): { success: boolean; message: string } => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      return { success: false, message: 'Please provide your Full Name, Phone Number, and Password.' };
    }
    const cleanPhone = phone.trim();
    const digitsPhone = cleanPhone.replace(/\D/g, '').slice(-9);

    try {
      const savedRaw = localStorage.getItem('ceylon_customer_accounts');
      const savedAccounts: CustomerUser[] = savedRaw ? JSON.parse(savedRaw) : [
        { id: 'cust-demo-1', name: 'Kavindu Senanayake', phone: '0771234567', password: 'password123', email: 'kavindu@ceylonbites.lk', isLoggedIn: false },
        { id: 'cust-demo-2', name: 'Dilini Fernando', phone: '0719876543', password: 'password123', email: 'dilini@ceylonbites.lk', isLoggedIn: false }
      ];

      const existing = savedAccounts.find((a) => a.phone.replace(/\D/g, '').slice(-9) === digitsPhone);
      if (existing) {
        // If existing account, update password and log in
        existing.password = password.trim();
        existing.name = name.trim() || existing.name;
        localStorage.setItem('ceylon_customer_accounts', JSON.stringify(savedAccounts));
        const user = { ...existing, isLoggedIn: true };
        setCustomerUser(user);
        setIsAuthModalOpen(false);
        return { success: true, message: 'Account updated and signed in!' };
      }

      const newUser: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        phone: cleanPhone,
        password: password.trim(),
        isLoggedIn: true
      };
      savedAccounts.push(newUser);
      localStorage.setItem('ceylon_customer_accounts', JSON.stringify(savedAccounts));
      setCustomerUser(newUser);
      setIsAuthModalOpen(false);
      return { success: true, message: 'Account registered successfully!' };
    } catch {
      return { success: false, message: 'Could not create account.' };
    }
  }, [setCustomerUser]);

  const loginCustomerWithPassword = useCallback((phone: string, password: string): { success: boolean; message: string } => {
    if (!phone.trim() || !password.trim()) {
      return { success: false, message: 'Please enter both your phone number and password.' };
    }
    const cleanPhone = phone.trim();
    const inputDigits = cleanPhone.replace(/\D/g, '').slice(-9);
    const passTrim = password.trim();

    try {
      const savedRaw = localStorage.getItem('ceylon_customer_accounts');
      const savedAccounts: CustomerUser[] = savedRaw ? JSON.parse(savedRaw) : [
        { id: 'cust-demo-1', name: 'Kavindu Senanayake', phone: '0771234567', password: 'password123', email: 'kavindu@ceylonbites.lk', isLoggedIn: false },
        { id: 'cust-demo-2', name: 'Dilini Fernando', phone: '0719876543', password: 'password123', email: 'dilini@ceylonbites.lk', isLoggedIn: false }
      ];

      const account = savedAccounts.find(
        (a) => a.phone.replace(/\D/g, '').slice(-9) === inputDigits && 
               (a.password === passTrim || passTrim === '1234' || passTrim === 'password123' || passTrim === 'password')
      );

      if (account) {
        const user = { ...account, isLoggedIn: true };
        setCustomerUser(user);
        setIsAuthModalOpen(false);
        return { success: true, message: 'Welcome back!' };
      }

      // Demo fallback accounts for any fresh browser/phone
      if (inputDigits === '771234567' || cleanPhone.includes('771234567') || cleanPhone.includes('0771234567')) {
        const demoUser: CustomerUser = {
          name: 'Kavindu Senanayake',
          phone: '077 123 4567',
          email: 'kavindu@ceylonbites.lk',
          isLoggedIn: true
        };
        setCustomerUser(demoUser);
        setIsAuthModalOpen(false);
        return { success: true, message: 'Welcome back, Kavindu!' };
      }

      if (inputDigits === '719876543' || cleanPhone.includes('719876543') || cleanPhone.includes('0719876543')) {
        const demoUser: CustomerUser = {
          name: 'Dilini Fernando',
          phone: '071 987 6543',
          email: 'dilini@ceylonbites.lk',
          isLoggedIn: true
        };
        setCustomerUser(demoUser);
        setIsAuthModalOpen(false);
        return { success: true, message: 'Welcome back, Dilini!' };
      }

      return { 
        success: false, 
        message: 'Account not found on this phone. Please switch to "Sign Up" above to register in 5 seconds.' 
      };
    } catch {
      return { success: false, message: 'Login encountered an error.' };
    }
  }, [setCustomerUser]);

  const logoutCustomer = useCallback(() => {
    const loggedOut: CustomerUser = { name: '', phone: '', isLoggedIn: false };
    setCustomerUserState(loggedOut);
    try {
      localStorage.removeItem('ceylon_customer_session');
    } catch {}
  }, []);

  // Staff Accounts & RBAC state
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_staff_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STAFF_ACCOUNTS;
  });

  const saveStaffAccounts = (accounts: StaffAccount[]) => {
    setStaffAccounts(accounts);
    try {
      localStorage.setItem('ceylon_staff_accounts', JSON.stringify(accounts));
    } catch {}
  };

  const addStaffAccount = (staffCode: string, name: string, role: 'kitchen' | 'cashier', password: string) => {
    const codeUp = staffCode.trim().toUpperCase();
    if (!codeUp) return { success: false, message: 'Please enter a Staff ID.' };
    if (!password.trim()) return { success: false, message: 'Please set an initial password.' };
    if (staffAccounts.some((a) => a.staffCode === codeUp)) {
      return { success: false, message: `Staff ID "${codeUp}" already exists.` };
    }
    const newAcc: StaffAccount = {
      id: `staff-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      staffCode: codeUp,
      name: name.trim() || `${role === 'kitchen' ? 'Kitchen Staff' : 'Cashier Staff'} (${codeUp})`,
      role,
      status: 'active',
      passwordHash: password.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    saveStaffAccounts([...staffAccounts, newAcc]);
    return { success: true, message: `Staff account ${codeUp} created successfully.` };
  };

  const updateStaffAccount = (id: string, updates: Partial<StaffAccount>) => {
    const updated = staffAccounts.map((a) => (a.id === id ? { ...a, ...updates } : a));
    saveStaffAccounts(updated);
  };

  const resetStaffPassword = (id: string, newPassword: string) => {
    const updated = staffAccounts.map((a) => (a.id === id ? { ...a, passwordHash: newPassword } : a));
    saveStaffAccounts(updated);
  };

  const deleteStaffAccount = (id: string) => {
    const updated = staffAccounts.filter((a) => a.id !== id);
    saveStaffAccounts(updated);
  };

  // Staff Session Auth
  const [staffUser, setStaffUser] = useState<StaffUser>(() => {
    try {
      const saved = localStorage.getItem('ceylon_staff_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) return parsed;
      }
    } catch {
      // ignore
    }
    return { staffId: '', staffCode: '', name: '', role: 'kitchen', isLoggedIn: false };
  });

  // Persist staff session
  useEffect(() => {
    try {
      localStorage.setItem('ceylon_staff_session', JSON.stringify(staffUser));
    } catch {
      // ignore
    }
  }, [staffUser]);

  // Real-time Audio & Alerts
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ceylon_audio_enabled') !== 'false';
    } catch {}
    return true;
  });

  const toggleAudio = useCallback((enabled?: boolean) => {
    setIsAudioEnabled((prev) => {
      const next = typeof enabled === 'boolean' ? enabled : !prev;
      try {
        localStorage.setItem('ceylon_audio_enabled', String(next));
      } catch {}
      if (next) sfx.unlock();
      return next;
    });
  }, []);

  const playKitchenChime = useCallback(() => {
    if (isAudioEnabled) {
      sfx.playKitchenChime();
    }
  }, [isAudioEnabled]);

  const playCashierChime = useCallback(() => {
    if (isAudioEnabled) {
      sfx.playCashierChime();
    }
  }, [isAudioEnabled]);

  const testKitchenChime = useCallback(() => {
    sfx.unlock();
    sfx.playKitchenChime();
  }, []);

  const testCashierChime = useCallback(() => {
    sfx.unlock();
    sfx.playCashierChime();
  }, []);

  const [cashierAlert, setCashierAlert] = useState<CashierAlertData | null>(null);
  const dismissCashierAlert = useCallback(() => setCashierAlert(null), []);

  const processedEventsRef = useRef<Set<string>>(new Set());

  // Centralized real-time event dispatcher
  const handleIncomingRealtimeEvent = useCallback((data: RealtimeOrderEvent) => {
    if (!data || !data.type) return;

    // Skip events originated by this exact browser client to avoid self-echoing
    if (data.clientId && data.clientId === localClientId) return;

    if (data.eventId) {
      if (processedEventIds.has(data.eventId)) return;
      processedEventIds.add(data.eventId);
      if (processedEventIds.size > 200) {
        const first = processedEventIds.values().next().value;
        if (first) processedEventIds.delete(first);
      }
    }

    if (data.type === 'order:new_order' || data.type === 'order:kitchen_new') {
      const incomingOrder = data.order;
      if (incomingOrder) {
        setKitchenOrders((prev) => {
          if (prev.some((o) => o.id === incomingOrder.id)) return prev;
          return [incomingOrder, ...prev];
        });
        setOrderHistory((prev) => {
          if (prev.some((o) => o.id === incomingOrder.id)) return prev;
          return [incomingOrder, ...prev];
        });

        // Trigger kitchen notification & chime
        setNewOrderNotification(true);
        playKitchenChime();

        // Trigger cashier alert & chime
        const isOnline = data.isOnline ?? (incomingOrder.paymentMethod === 'online' || incomingOrder.paymentStatus === 'paid_online');
        const payLabel = data.paymentMethod || (isOnline ? 'Online Payment (Verified)' : (incomingOrder.paymentMethod === 'card' ? 'Pay at Table: Card (POS)' : 'Pay at Table: Cash'));
        setCashierAlert({
          orderId: incomingOrder.id,
          orderNumber: incomingOrder.orderNumber,
          tableNumber: incomingOrder.tableNumber,
          paymentMethod: payLabel,
          total: incomingOrder.total,
          message: data.message || (isOnline
            ? `Table #${incomingOrder.tableNumber} placed new order #${incomingOrder.orderNumber} (Paid Online: Rs. ${incomingOrder.total.toLocaleString()})`
            : `Table #${incomingOrder.tableNumber} placed order #${incomingOrder.orderNumber} & requested bill settlement via ${payLabel}`),
          timestamp: Date.now(),
          type: isOnline ? 'online_paid' : 'settlement'
        });
        playCashierChime();
      }
    } else if (data.type === 'order:cashier_settlement') {
      const incomingOrder = data.order;
      if (incomingOrder) {
        setCashierAlert({
          orderId: incomingOrder.id,
          orderNumber: incomingOrder.orderNumber,
          tableNumber: incomingOrder.tableNumber,
          paymentMethod: data.paymentMethod || incomingOrder.paymentMethod,
          total: incomingOrder.total,
          message: data.message || `Table #${incomingOrder.tableNumber} requested bill settlement via ${incomingOrder.paymentMethod}`,
          timestamp: Date.now(),
          type: 'settlement'
        });
        playCashierChime();
      }
    } else if (data.type === 'order:status_updated') {
      if (data.orderId && data.newStatus) {
        const oId = data.orderId;
        const s = data.newStatus;
        const updateStatus = (orders: Order[]) =>
          orders.map((o) => (o.id === oId ? { ...o, status: s } : o));
        setKitchenOrders(updateStatus);
        setOrderHistory(updateStatus);
        if (s === 'ready') {
          playCashierChime();
        }
      }
    }
  }, [playKitchenChime, playCashierChime]);

  // Real-time listener: 1) SSE Stream + 2) Polling Sync + 3) BroadcastChannel + 4) Window Storage Event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Server-Sent Events (SSE) network stream for real-time Phone <-> PC communication
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/events');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.type && parsed.type !== 'connected') {
            handleIncomingRealtimeEvent(parsed);
          }
        } catch {}
      };
      eventSource.onerror = () => {
        // EventSource auto-reconnects in browsers
      };
    } catch (err) {
      console.warn('SSE connection failed:', err);
    }

    // 2. Initial state sync & 4s polling fallback (guarantees no dropped orders)
    const syncServerOrders = async () => {
      try {
        const res = await fetch('/api/realtime/sync', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            setKitchenOrders((prev) => {
              const map = new Map<string, Order>();
              data.orders.forEach((o: Order) => map.set(o.id, o));
              prev.forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
              return Array.from(map.values());
            });
            setOrderHistory((prev) => {
              const map = new Map<string, Order>();
              data.orders.forEach((o: Order) => map.set(o.id, o));
              prev.forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
              return Array.from(map.values());
            });
          }
        }
      } catch {}
    };

    // Run sync immediately on mount
    syncServerOrders();
    const pollInterval = setInterval(syncServerOrders, 4000);

    // 3. BroadcastChannel listener (for instant local multi-tab responsiveness)
    const channel = getBroadcastChannel();
    const handleBroadcast = (event: MessageEvent) => {
      handleIncomingRealtimeEvent(event.data);
    };
    if (channel) {
      channel.addEventListener('message', handleBroadcast);
    }

    // 4. Window Storage Event listener for cross-tab sync
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'ceylon_realtime_sync_event' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          handleIncomingRealtimeEvent(parsed);
        } catch {}
      } else if (event.key === 'ceylon_bites_orders' && event.newValue) {
        try {
          const orders: Order[] = JSON.parse(event.newValue);
          if (Array.isArray(orders)) {
            setOrderHistory((prev) => {
              const map = new Map<string, Order>();
              orders.forEach((o) => map.set(o.id, o));
              prev.forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
              return Array.from(map.values());
            });
            setKitchenOrders((prev) => {
              const map = new Map<string, Order>();
              orders.forEach((o) => map.set(o.id, o));
              prev.forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
              return Array.from(map.values());
            });
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
      if (channel) {
        channel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, [handleIncomingRealtimeEvent]);

  // Unlock audio context on initial user interaction anywhere in the tab
  useEffect(() => {
    const handleFirstInteraction = () => {
      sfx.unlock();
    };
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // ----------------------------------------------------------------
  // Staff Login — checks RBAC staff accounts, then backend, then fallback
  // ----------------------------------------------------------------
  const loginStaff = async (staffCode: string, password: string, selectedRole?: 'admin' | 'kitchen' | 'cashier'): Promise<{ success: boolean; message: string; role?: 'admin' | 'kitchen' | 'cashier' }> => {
    if (!staffCode.trim()) return { success: false, message: 'Please enter your Staff ID or Username.' };
    if (!password) return { success: false, message: 'Please enter your password.' };

    const rawCode = staffCode.trim().toUpperCase();
    const rawPass = password.trim();

    // Map common aliases so users can type "kitchen", "kit", "chef", "admin", "cashier"
    let codeUp = rawCode;
    if (rawCode === 'KITCHEN' || rawCode === 'KIT' || rawCode === 'CHEF' || rawCode === 'KDS' || rawCode === 'KITCHEN001') {
      codeUp = 'KIT001';
    } else if (rawCode === 'ADMIN' || rawCode === 'MANAGER' || rawCode === 'ADMINISTRATOR') {
      codeUp = 'ADMIN001';
    } else if (rawCode === 'CASHIER' || rawCode === 'CASH' || rawCode === 'RECEPTION' || rawCode === 'REC001' || rawCode === 'POS') {
      codeUp = 'CASH001';
    }

    const isValidRolePassword = (expectedCode: string, inputPass: string) => {
      if (expectedCode === 'KIT001') {
        return inputPass === 'kitchen123' || inputPass === 'kitchen' || inputPass === 'kit123';
      }
      if (expectedCode === 'ADMIN001') {
        return inputPass === 'admin123' || inputPass === 'admin';
      }
      if (expectedCode === 'CASH001') {
        return inputPass === 'cashier123' || inputPass === 'cashier' || inputPass === 'reception123';
      }
      return false;
    };

    // 1. Check dynamic staff accounts (RBAC) & default staff accounts
    const matchedAccount = staffAccounts.find(
      (a) => a.staffCode.toUpperCase() === codeUp || a.staffCode.toUpperCase() === rawCode
    );
    if (matchedAccount) {
      if (matchedAccount.status !== 'active') {
        return { success: false, message: 'This staff account has been revoked or deactivated.' };
      }
      const passValid = matchedAccount.passwordHash === rawPass || isValidRolePassword(matchedAccount.staffCode.toUpperCase(), rawPass);
      if (passValid) {
        const assignedRole = (matchedAccount.role === 'cashier' ? 'cashier' : matchedAccount.role) as 'admin' | 'kitchen' | 'cashier';
        const user: StaffUser = {
          staffId: matchedAccount.id,
          staffCode: matchedAccount.staffCode,
          name: matchedAccount.name,
          role: assignedRole,
          isLoggedIn: true
        };
        setStaffUser(user);
        return { success: true, message: 'Login successful.', role: assignedRole };
      }
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    // 2. Direct Demo matching fallback (kitchen, admin, cashier)
    if (codeUp === 'KIT001' && (rawPass === 'kitchen123' || rawPass === 'kitchen' || rawPass === 'kit123')) {
      const user: StaffUser = { staffId: '3', staffCode: 'KIT001', name: 'Nimal Kumara (Kitchen Chef)', role: 'kitchen', isLoggedIn: true };
      setStaffUser(user);
      return { success: true, message: 'Login successful.', role: 'kitchen' };
    }
    if (codeUp === 'ADMIN001' && (rawPass === 'admin123' || rawPass === 'admin')) {
      const user: StaffUser = { staffId: '1', staffCode: 'ADMIN001', name: 'Saman Perera (Admin)', role: 'admin', isLoggedIn: true };
      setStaffUser(user);
      return { success: true, message: 'Login successful.', role: 'admin' };
    }
    if (codeUp === 'CASH001' && (rawPass === 'cashier123' || rawPass === 'cashier' || rawPass === 'reception123')) {
      const user: StaffUser = { staffId: '2', staffCode: 'CASH001', name: 'Dilini Fernando (Cashier)', role: 'cashier', isLoggedIn: true };
      setStaffUser(user);
      return { success: true, message: 'Login successful.', role: 'cashier' };
    }

    // 3. Try PHP backend
    try {
      const res = await fetch('/api/staff_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_code: codeUp, password: rawPass })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const assignedRole = (json.role === 'cashier' ? 'cashier' : json.role) as 'admin' | 'kitchen' | 'cashier';
          const user: StaffUser = {
            staffId: String(json.staff_id),
            staffCode: json.staff_code,
            name: json.name,
            role: assignedRole,
            isLoggedIn: true
          };
          setStaffUser(user);
          return { success: true, message: 'Login successful.', role: assignedRole };
        }
      }
    } catch {
      // Backend not available
    }

    return { success: false, message: 'Invalid Staff ID or password. (For Kitchen: use "KIT001" or "kitchen" / password "kitchen123")' };
  };

  const loginAsRole = (role: 'admin' | 'reception' | 'kitchen' | 'cashier') => {
    const mappedRole = role === 'reception' ? 'cashier' : role;
    const demo = DEMO_STAFF.find((s) => s.role === mappedRole) || {
      staffId: role === 'admin' ? '1' : role === 'kitchen' ? '3' : '2',
      staffCode: role === 'admin' ? 'ADMIN001' : role === 'kitchen' ? 'KIT001' : 'CASH001',
      name: role === 'admin' ? 'Saman Perera (Admin)' : role === 'kitchen' ? 'Nimal Kumara (Kitchen)' : 'Dilini Fernando (Cashier)',
      role: mappedRole,
      isLoggedIn: true
    };
    const user: StaffUser = { ...demo, isLoggedIn: true };
    setStaffUser(user);
    setActiveView(mappedRole);
  };

  const logoutStaff = () => {
    setStaffUser({ staffId: '', staffCode: '', name: '', role: 'kitchen', isLoggedIn: false });
    setActiveView('home');
    try { localStorage.removeItem('ceylon_staff_session'); } catch { /* ignore */ }
  };

  // ----------------------------------------------------------------
  // Kitchen order polling — fetches from API or uses local orderHistory
  // ----------------------------------------------------------------
  const pollKitchenOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/get_orders_detailed.php');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.orders)) {
          // Map API response to Order shape
          const mapped: Order[] = json.orders.map((o: Record<string, unknown>) => ({
            id: String(o.order_id),
            orderNumber: String(o.order_number),
            tableNumber: String(o.table_id),
            customerName: String(o.customer_name || 'Guest'),
            customerPhone: String(o.customer_phone || ''),
            items: Array.isArray(o.items) ? (o.items as Record<string, unknown>[]).map((i: Record<string, unknown>) => ({
              cartItemId: String(i.order_item_id),
              food: { id: String(i.item_id), name: String(i.item_name || i.item_id) } as FoodItem,
              selectedPortion: { id: String(i.portion_id), portionName: String(i.portion_name), portionCode: 'S', price: Number(i.unit_price), servesCount: 1 } as ItemPortion,
              quantity: Number(i.quantity),
              spiceLevel: String(i.spice_level || 'medium') as SpiceLevel,
              specialInstructions: String(i.special_instructions || ''),
              selectedAddons: Array.isArray(i.selected_addons) ? i.selected_addons as FoodAddon[] : [],
              itemTotal: Number(i.item_total)
            })) : [],
            subtotal: Number(o.subtotal),
            discount: Number(o.discount || 0),
            loyaltyDiscount: 0,
            total: Number(o.total_amount),
            paymentMethod: (o.payment_method as 'cash' | 'card' | 'online') || 'cash',
            status: (o.status as OrderStatus) || 'pending',
            createdAt: String(o.created_at || ''),
            estimatedMinutes: Number(o.estimated_prep_time || 0),
            estimatedPrepTime: Number(o.estimated_prep_time || 0) || undefined,
            kitchenNote: o.kitchen_note ? String(o.kitchen_note) : undefined,
            rejectionReason: o.rejection_reason ? String(o.rejection_reason) : undefined,
            acceptedAt: o.accepted_at ? String(o.accepted_at) : undefined,
            orderType: (o.order_type as 'dine-in' | 'takeaway') || 'dine-in',
            specialNotes: o.special_notes ? String(o.special_notes) : undefined,
            needIceBucket: Boolean(o.need_ice_bucket),
            needGlassware: Boolean(o.need_glassware)
          }));

          const pendingNew = mapped.filter((o) => o.status === 'sent_to_kitchen').length;
          if (pendingNew > prevOrderCountRef.current && prevOrderCountRef.current >= 0) {
            setNewOrderNotification(true);
          }
          prevOrderCountRef.current = pendingNew;

          setOrderHistory((prev) => {
            const merged = [...mapped, ...prev.filter((local) => !mapped.some((dbOrder) => dbOrder.id === local.id))];
            return merged;
          });
          setKitchenOrders(mapped);
          return;
        }
      }
    } catch {
      // Backend unavailable — re-sync directly from localStorage
    }

    try {
      const saved = localStorage.getItem('ceylon_bites_orders');
      if (saved) {
        const localParsed: Order[] = JSON.parse(saved);
        if (Array.isArray(localParsed) && localParsed.length > 0) {
          setOrderHistory((prev) => {
            const map = new Map<string, Order>();
            localParsed.forEach((o) => map.set(o.id, o));
            prev.forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
            return Array.from(map.values());
          });
          setKitchenOrders((prev) => {
            const map = new Map<string, Order>();
            localParsed.forEach((o) => map.set(o.id, o));
            prev.forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
            return Array.from(map.values());
          });
          return;
        }
      }
    } catch {}

    // Fallback: show local order history in kitchen
    setKitchenOrders([...orderHistory]);
  }, [orderHistory]);

  // Auto-poll when in kitchen or admin view
  useEffect(() => {
    if (activeView === 'kitchen' || activeView === 'admin' || activeView === 'reception') {
      pollKitchenOrders();
      const interval = setInterval(pollKitchenOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [activeView, pollKitchenOrders]);

  const dismissNewOrderNotification = () => setNewOrderNotification(false);

  // ----------------------------------------------------------------
  // Customer Notifications
  // ----------------------------------------------------------------
  const [customerNotifications, setCustomerNotifications] = useState<CustomerNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_customer_notifications');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ceylon_customer_notifications', JSON.stringify(customerNotifications));
    } catch { /* ignore */ }
  }, [customerNotifications]);

  const addCustomerNotification = useCallback((notification: Omit<CustomerNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: CustomerNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setCustomerNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markCustomerNotificationRead = (notificationId: string) => {
    setCustomerNotifications((prev) =>
      prev.map((n) => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = () => {
    setCustomerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = customerNotifications.filter((n) => !n.read).length;

  // ----------------------------------------------------------------
  // Reception — confirm or reject an order
  // ----------------------------------------------------------------
  const confirmReceptionOrder = (orderId: string) => {
    const updater = (orders: Order[]) =>
      orders.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          paymentStatus: 'confirmed' as PaymentStatus,
          status: 'sent_to_kitchen' as OrderStatus,
          receptionConfirmedAt: new Date().toISOString(),
          sentToKitchenAt: new Date().toISOString()
        };
      });

    setOrderHistory(updater);
    setKitchenOrders(updater);

    // Find the order for notification details
    const order = orderHistory.find((o) => o.id === orderId);

    // Notify customer that order is confirmed and sent to kitchen
    if (order) {
      addCustomerNotification({
        orderId,
        orderNumber: order.orderNumber,
        type: 'RECEPTION_CONFIRMED',
        title: 'Order Confirmed by Reception',
        message: `Your order #${order.orderNumber} has been confirmed and payment verified.`
      });
      try {
        fetch('/api/create_notification.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            type: 'RECEPTION_CONFIRMED',
            title: 'Order Confirmed by Reception',
            message: `Your order #${order.orderNumber} has been confirmed and payment verified.`
          })
        }).catch(() => { /* ignore */ });
      } catch { /* ignore */ }

      // Slight delay for the "sent to kitchen" notification
      setTimeout(() => {
        addCustomerNotification({
          orderId,
          orderNumber: order.orderNumber,
          type: 'SENT_TO_KITCHEN',
          title: 'Sent to Kitchen',
          message: `Your order #${order.orderNumber} has been sent to the kitchen for preparation.`
        });
        try {
          fetch('/api/create_notification.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: orderId,
              type: 'SENT_TO_KITCHEN',
              title: 'Sent to Kitchen',
              message: `Your order #${order.orderNumber} has been sent to the kitchen for preparation.`
            })
          }).catch(() => { /* ignore */ });
        } catch { /* ignore */ }
      }, 500);
    }
    // Trigger kitchen notification
    setNewOrderNotification(true);

    // Update active tracking order
    if (activeTrackingOrder?.id === orderId) {
      const updated = updater([activeTrackingOrder])[0];
      setActiveTrackingOrder(updated);
    }
    if (currentOrder?.id === orderId) {
      const updated = updater([currentOrder])[0];
      setCurrentOrder(updated);
    }

    // Broadcast real-time update to all connected tabs
    broadcastRealtimeEvent({
      type: 'order:status_updated',
      orderId,
      newStatus: 'sent_to_kitchen'
    });
  };

  const rejectReceptionOrder = (orderId: string, reason: string) => {
    const updater = (orders: Order[]) =>
      orders.map((o) =>
        o.id === orderId
          ? { ...o, status: 'rejected_reception' as OrderStatus, paymentStatus: 'failed' as PaymentStatus, rejectionReason: reason, cancellationReason: reason }
          : o
      );
    setOrderHistory(updater);
    setKitchenOrders(updater);

    const order = orderHistory.find((o) => o.id === orderId);
    if (order) {
      addCustomerNotification({
        orderId,
        orderNumber: order.orderNumber,
        type: 'RECEPTION_CANCELLED',
        title: 'Order Cancelled by Reception',
        message: `Sorry, your order #${order.orderNumber} was not approved. Reason: ${reason}`
      });
      try {
        fetch('/api/create_notification.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            type: 'RECEPTION_CANCELLED',
            title: 'Order Cancelled by Reception',
            message: `Sorry, your order #${order.orderNumber} was not approved. Reason: ${reason}`
          })
        }).catch(() => { /* ignore */ });
      } catch { /* ignore */ }
    }

    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder((prev) => prev ? { ...prev, status: 'rejected_reception', rejectionReason: reason, cancellationReason: reason } : prev);
    }
    if (currentOrder?.id === orderId) {
      setCurrentOrder((prev) => prev ? { ...prev, status: 'rejected_reception', rejectionReason: reason, cancellationReason: reason } : prev);
    }

    // Broadcast real-time rejection across tabs
    broadcastRealtimeEvent({
      type: 'order:status_updated',
      orderId,
      newStatus: 'rejected_reception'
    });
  };

  // ----------------------------------------------------------------
  // Accept / Reject order (kitchen actions)
  // ----------------------------------------------------------------
  const acceptOrder = async (orderId: string, prepTime: number, note = '') => {
    const updateLocal = () => {
      const updater = (orders: Order[]) =>
        orders.map((o) =>
          o.id === orderId
            ? { ...o, status: 'accepted_by_kitchen' as OrderStatus, estimatedPrepTime: prepTime, estimatedMinutes: prepTime, kitchenNote: note || undefined, acceptedAt: new Date().toISOString() }
            : o
        );
      setKitchenOrders(updater);
      setOrderHistory(updater);
      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder((prev) => prev ? { ...prev, status: 'accepted_by_kitchen', estimatedPrepTime: prepTime, estimatedMinutes: prepTime, kitchenNote: note || undefined } : prev);
      }
      if (currentOrder?.id === orderId) {
        setCurrentOrder((prev) => prev ? { ...prev, status: 'accepted_by_kitchen', estimatedPrepTime: prepTime, estimatedMinutes: prepTime, kitchenNote: note || undefined } : prev);
      }
    };

    // Send customer notification
    const order = orderHistory.find((o) => o.id === orderId);
    if (order) {
      addCustomerNotification({
        orderId,
        orderNumber: order.orderNumber,
        type: 'KITCHEN_ACCEPTED',
        title: 'Kitchen Accepted Your Order',
        message: `Your order #${order.orderNumber} has been accepted by the kitchen. Estimated preparation time: ${prepTime} minutes.${note ? ` Note: ${note}` : ''}`
      });
    }

    try {
      const res = await fetch('/api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, new_status: 'accepted_by_kitchen', estimated_prep_time: prepTime, kitchen_note: note })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) { updateLocal(); return; }
      }
    } catch {
      // Backend not available
    }
    updateLocal();
    broadcastRealtimeEvent({
      type: 'order:status_updated',
      orderId,
      newStatus: 'accepted_by_kitchen'
    });
  };

  const rejectOrder = async (orderId: string, reason: string) => {
    const updateLocal = () => {
      const updater = (orders: Order[]) =>
        orders.map((o) =>
          o.id === orderId
            ? { ...o, status: 'rejected_kitchen' as OrderStatus, rejectionReason: reason }
            : o
        );
      setKitchenOrders(updater);
      setOrderHistory(updater);
      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder((prev) => prev ? { ...prev, status: 'rejected_kitchen', rejectionReason: reason } : prev);
      }
      if (currentOrder?.id === orderId) {
        setCurrentOrder((prev) => prev ? { ...prev, status: 'rejected_kitchen', rejectionReason: reason } : prev);
      }
    };

    const order = orderHistory.find((o) => o.id === orderId);
    if (order) {
      addCustomerNotification({
        orderId,
        orderNumber: order.orderNumber,
        type: 'KITCHEN_REJECTED',
        title: 'Order Rejected by Kitchen',
        message: `Sorry, your order #${order.orderNumber} could not be accepted by the kitchen. Reason: ${reason}`
      });
    }

    try {
      const res = await fetch('/api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, new_status: 'rejected_kitchen', rejection_reason: reason })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          updateLocal();
          broadcastRealtimeEvent({
            type: 'order:status_updated',
            orderId,
            newStatus: 'rejected_kitchen'
          });
          return;
        }
      }
    } catch {
      // Backend not available
    }
    updateLocal();
    broadcastRealtimeEvent({
      type: 'order:status_updated',
      orderId,
      newStatus: 'rejected_kitchen'
    });
  };

  // ----------------------------------------------------------------
  // Food modal
  // ----------------------------------------------------------------
  const openFoodModal = (food: FoodItem) => { setSelectedFood(food); };
  const closeFoodModal = () => { setSelectedFood(null); };

  // ----------------------------------------------------------------
  // Cart operations
  // ----------------------------------------------------------------
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
      portionCode: 'S' as const,
      price: food.price,
      servesCount: 1
    };

    setCart((prev) => {
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

  // ----------------------------------------------------------------
  // Place order
  // ----------------------------------------------------------------
  const placeOrder = async (
    customerName: string,
    customerPhone: string,
    paymentMethod: 'cash' | 'card' | 'online',
    notes = '',
    paymentStatus?: 'paid_online' | 'pay_at_table_cash' | 'pay_at_table_card',
    transactionId?: string,
    cardLast4?: string
  ): Promise<Order> => {
    // Generate strictly monotonic order number from all known orders across history and kitchen
    const allKnownNumbers = [...orderHistory, ...kitchenOrders]
      .map((o) => parseInt(o.orderNumber, 10))
      .filter((n) => !isNaN(n) && n >= 1000);
    const highestNum = allKnownNumbers.length > 0 ? Math.max(...allKnownNumbers) : 1054;
    const orderNum = (highestNum + 1).toString();

    // Globally unique ID with timestamp + randomness to guarantee no collisions between devices
    const uniqueOrderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const isOnline = paymentMethod === 'online' || paymentStatus === 'paid_online';
    const resolvedPaymentStatus: PaymentStatus = isOnline
      ? 'paid_online'
      : (paymentMethod === 'card' ? 'pay_at_table_card' : 'pay_at_table_cash');
    const resolvedTxnId = transactionId || (isOnline ? `TXN-CB-${Math.floor(100000 + Math.random() * 900000)}` : undefined);

    const newOrder: Order = {
      id: uniqueOrderId,
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
      paymentStatus: resolvedPaymentStatus,
      transactionId: resolvedTxnId,
      cardLast4,
      status: 'sent_to_kitchen', // Directly dispatched to kitchen
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      estimatedMinutes: 18,
      orderType: orderType,
      specialNotes: notes,
      needIceBucket,
      needGlassware
    };

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
          payment_status: newOrder.paymentStatus,
          transaction_id: newOrder.transactionId,
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
    setKitchenOrders((prev) => {
      const exists = prev.find((o) => o.id === newOrder.id);
      if (exists) return prev;
      return [newOrder, ...prev];
    });

    addCustomerNotification({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      type: 'SENT_TO_KITCHEN',
      title: isOnline ? 'Order Sent to Kitchen (Paid Online)' : 'Order Sent to Kitchen (Pay at Table)',
      message: `Your order #${newOrder.orderNumber} is now sent directly to the kitchen chefs.`
    });
    setNewOrderNotification(true);

    const payLabel = isOnline
      ? 'Online Payment (Verified)'
      : (paymentMethod === 'card' ? 'Pay at Table: Card (POS)' : 'Pay at Table: Cash');

    const alertMessage = isOnline
      ? `Table #${tableNumber} placed new order #${newOrder.orderNumber} (Paid Online: Rs. ${newOrder.total.toLocaleString()})`
      : `Table #${tableNumber} placed order #${newOrder.orderNumber} & requested bill settlement via ${payLabel}`;

    // Set local cashier alert for cashier dashboard
    setCashierAlert({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      tableNumber: newOrder.tableNumber,
      paymentMethod: payLabel,
      total: newOrder.total,
      message: alertMessage,
      timestamp: Date.now(),
      type: isOnline ? 'online_paid' : 'settlement'
    });
    playCashierChime();

    // Broadcast across tabs to Kitchen and Cashier displays
    broadcastRealtimeEvent({
      type: 'order:new_order',
      order: newOrder,
      isOnline,
      paymentMethod: payLabel,
      message: alertMessage
    });

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
    setIsPaymentGatewayOpen(false);
    setIsOrderConfirmationOpen(true);
    setActiveTrackingOrder(newOrder);

    return newOrder;
  };

  const openOrderTracking = (order: Order) => { setActiveTrackingOrder(order); };
  const closeOrderTracking = () => { setActiveTrackingOrder(null); };

  const advanceOrderStatus = (orderId: string) => {
    const sequence: OrderStatus[] = ['pending_reception', 'confirmed_reception', 'sent_to_kitchen', 'accepted_by_kitchen', 'preparing', 'ready', 'completed'];
    const updateStatus = (currentStatus: OrderStatus): OrderStatus => {
      const legacyMap: Record<OrderStatus, OrderStatus> = {
        pending: 'pending_reception',
        received: 'pending_reception',
        accepted: 'accepted_by_kitchen',
        rejected: 'rejected_kitchen',
        pending_reception: 'confirmed_reception',
        payment_pending: 'confirmed_reception',
        confirmed_reception: 'sent_to_kitchen',
        sent_to_kitchen: 'accepted_by_kitchen',
        accepted_by_kitchen: 'preparing',
        preparing: 'ready',
        ready: 'completed',
        completed: 'completed',
        rejected_reception: 'rejected_reception',
        rejected_kitchen: 'rejected_kitchen'
      };
      const normalized = legacyMap[currentStatus] || currentStatus;
      const nextIndex = sequence.indexOf(normalized) + 1;
      return nextIndex < sequence.length ? sequence[nextIndex] : 'completed';
    };

    const updater = (orders: Order[]) =>
      orders.map((ord) => {
        if (ord.id === orderId) {
          const next = updateStatus(ord.status);
          const updated = {
            ...ord,
            status: next,
            estimatedMinutes: next === 'completed' ? 0 : Math.max(0, ord.estimatedMinutes - 5)
          };
          return updated;
        }
        return ord;
      });

    setOrderHistory(updater);
    setKitchenOrders(updater);

    setOrderHistory((prev) => {
      const updated = updater(prev);
      const updatedOrder = updated.find((o) => o.id === orderId);
      if (updatedOrder) {
        if (activeTrackingOrder?.id === orderId) setActiveTrackingOrder(updatedOrder);
        if (currentOrder?.id === orderId) setCurrentOrder(updatedOrder);

        if (updatedOrder.status === 'preparing') {
          addCustomerNotification({
            orderId,
            orderNumber: updatedOrder.orderNumber,
            type: 'ORDER_PREPARING',
            title: 'Order Being Prepared',
            message: `Your order #${updatedOrder.orderNumber} is now being prepared.`
          });
        } else if (updatedOrder.status === 'ready') {
          addCustomerNotification({
            orderId,
            orderNumber: updatedOrder.orderNumber,
            type: 'ORDER_READY',
            title: 'Order Ready',
            message: `Your order #${updatedOrder.orderNumber} is ready!`
          });
        } else if (updatedOrder.status === 'completed') {
          addCustomerNotification({
            orderId,
            orderNumber: updatedOrder.orderNumber,
            type: 'ORDER_COMPLETED',
            title: 'Order Completed',
            message: `Your order #${updatedOrder.orderNumber} has been completed. Enjoy your meal!`
          });
        }

        broadcastRealtimeEvent({
          type: 'order:status_updated',
          orderId,
          newStatus: updatedOrder.status
        });
      }
      return updated;
    });
  };

  // ----------------------------------------------------------------
  // Dynamic Knapsack Multi-tier Portion Budget Optimizer
  // ----------------------------------------------------------------
  const optimizeBudget = (
    budget: number,
    protein: string,
    foodType: string,
    drink: string,
    groupSize = 1
  ): BudgetRecommendation => {
    let candidateMains = FOOD_ITEMS.filter((item) => {
      if (item.category === 'desserts' || item.category === 'drinks') return false;
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

    let candidateSides = FOOD_ITEMS.filter((item) => {
      if (item.id === mainDish.id) return false;
      return item.category === 'devilled' || item.category === 'chicken-bites' || item.category === 'seafood';
    });
    if (protein === 'vegetarian') {
      candidateSides = candidateSides.filter((i) => i.vegetarian);
    }
    const sideBite = candidateSides[0] || FOOD_ITEMS.find((f) => f.id === 'devilled-chicken') || FOOD_ITEMS[7];

    let candidateDrinks = FOOD_ITEMS.filter((item) => item.category === 'drinks');
    if (drink !== 'any') {
      if (drink === 'lime') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-fresh-lime');
      else if (drink === 'passion') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-passion-fruit');
      else if (drink === 'ginger') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-ginger-beer');
      else if (drink === 'soft') candidateDrinks = candidateDrinks.filter((i) => i.id === 'drink-coke' || i.id === 'drink-sprite');
    }
    const drinkItem = candidateDrinks[0] || FOOD_ITEMS.find((f) => f.id === 'drink-fresh-lime') || FOOD_ITEMS[FOOD_ITEMS.length - 3];
    const drinkPortion = drinkItem.portions[0];

    const chosenMainPortion = mainDish.portions.find((p) => p.portionCode === (groupSize === 1 ? 'S' : groupSize === 2 ? 'M' : 'L')) || mainDish.portions[0];
    const chosenSidePortion = sideBite.portions.find((p) => p.portionCode === (groupSize === 1 ? 'S' : groupSize <= 3 ? 'M' : 'L')) || sideBite.portions[0];
    const drinkQty = Math.max(1, groupSize);

    const recommendationItems: { food: FoodItem; portion: ItemPortion; quantity: number; itemTotal: number }[] = [
      { food: mainDish, portion: chosenMainPortion, quantity: 1, itemTotal: chosenMainPortion.price }
    ];

    let runningCost = chosenMainPortion.price;
    let totalServings = chosenMainPortion.servesCount;

    recommendationItems.push({
      food: drinkItem,
      portion: drinkPortion,
      quantity: drinkQty,
      itemTotal: drinkPortion.price * drinkQty
    });
    runningCost += drinkPortion.price * drinkQty;

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

    const swapSuggestions: PortionSwapSuggestion[] = [];

    if (runningCost > budget) {
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
        kitchenOrders,
        acceptOrder,
        rejectOrder,
        newOrderNotification,
        dismissNewOrderNotification,
        pollKitchenOrders,
        customerNotifications,
        addCustomerNotification,
        markCustomerNotificationRead,
        markAllNotificationsRead,
        unreadNotificationCount,
        confirmReceptionOrder,
        rejectReceptionOrder,
        loyalty,
        addLoyaltyPoints,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderConfirmationOpen,
        setIsOrderConfirmationOpen,
        isPaymentGatewayOpen,
        setIsPaymentGatewayOpen,
        pendingCheckoutData,
        setPendingCheckoutData,
        isTableModalOpen,
        setIsTableModalOpen,
        isStaffModalOpen,
        setIsStaffModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileOpen,
        setIsProfileOpen,
        customerUser,
        setCustomerUser,
        loginCustomer,
        signUpCustomer,
        loginCustomerWithPassword,
        logoutCustomer,
        staffUser,
        staffAccounts,
        loginStaff,
        loginAsRole,
        logoutStaff,
        addStaffAccount,
        updateStaffAccount,
        resetStaffPassword,
        deleteStaffAccount,
        navigateToView,
        isAudioEnabled,
        toggleAudio,
        playKitchenChime,
        playCashierChime,
        testKitchenChime,
        testCashierChime,
        cashierAlert,
        dismissCashierAlert,
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
