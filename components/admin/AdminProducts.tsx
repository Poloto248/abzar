import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from '../icons/Icons';
import type { Product } from '../../types';

interface AdminProductsProps {
    onAddProduct: () => void;
    onEditProduct: (productId: number) => void;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ onAddProduct, onEditProduct }) => {
    const { products, deleteProduct } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = useMemo(() => {
        const allCategories = products.map(p => p.category);
        return ['all', ...Array.from(new Set(allCategories))];
    }, [products]);

    const filteredProducts = useMemo(() =>
        products.filter(p => {
            const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.sku.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        }), [products, searchTerm, selectedCategory]);

    const handleDeleteProduct = (productId: number) => {
        if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
            deleteProduct(productId);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">مدیریت محصولات</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-auto pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                        <option value="all">همه دسته‌ها</option>
                        {categories.slice(1).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="جستجوی محصول..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                     <button
                        onClick={onAddProduct}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">افزودن محصول</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-3">تصویر</th>
                            <th className="p-3">نام</th>
                            <th className="p-3">شناسه</th>
                            <th className="p-3 text-center">موجودی</th>
                            <th className="p-3 text-center">قیمت تکی</th>
                            <th className="p-3 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="border-b dark:border-gray-700">
                                <td className="p-2"><img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" /></td>
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3 text-gray-500">{product.sku}</td>
                                <td className="p-3 text-center">{product.stock}</td>
                                <td className="p-3 text-center">{product.prices.retail.toLocaleString('fa-IR')}</td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => onEditProduct(product.id)} className="text-blue-500 hover:text-blue-700 p-1">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 p-1">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">هیچ محصولی با این مشخصات یافت نشد.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;