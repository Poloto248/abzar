import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { MenuItem, Menu } from '../../types';
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from '../icons/Icons';

// Simple accordion component
const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border dark:border-gray-600 rounded-md">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-right p-3 bg-gray-100 dark:bg-gray-700 font-bold">
                {title}
            </button>
            {isOpen && <div className="p-3">{children}</div>}
        </div>
    );
};


const AdminMenus: React.FC = () => {
    const { menus, menuItems, categories, availablePages, updateMenuItems } = useApp();
    const [selectedMenuId, setSelectedMenuId] = useState<number>(menus[0]?.id || 0);
    const [currentMenuItems, setCurrentMenuItems] = useState<MenuItem[]>([]);
    
    // Custom Link state
    const [customLink, setCustomLink] = useState({ url: 'https://', text: '' });

    useEffect(() => {
        if (selectedMenuId) {
            const items = menuItems
                .filter(item => item.menuId === selectedMenuId)
                .sort((a, b) => a.order - b.order);
            setCurrentMenuItems(items);
        }
    }, [selectedMenuId, menuItems]);

    const handleSaveMenu = () => {
        const reorderedItems = currentMenuItems.map((item, index) => ({...item, order: index + 1 }));
        updateMenuItems(selectedMenuId, reorderedItems);
        alert('منو ذخیره شد!');
    };
    
    const addItemToMenu = (item: Omit<MenuItem, 'id' | 'menuId' | 'order'>) => {
        const newOrder = currentMenuItems.length > 0 ? Math.max(...currentMenuItems.map(i => i.order)) + 1 : 1;
        const newItem: MenuItem = {
            id: Date.now(),
            menuId: selectedMenuId,
            order: newOrder,
            ...item,
        };
        setCurrentMenuItems(prev => [...prev, newItem]);
    };
    
    const removeItemFromMenu = (itemId: number) => {
        setCurrentMenuItems(prev => prev.filter(item => item.id !== itemId && item.parentId !== itemId));
    };

    const handleItemAction = (itemId: number, action: 'up' | 'down' | 'indent' | 'outdent') => {
        let items = [...currentMenuItems];
        const itemIndex = items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;
        
        const item = items[itemIndex];

        if(action === 'up' && itemIndex > 0) {
            [items[itemIndex], items[itemIndex-1]] = [items[itemIndex-1], items[itemIndex]];
        }
        if(action === 'down' && itemIndex < items.length - 1) {
            [items[itemIndex], items[itemIndex+1]] = [items[itemIndex+1], items[itemIndex]];
        }
        if (action === 'indent' && itemIndex > 0) {
            item.parentId = items[itemIndex-1].id;
        }
        if (action === 'outdent') {
            item.parentId = null;
        }

        setCurrentMenuItems(items);
    };

    const menuHierarchy = useMemo(() => {
        const buildHierarchy = (parentId: number | null, depth = 0): (MenuItem & { depth: number })[] => {
            return currentMenuItems
                .filter(item => item.parentId === parentId)
                .map(item => [
                    { ...item, depth },
                    ...buildHierarchy(item.id, depth + 1)
                ]).flat();
        };
        return buildHierarchy(null);
    }, [currentMenuItems]);

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="menu-select" className="mr-2">انتخاب منو برای ویرایش:</label>
                <select 
                    id="menu-select"
                    value={selectedMenuId}
                    onChange={(e) => setSelectedMenuId(Number(e.target.value))}
                    className="form-input w-auto"
                >
                    {menus.map(menu => <option key={menu.id} value={menu.id}>{menu.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-4">
                    <Accordion title="صفحات">
                       {availablePages.map(page => (
                           <div key={page.view} className="flex justify-between items-center text-sm p-1">
                               <span>{page.title}</span>
                               <button onClick={() => addItemToMenu({ title: page.title, type: 'page', value: page.view, parentId: null })} className="text-blue-500 text-xs">افزودن به منو</button>
                           </div>
                       ))}
                    </Accordion>
                    <Accordion title="دسته‌بندی‌ها">
                        {categories.map(cat => (
                           <div key={cat.id} className="flex justify-between items-center text-sm p-1">
                               <span>{cat.name}</span>
                               <button onClick={() => addItemToMenu({ title: cat.name, type: 'category', value: cat.slug, parentId: null })} className="text-blue-500 text-xs">افزودن به منو</button>
                           </div>
                       ))}
                    </Accordion>
                    <Accordion title="پیوند دلخواه">
                       <div className="space-y-2">
                            <input type="url" value={customLink.url} onChange={e => setCustomLink(p => ({...p, url: e.target.value}))} className="form-input" placeholder="آدرس URL"/>
                            <input type="text" value={customLink.text} onChange={e => setCustomLink(p => ({...p, text: e.target.value}))} className="form-input" placeholder="متن پیوند"/>
                            <button onClick={() => addItemToMenu({ title: customLink.text, type: 'custom', value: customLink.url, parentId: null })} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">افزودن به منو</button>
                       </div>
                    </Accordion>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">ساختار منو</h3>
                    <div className="space-y-2">
                        {menuHierarchy.map(item => (
                            <div key={item.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border dark:border-gray-600 flex justify-between items-center" style={{ marginRight: `${item.depth * 20}px` }}>
                                <span className="font-medium">{item.title}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleItemAction(item.id, 'up')} title="بالا" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><ArrowUpIcon className="w-4 h-4" /></button>
                                    <button onClick={() => handleItemAction(item.id, 'down')} title="پایین" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><ArrowDownIcon className="w-4 h-4" /></button>
                                    <button onClick={() => handleItemAction(item.id, 'indent')} title="جلو بردن" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><ArrowLeftIcon className="w-4 h-4" /></button>
                                    <button onClick={() => handleItemAction(item.id, 'outdent')} title="عقب بردن" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"><ArrowRightIcon className="w-4 h-4" /></button>
                                    <button onClick={() => removeItemFromMenu(item.id)} className="text-red-500 p-1"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                         {menuHierarchy.length === 0 && <p className="text-gray-500">آیتم‌ها را از ستون کناری به منو اضافه کنید.</p>}
                    </div>
                    <div className="mt-6 pt-4 border-t dark:border-gray-700 text-left">
                        <button onClick={handleSaveMenu} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-bold">ذخیره منو</button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .form-input {
                    width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: #f9fafb;
                }
                .dark .form-input {
                    background-color: #374151; border-color: #4b5563; color: #f3f4f6;
                }
            `}</style>
        </div>
    );
};

export default AdminMenus;
