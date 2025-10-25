import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import type { Product, CartItem, User, Order, ProductFormData, Category, Menu, MenuItem, PageLink, AppSettings, GeneralSettings, FooterSettings, ShippingMethod, PaymentMethod } from '../types';
import { mockProducts, mockUser, mockOrders, mockCategories, mockMenus, mockMenuItems, availablePages as defaultPages, mockSettings } from '../data/mockData';
import type { View } from '../App';

export type PriceTier = 'retail' | 'wholesale';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  updateCartQuantity: (productId:number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  user: User | null;
  login: (mobile: string) => void;
  logout: () => void;
  priceTier: PriceTier;
  setPriceTier: (tier: PriceTier) => void;
  view: View;
  setView: (view: View) => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  getProductById: (id: number) => Product | undefined;
  selectedProductId: number | null;
  recentlyViewed: number[];
  viewProduct: (productId: number) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  // Admin functions
  isAdmin: boolean;
  adminLogin: (username: string, password: string) => boolean;
  orders: Order[];
  addProduct: (productData: ProductFormData) => void;
  updateProduct: (productData: Product) => void;
  deleteProduct: (productId: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  // Category and Menu Management
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: number) => void;
  menus: Menu[];
  menuItems: MenuItem[];
  updateMenuItems: (menuId: number, items: MenuItem[]) => void;
  availablePages: PageLink[];
  // New Settings Management
  settings: AppSettings;
  updateGeneralSettings: (data: GeneralSettings) => void;
  updateFooterSettings: (data: FooterSettings) => void;
  addShippingMethod: (method: Omit<ShippingMethod, 'id'>) => void;
  updateShippingMethod: (method: ShippingMethod) => void;
  deleteShippingMethod: (methodId: number) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (methodId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [priceTier, setPriceTier] = useState<PriceTier>('retail');
  const [view, setView] = useState<View>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // State for categories and menus
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [availablePages] = useState<PageLink[]>(defaultPages);

  // New state for settings
  const [settings, setSettings] = useState<AppSettings>(mockSettings);


  const getProductById = useCallback((id: number) => products.find(p => p.id === id), [products]);

  const addToCart = (productId: number, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { productId, quantity }];
    });
  };
  
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };
  
  const clearCart = () => setCart([]);

  const getCartTotal = useMemo(() => () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return total;
      const price = product.prices[priceTier];
      return total + price * item.quantity;
    }, 0);
  }, [cart, products, priceTier]);

  const login = (mobile: string) => {
    setUser(mockUser);
    setShowLogin(false);
  };

  const adminLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true);
      if (!user) {
        setUser(mockUser); 
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setPriceTier('retail');
    setView('home');
  };
  
  const viewProduct = (productId: number) => {
      setSelectedProductId(productId);
      setView('productDetail');
      setRecentlyViewed(prev => {
          const newHistory = [productId, ...prev.filter(id => id !== productId)];
          return newHistory.slice(0, 8); // Keep last 8 viewed items
      });
  };

  // Admin Functions
  const addProduct = (productData: ProductFormData) => {
    setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Category Management Functions
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: Date.now() }]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };
  
  const deleteCategory = (categoryId: number) => {
     // Also delete children and update products using this category
    setCategories(prev => prev.filter(c => c.id !== categoryId && c.parentId !== categoryId));
  };
  
  // Menu Management Functions
  const updateMenuItems = (menuId: number, items: MenuItem[]) => {
      setMenuItems(prev => [
          ...prev.filter(item => item.menuId !== menuId),
          ...items
      ]);
  };

  // Settings Management Functions
  const updateGeneralSettings = (data: GeneralSettings) => {
    setSettings(prev => ({ ...prev, general: data }));
  };
  
  const updateFooterSettings = (data: FooterSettings) => {
    setSettings(prev => ({ ...prev, footer: data }));
  };

  const addShippingMethod = (method: Omit<ShippingMethod, 'id'>) => {
    setSettings(prev => ({
      ...prev,
      shippingMethods: [...prev.shippingMethods, { ...method, id: Date.now() }]
    }));
  };

  const updateShippingMethod = (updatedMethod: ShippingMethod) => {
    setSettings(prev => ({
      ...prev,
      shippingMethods: prev.shippingMethods.map(m => m.id === updatedMethod.id ? updatedMethod : m)
    }));
  };
  
  const deleteShippingMethod = (methodId: number) => {
    setSettings(prev => ({
      ...prev,
      shippingMethods: prev.shippingMethods.filter(m => m.id !== methodId)
    }));
  };
  
  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, { ...method, id: Date.now() }]
    }));
  };

  const updatePaymentMethod = (updatedMethod: PaymentMethod) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(m => m.id === updatedMethod.id ? updatedMethod : m)
    }));
  };
  
  const deletePaymentMethod = (methodId: number) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(m => m.id !== methodId)
    }));
  };

  const value = {
    products,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    user,
    login,
    logout,
    priceTier,
    setPriceTier,
    view,
    setView,
    showLogin,
    setShowLogin,
    getProductById,
    selectedProductId,
    recentlyViewed,
    viewProduct,
    categoryFilter,
    setCategoryFilter,
    isAdmin,
    adminLogin,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    menus,
    menuItems,
    updateMenuItems,
    availablePages,
    settings,
    updateGeneralSettings,
    updateFooterSettings,
    addShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
