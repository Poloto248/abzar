import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusIcon, MinusIcon, ShoppingCartIcon, ChevronRightIcon } from './icons/Icons';

const ProductDetailPage: React.FC = () => {
    const { selectedProductId, getProductById, priceTier, addToCart, setView, user } = useApp();
    const [quantity, setQuantity] = useState(1);

    if (!selectedProductId) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <p className="mb-4">محصولی برای نمایش انتخاب نشده است.</p>
                <button onClick={() => setView('productList')} className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
                    بازگشت به لیست محصولات
                </button>
            </div>
        );
    }
    
    const product = getProductById(selectedProductId);

    if (!product) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <p className="mb-4">محصول مورد نظر یافت نشد.</p>
                <button onClick={() => setView('productList')} className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
                    بازگشت به لیست محصولات
                </button>
            </div>
        );
    }
    
    const price = product.prices[user ? priceTier : 'retail'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-6">
                <button onClick={() => setView('productList')} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-600">
                    <ChevronRightIcon className="w-5 h-5" />
                    <span>بازگشت به لیست قیمت</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Product Image */}
                <div>
                    <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md aspect-square" />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <span className="text-sm text-yellow-600 font-semibold">{product.category}</span>
                    <h1 className="text-3xl md:text-4xl font-bold my-2 text-gray-800 dark:text-white">{product.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">شناسه کالا: {product.sku}</p>
                    
                    <div
                        className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-lg font-medium">وضعیت:</span>
                        {product.stock > 0 ? (
                            <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">موجود در انبار</span>
                        ) : (
                            <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full">ناموجود</span>
                        )}
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg text-gray-600 dark:text-gray-300">قیمت:</span>
                            <p className="text-3xl font-bold text-yellow-600">
                                {price.toLocaleString('fa-IR')}
                                <span className="text-base font-medium"> تومان</span>
                            </p>
                        </div>
                         <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-2 border rounded-md dark:border-gray-600 p-2">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1.5 text-gray-600 dark:text-gray-300">
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                                <input type="number" value={quantity} readOnly className="w-12 text-center bg-transparent font-bold text-lg focus:ring-0 border-0" />
                                <button onClick={() => setQuantity(q => q + 1)} className="p-1.5 text-gray-600 dark:text-gray-300">
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={() => addToCart(product.id, quantity)}
                                disabled={product.stock === 0}
                                className="w-full flex-1 bg-yellow-500 text-white px-6 py-3 text-base rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-bold"
                            >
                                <ShoppingCartIcon className="w-6 h-6" />
                                افزودن به سبد خرید
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;