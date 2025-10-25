
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PlusIcon, MinusIcon, SearchIcon, DownloadIcon } from './icons/Icons';

const ProductRow: React.FC<{ product: import('../types').Product }> = ({ product }) => {
    const { priceTier, addToCart, cart } = useApp();
    const [quantity, setQuantity] = useState(1);

    const price = product.prices[priceTier];
    const cartItem = cart.find(item => item.productId === product.id);

    return (
        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td className="p-2 md:p-4 text-center">
                <img src={product.image} alt={product.name} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md mx-auto"/>
            </td>
            <td className="p-2 md:p-4 font-medium text-gray-800 dark:text-gray-200">
                <p>{product.name}</p>
                <p className="text-xs text-gray-500">{product.sku}</p>
            </td>
            <td className="p-2 md:p-4 text-center">
                {product.stock > 0 ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">موجود</span>
                ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">ناموجود</span>
                )}
            </td>
            <td className="p-2 md:p-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                {price.toLocaleString('fa-IR')} <span className="text-xs">تومان</span>
            </td>
            <td className="p-2 md:p-4">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-12 text-center bg-transparent border-x-0 border-t-0 border-b border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-yellow-500" />
                    <button onClick={() => setQuantity(q => q + 1)} className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
            </td>
            <td className="p-2 md:p-4 text-center">
                <button
                    onClick={() => addToCart(product.id, quantity)}
                    disabled={product.stock === 0}
                    className="bg-yellow-500 text-white px-4 py-2 text-sm rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {cartItem ? 'افزودن مجدد' : 'افزودن'}
                </button>
            </td>
        </tr>
    );
};

const ProductListPage: React.FC = () => {
    const { products } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const priceListRef = useRef<HTMLTableElement>(null);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const exportAsImage = () => {
        if (!priceListRef.current) return;
        setIsExporting(true);
        const html2canvas = (window as any).html2canvas;

        html2canvas(priceListRef.current, {
            scale: 2,
            backgroundColor: '#111827', // dark bg
            onclone: (document: Document) => {
                const clonedTable = document.querySelector('table');
                if (clonedTable) {
                    clonedTable.style.direction = 'rtl';
                }
            }
        }).then((canvas: HTMLCanvasElement) => {
            const link = document.createElement('a');
            link.download = 'price-list.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            setIsExporting(false);
        }).catch(() => setIsExporting(false));
    };


    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">لیست قیمت سریع</h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
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
                        onClick={exportAsImage}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                        <DownloadIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">{isExporting ? 'در حال آماده سازی...' : 'خروجی عکس'}</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table ref={priceListRef} className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="p-2 md:p-4 text-center">تصویر</th>
                            <th scope="col" className="p-2 md:p-4 text-right">نام کالا</th>
                            <th scope="col" className="p-2 md:p-4 text-center">موجودی</th>
                            <th scope="col" className="p-2 md:p-4 text-center">قیمت</th>
                            <th scope="col" className="p-2 md:p-4 text-center">تعداد</th>
                            <th scope="col" className="p-2 md:p-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => <ProductRow key={product.id} product={product} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;
