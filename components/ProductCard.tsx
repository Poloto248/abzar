
import React from 'react';
import { useApp } from '../context/AppContext';
import type { Product } from '../types';
import { ShoppingCartIcon } from './icons/Icons';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { priceTier, addToCart, user, viewProduct } = useApp();
    const price = product.prices[user ? priceTier : 'retail'];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the button
        addToCart(product.id, 1);
    };

    return (
        <div 
            onClick={() => viewProduct(product.id)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-transparent hover:border-yellow-500 hover:shadow-xl transition-all group cursor-pointer flex flex-col"
        >
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover"/>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate flex-grow">{product.name}</h3>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        {price.toLocaleString('fa-IR')}
                        <span className="text-xs"> تومان</span>
                    </p>
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-yellow-500 hover:text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        aria-label="افزودن به سبد خرید"
                    >
                        <ShoppingCartIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;