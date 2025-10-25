import type { Product, User, Order, Category, Menu, MenuItem, PageLink, AppSettings } from '../types';
import type { View } from '../App';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'دریل شارژی چکشی رونیکس',
    sku: 'RNX-8612',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Drill',
    gallery: ['https://placehold.co/400x400/f59e0b/white?text=Drill', 'https://placehold.co/400x400/f59e0b/white?text=Drill+View+2'],
    stock: 50,
    prices: { retail: 2500000, wholesale: 2200000 },
    category: 'ابزار شارژی',
    description: 'دریل شارژی 12 ولت با قابلیت چکشی، مناسب برای کارهای خانگی و نیمه‌صنعتی.'
  },
  {
    id: 2,
    name: 'مینی فرز توسن',
    sku: 'TSN-3382A',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Grinder',
    gallery: ['https://placehold.co/400x400/f59e0b/white?text=Grinder'],
    stock: 35,
    prices: { retail: 1800000, wholesale: 1650000 },
    category: 'ابزار برقی',
    description: 'مینی فرز قدرتمند با توان 850 وات و سرعت گردش 11000 دور در دقیقه.'
  },
  {
    id: 3,
    name: 'جعبه بکس 24 پارچه نووا',
    sku: 'NVA-1234',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Socket+Set',
    gallery: ['https://placehold.co/400x400/f59e0b/white?text=Socket+Set'],
    stock: 80,
    prices: { retail: 1200000, wholesale: 1050000 },
    category: 'ابزار دستی',
    description: 'مجموعه آچار بکس کامل با درایو 1/2 اینچ، ساخته شده از فولاد کروم وانادیوم.'
  },
  {
    id: 4,
    name: 'متر لیزری 50 متری',
    sku: 'LSR-50M',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Laser+Meter',
    gallery: ['https://placehold.co/400x400/f59e0b/white?text=Laser+Meter'],
    stock: 15,
    prices: { retail: 950000, wholesale: 880000 },
    category: 'ابزار اندازه‌گیری',
    description: 'متر لیزری دقیق با برد 50 متر و قابلیت محاسبه مساحت و حجم.'
  },
  {
    id: 5,
    name: 'انبر قفلی ایران پتک',
    sku: 'IP-10',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Pliers',
    gallery: ['https://placehold.co/400x400/f59e0b/white?text=Pliers'],
    stock: 120,
    prices: { retail: 350000, wholesale: 310000 },
    category: 'ابزار دستی',
    description: 'انبر قفلی سایز 10 اینچ با کیفیت ساخت بالا و فک‌های مقاوم.'
  },
  {
    id: 6,
    name: 'پیچ گوشتی شارژی شیائومی',
    sku: 'XI-SCD-24',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Screwdriver',
    gallery: ['https://placehold.co/400x400/f59e0b/white?text=Screwdriver'],
    stock: 60,
    prices: { retail: 1500000, wholesale: 1350000 },
    category: 'ابزار شارژی',
    description: 'ست پیچ گوشتی شارژی با 24 سری مختلف و طراحی ارگونومیک.'
  },
];

export const mockUser: User = {
  id: 1,
  mobile: '09123456789',
  name: 'علی محمدی',
};

export const mockOrders: Order[] = [
    {
        id: 'ABC-123',
        date: '1403/04/10',
        items: [
            { productName: 'دریل شارژی چکشی رونیکس', quantity: 1, price: 2200000 },
            { productName: 'انبر قفلی ایران پتک', quantity: 2, price: 310000 },
        ],
        total: 2820000,
        status: 'تحویل شده',
    },
    {
        id: 'DEF-456',
        date: '1403/05/02',
        items: [
            { productName: 'مینی فرز توسن', quantity: 1, price: 1650000 },
        ],
        total: 1650000,
        status: 'ارسال شده',
    }
];

export const mockCategories: Category[] = [
    { id: 1, name: 'ابزار برقی', slug: 'electric-tools', parentId: null },
    { id: 2, name: 'ابزار شارژی', slug: 'cordless-tools', parentId: null },
    { id: 3, name: 'ابزار دستی', slug: 'hand-tools', parentId: null },
    { id: 4, name: 'دریل', slug: 'drills', parentId: 1 },
    { id: 5, name: 'فرز', slug: 'grinders', parentId: 1 },
    { id: 6, name: 'انبر', slug: 'pliers', parentId: 3 },
];

export const mockMenus: Menu[] = [
    { id: 1, name: 'منوی اصلی', location: 'header' },
];

export const mockMenuItems: MenuItem[] = [
    { id: 1, menuId: 1, title: 'صفحه اصلی', type: 'page', value: 'home', parentId: null, order: 1 },
    { id: 2, menuId: 1, title: 'محصولات', type: 'page', value: 'products', parentId: null, order: 2 },
    { id: 3, menuId: 1, title: 'ابزار برقی', type: 'category', value: 'electric-tools', parentId: 2, order: 1 },
    { id: 4, menuId: 1, title: 'لیست قیمت', type: 'page', value: 'productList', parentId: null, order: 3 },
];

export const availablePages: PageLink[] = [
    { view: 'home', title: 'صفحه اصلی' },
    { view: 'products', title: 'فروشگاه' },
    { view: 'productList', title: 'لیست قیمت سریع' },
    { view: 'cart', title: 'سبد خرید' },
    { view: 'dashboard', title: 'پیشخوان' },
];

export const mockSettings: AppSettings = {
  general: {
    title: 'فروشگاه ابزار آنلاین',
    description: 'یک فروشگاه اینترنتی مدرن و سریع برای فروش ابزارآلات با امکانات پیشرفته.',
    icon: '', // Default will be the ToolIcon component, this can be a URL
    favicon: '', // URL to favicon
  },
  footer: {
    aboutUs: 'ما بهترین ابزارآلات صنعتی و خانگی را با ضمانت اصالت و قیمت مناسب، به سرعت در سراسر کشور به دست شما می‌رسانیم.',
    enamadLink: '#',
    samandehiLink: '#',
    copyrightText: '© 1403 - تمامی حقوق برای فروشگاه ابزار آنلاین محفوظ است.',
  },
  shippingMethods: [
    { id: 1, name: 'پست پیشتاز', cost: 35000 },
    { id: 2, name: 'تیپاکس', cost: 55000 },
    { id: 3, name: 'پیک موتوری (تهران)', cost: 40000 },
  ],
  paymentMethods: [
    { id: 1, name: 'پرداخت آنلاین', description: 'پرداخت امن از طریق درگاه بانکی' },
    { id: 2, name: 'کارت به کارت', description: 'انتقال وجه به شماره کارت اعلام شده' },
  ],
};
