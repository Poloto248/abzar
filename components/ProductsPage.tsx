import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons/Icons';

const ProductsPage: React.FC = () => {
    const { products, categoryFilter, setCategoryFilter } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('default');

    const categories = useMemo(() => {
        const allCategories = products.map(p => p.category);
        return ['all', ...Array.from(new Set(allCategories))];
    }, [products]);

    const displayedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  product.sku.toLowerCase().includes(searchTerm.toLowerCase());
            
            const minPrice = parseFloat(priceRange.min);
            const maxPrice = parseFloat(priceRange.max);
            const productPrice = product.prices.retail; // Or wholesale based on tier

            const matchesPrice = (isNaN(minPrice) || productPrice >= minPrice) &&
                                 (isNaN(maxPrice) || productPrice <= maxPrice);

            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Sorting logic
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.prices.retail - b.prices.retail);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.prices.retail - a.prices.retail);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
                break;
            default:
                break;
        }

        return filtered;
    }, [products, searchTerm, categoryFilter, priceRange, sortBy]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
             {/* Sidebar for Filters - Appears on the left in RTL */}
            <aside className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24 space-y-6">
                <h3 className="text-xl font-bold border-b pb-3 dark:border-gray-700">فیلترها</h3>
                
                {/* Search Input */}
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="جستجوی محصول..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <h4 className="font-semibold mb-3">دسته‌بندی‌ها</h4>
                    <ul className="space-y-2">
                        {categories.map(cat => (
                           <li key={cat}>
                                <button 
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`w-full text-right px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        categoryFilter === cat 
                                        ? 'bg-yellow-500 text-white font-bold'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {cat === 'all' ? 'همه دسته‌ها' : cat}
                                </button>
                           </li>
                        ))}
                    </ul>
                </div>
                
                {/* Price Filter */}
                <div>
                    <h4 className="font-semibold mb-3 pt-4 border-t dark:border-gray-700">محدوده قیمت (تومان)</h4>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number"
                            placeholder="از"
                            value={priceRange.min}
                            onChange={e => setPriceRange(prev => ({...prev, min: e.target.value}))}
                            className="w-full text-center p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        />
                        <span>-</span>
                        <input 
                            type="number"
                            placeholder="تا"
                             value={priceRange.max}
                            onChange={e => setPriceRange(prev => ({...prev, max: e.target.value}))}
                            className="w-full text-center p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        />
                    </div>
                </div>
            </aside>
            
            {/* Main Content for Products - Appears on the right in RTL */}
            <main className="lg:col-span-3">
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        نمایش {displayedProducts.length} محصول
                    </p>
                    <div className="flex items-center gap-2">
                         <label htmlFor="sort" className="text-sm font-medium">مرتب‌سازی:</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                        >
                            <option value="default">پیش‌فرض</option>
                            <option value="price-asc">ارزان‌ترین</option>
                            <option value="price-desc">گران‌ترین</option>
                            <option value="name-asc">بر اساس نام</option>
                        </select>
                    </div>
                </div>

                {displayedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center py-24">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ محصولی با این مشخصات یافت نشد.</p>
                    </div>
                )}
            </main>

        </div>
    );
};

export default ProductsPage;
