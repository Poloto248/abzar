import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { View } from '../App';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon, ToolIcon, ChevronDownIcon } from './icons/Icons';
import type { MenuItem as MenuItemType } from '../types';

// Recursive component to render menu items and their children
const MenuItem: React.FC<{ item: MenuItemType, children: MenuItemType[] }> = ({ item, children }) => {
    const { setView } = useApp();

    const handleClick = () => {
        if (item.type === 'page') {
            setView(item.value as View);
        } else if (item.type === 'category') {
            // Handle category view navigation if implemented
            console.log('Navigate to category:', item.value);
            // setView('products'); setCategoryFilter(item.value);
        } else if (item.type === 'custom') {
            window.location.href = item.value;
        }
    };

    if (children.length > 0) {
        return (
            <div className="relative group">
                <button
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"
                >
                    <span>{item.title}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                    {children.map(child => <MenuItem key={child.id} item={child} children={[]} />)}
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {item.title}
        </button>
    );
};


const Header: React.FC = () => {
    const {
        setView,
        user,
        cart,
        priceTier,
        setPriceTier,
        setShowLogin,
        logout,
        isAdmin,
        menus,
        menuItems,
        settings,
    } = useApp();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const headerMenu = useMemo(() => {
        const menu = menus.find(m => m.location === 'header');
        if (!menu) return [];
        const items = menuItems.filter(item => item.menuId === menu.id).sort((a,b) => a.order - b.order);
        
        const buildHierarchy = (parentId: number | null): (MenuItemType & { children: MenuItemType[] })[] => {
            return items
                .filter(item => item.parentId === parentId)
                .map(item => ({
                    ...item,
                    children: buildHierarchy(item.id)
                }));
        };
        return buildHierarchy(null);
    }, [menus, menuItems]);
    
    const NavLink: React.FC<{ targetView: View; children: React.ReactNode }> = ({ targetView, children }) => (
        <button
            onClick={() => {
                setView(targetView);
                setIsMenuOpen(false);
            }}
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {children}
        </button>
    );

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and Main Nav */}
                    <div className="flex items-center gap-8">
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setView('home')}
                        >
                            {settings.general.icon ? 
                                <img src={settings.general.icon} alt="Site Icon" className="w-8 h-8"/> : 
                                <ToolIcon className="w-8 h-8 text-yellow-500" />
                            }
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                {settings.general.title}
                            </h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-2">
                           {headerMenu.map(item => (
                               <MenuItem key={item.id} item={item} children={item.children}/>
                           ))}
                           {isAdmin && <NavLink targetView="admin">پنل مدیریت</NavLink>}
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {user && (
                            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setPriceTier('retail')}
                                    className={`px-3 py-1 text-sm rounded-md ${priceTier === 'retail' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                                >
                                    تکی
                                </button>
                                <button
                                    onClick={() => setPriceTier('wholesale')}
                                    className={`px-3 py-1 text-sm rounded-md ${priceTier === 'wholesale' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                                >
                                    همکار
                                </button>
                            </div>
                        )}
                        
                        <button
                            onClick={() => setView('cart')}
                            className="relative text-gray-600 dark:text-gray-300 hover:text-yellow-500 p-2"
                        >
                            <ShoppingCartIcon className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        
                        <div className="hidden md:block">
                            {user ? (
                                <div className="relative group">
                                     <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 p-2 rounded-md">
                                        <UserIcon className="w-6 h-6" />
                                        <span>{user.name}</span>
                                    </button>
                                    <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                                        <button onClick={() => setView('dashboard')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">پیشخوان</button>
                                        <button onClick={logout} className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">خروج</button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span>ورود / ثبت نام</span>
                                </button>
                            )}
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <nav className="flex flex-col gap-2">
                           {headerMenu.map(link => (
                               <button key={link.id} onClick={() => setView(link.value as View)} className="px-3 py-2 rounded-md text-right">{link.title}</button>
                           ))}
                           {user && <NavLink targetView="dashboard">پیشخوان</NavLink>}
                           {isAdmin && <NavLink targetView="admin">پنل مدیریت</NavLink>}
                        </nav>
                        <div className="border-t dark:border-gray-700 mt-4 pt-4">
                            {user ? (
                                <div>
                                    <p className="px-3 py-2 font-medium">{user.name}</p>
                                    <button onClick={logout} className="w-full text-right px-3 py-2 rounded-md text-red-600">خروج</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowLogin(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full bg-yellow-500 text-white py-2 rounded-md"
                                >
                                    ورود / ثبت نام
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
