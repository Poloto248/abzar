
import React from 'react';
import { useApp } from '../context/AppContext';
import { TrashIcon, PlusIcon, MinusIcon } from './icons/Icons';

const CartView: React.FC = () => {
  const { cart, getProductById, priceTier, getCartTotal, updateCartQuantity, removeFromCart, setView } = useApp();

  if (cart.length === 0) {
    return (
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h2>
        <button onClick={() => setView('productList')} className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
          بازگشت به لیست قیمت
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 border-b pb-4 dark:border-gray-700">سبد خرید ({cart.length} کالا)</h2>
        <div className="space-y-4">
          {cart.map(item => {
            const product = getProductById(item.productId);
            if (!product) return null;
            const price = product.prices[priceTier];
            return (
              <div key={item.productId} className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{price.toLocaleString('fa-IR')} تومان</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-md dark:border-gray-600">
                    <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="p-2 text-gray-600 dark:text-gray-300">
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                     <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="p-2 text-gray-600 dark:text-gray-300">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
          <h3 className="text-xl font-bold mb-4 border-b pb-4 dark:border-gray-700">خلاصه سفارش</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>جمع کل</span>
              <span>{getCartTotal().toLocaleString('fa-IR')} تومان</span>
            </div>
            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              <span>وابسته به آدرس</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t dark:border-gray-700 text-gray-800 dark:text-white">
              <span>مبلغ قابل پرداخت</span>
              <span>{getCartTotal().toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white mt-6 py-3 rounded-md hover:bg-green-700 font-bold">
            ادامه و ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
