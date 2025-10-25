import type { View } from './App';

export interface Product {
  id: number;
  name: string;
  sku: string;
  image: string; // Main image
  gallery: string[]; // Image gallery
  stock: number;
  prices: {
    retail: number;
    wholesale: number;
  };
  category: string;
  description: string;
}

export type ProductFormData = Omit<Product, 'id'> & { id?: number };

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface User {
  id: number;
  mobile: string;
  name: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل شده';
}

// New Types for Categories and Menus

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

export interface Menu {
  id: number;
  name: string;
  location: 'header' | 'footer';
}

export interface MenuItem {
  id: number;
  menuId: number;
  title: string;
  type: 'page' | 'category' | 'custom';
  value: string; // Can be a view name, category slug, or a URL
  parentId: number | null;
  order: number;
}

export interface PageLink {
    view: View;
    title: string;
}

// New Types for Settings

export interface GeneralSettings {
  title: string;
  description: string;
  icon: string; // URL or base64
  favicon: string; // URL or base64
}

export interface FooterSettings {
  aboutUs: string;
  enamadLink: string;
  samandehiLink: string;
  copyrightText: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  cost: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

export interface AppSettings {
  general: GeneralSettings;
  footer: FooterSettings;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
}
