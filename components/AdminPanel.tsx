import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardIcon, BoxIcon, ClipboardListIcon, UsersIcon, ToolIcon, UserIcon, TagIcon, ListBulletIcon, CogIcon, MenuIcon, XIcon } from './icons/Icons';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminProductForm from './admin/AdminProductForm';
import AdminCategories from './admin/AdminCategories';
import AdminMenus from './admin/AdminMenus';
import AdminSettings from './admin/AdminSettings';

type AdminView = 'adminDashboard' | 'products' | 'productForm' | 'orders' | 'users' | 'categories' | 'menus' | 'settings';

const AdminPanel: React.FC = () => {
    const { isAdmin, setView, logout, user } = useApp();
    const [adminView, setAdminView] = useState<AdminView>('adminDashboard');
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">دسترسی غیرمجاز</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">شما مجوز لازم برای دسترسی به این صفحه را ندارید.</p>
                     <div className="flex justify-center gap-4">
                        <button onClick={() => setView('home')} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">
                            بازگشت به فروشگاه
                        </button>
                        <button onClick={() => setView('adminLogin')} className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
                            ورود به عنوان مدیر
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const handleGoToProductForm = (productId: number | null) => {
        setEditingProductId(productId);
        setAdminView('productForm');
    };
    
    const handleBackToProducts = () => {
        setEditingProductId(null);
        setAdminView('products');
    };
    
    const renderAdminView = () => {
        switch (adminView) {
            case 'adminDashboard':
                return <AdminDashboard />;
            case 'products':
                return <AdminProducts onAddProduct={() => handleGoToProductForm(null)} onEditProduct={(id) => handleGoToProductForm(id)} />;
            case 'productForm':
                return <AdminProductForm productId={editingProductId} onCancel={handleBackToProducts} onSave={handleBackToProducts} />;
            case 'orders':
                return <AdminOrders />;
            case 'categories':
                return <AdminCategories />;
            case 'menus':
                return <AdminMenus />;
            case 'settings':
                return <AdminSettings />;
            case 'users':
                 return <div className="text-center p-8"><p>بخش مدیریت کاربران در حال ساخت است.</p></div>;
            default:
                return <AdminDashboard />;
        }
    }
    
    const getHeaderText = () => {
        switch(adminView) {
            case 'adminDashboard': return 'داشبورد';
            case 'products': return 'محصولات';
            case 'productForm': return editingProductId ? 'ویرایش محصول' : 'افزودن محصول جدید';
            case 'orders': return 'سفارشات';
            case 'categories': return 'دسته‌بندی‌ها';
            case 'menus': return 'مدیریت منو‌ها';
            case 'settings': return 'تنظیمات';
            case 'users': return 'کاربران';
            default: return 'پنل مدیریت';
        }
    }

    const NavLink: React.FC<{ view: AdminView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => {
                setAdminView(view);
                setIsSidebarOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 text-right rounded-lg transition-colors ${
                adminView === view
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="mr-3">{label}</span>
        </button>
    );

    const sidebarContent = (
        <>
            <nav className="flex-grow p-4 space-y-2">
                <NavLink view="adminDashboard" icon={<DashboardIcon className="w-6 h-6" />} label="داشبورد" />
                <NavLink view="products" icon={<BoxIcon className="w-6 h-6" />} label="محصولات" />
                <NavLink view="categories" icon={<TagIcon className="w-6 h-6" />} label="دسته‌بندی‌ها" />
                <NavLink view="orders" icon={<ClipboardListIcon className="w-6 h-6" />} label="سفارشات" />
                <NavLink view="menus" icon={<ListBulletIcon className="w-6 h-6" />} label="نمایش" />
                <NavLink view="users" icon={<UsersIcon className="w-6 h-6" />} label="کاربران" />
                <NavLink view="settings" icon={<CogIcon className="w-6 h-6" />} label="تنظیمات" />
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
                 <button onClick={() => setView('home')} className="w-full text-center text-sm py-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500">
                    بازگشت به فروشگاه
                 </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
             {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl flex-shrink-0 flex flex-col z-50 transform transition-transform duration-300 ease-in-out 
                   md:relative md:translate-x-0 md:shadow-md
                   ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
            >
                <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 md:justify-center">
                    <div className="flex items-center gap-2">
                        <ToolIcon className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">پنل مدیریت</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 md:hidden"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                         <h2 className="text-xl font-semibold">{getHeaderText()}</h2>
                    </div>
                     <div className="relative group">
                       <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <UserIcon className="w-6 h-6" />
                        <span>{user?.name}</span>
                      </button>
                      <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-20">
                          <button onClick={logout} className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">خروج</button>
                      </div>
                    </div>
                </header>
                <main className="flex-grow p-6 overflow-auto">
                    {renderAdminView()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;