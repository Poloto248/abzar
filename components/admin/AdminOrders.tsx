import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Order } from '../../types';

const AdminOrders: React.FC = () => {
    const { orders, updateOrderStatus } = useApp();
    
    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        updateOrderStatus(orderId, newStatus);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">مدیریت سفارشات</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-3">شماره سفارش</th>
                            <th className="p-3">تاریخ</th>
                            <th className="p-3">مبلغ کل</th>
                            <th className="p-3 text-center">وضعیت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b dark:border-gray-700">
                                <td className="p-3 font-mono">{order.id}</td>
                                <td className="p-3">{order.date}</td>
                                <td className="p-3">{order.total.toLocaleString('fa-IR')} تومان</td>
                                <td className="p-3 text-center">
                                     <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                     >
                                        <option value="در حال پردازش">در حال پردازش</option>
                                        <option value="ارسال شده">ارسال شده</option>
                                        <option value="تحویل شده">تحویل شده</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;