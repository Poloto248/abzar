import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardListIcon, CreditCardIcon, TruckIcon } from './icons/Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg shadow-sm flex items-center transition-all hover:shadow-md hover:-translate-y-1">
        <div className="text-yellow-500 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const { user, orders } = useApp();

    if (!user) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold">برای مشاهده پیشخوان، لطفا ابتدا وارد شوید.</h2>
            </div>
        );
    }
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrdersCount = orders.filter(o => o.status === 'در حال پردازش' || o.status === 'ارسال شده').length;

    return (
        <div className="space-y-8">
             <div>
                <h2 className="text-3xl font-bold mb-2">سلام، {user.name}!</h2>
                <p className="text-gray-600 dark:text-gray-400">به پیشخوان خود خوش آمدید. در اینجا می‌توانید فعالیت‌های اخیر خود را بررسی کنید.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard 
                    title="مجموع سفارشات" 
                    value={orders.length} 
                    icon={<ClipboardListIcon className="w-8 h-8"/>} 
                />
                 <StatCard 
                    title="مجموع خرید" 
                    value={`${totalSpent.toLocaleString('fa-IR')} تومان`}
                    icon={<CreditCardIcon className="w-8 h-8"/>} 
                />
                 <StatCard 
                    title="سفارشات در حال پردازش" 
                    value={pendingOrdersCount} 
                    icon={<TruckIcon className="w-8 h-8"/>} 
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">آخرین سفارشات</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="p-3">شماره سفارش</th>
                                <th className="p-3">تاریخ</th>
                                <th className="p-3">مبلغ کل</th>
                                <th className="p-3">وضعیت</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 font-mono text-gray-600 dark:text-gray-400">{order.id}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3 font-semibold">{order.total.toLocaleString('fa-IR')} تومان</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                            order.status === 'تحویل شده' ? 'bg-green-100 text-green-800' : 
                                            order.status === 'ارسال شده' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button className="text-yellow-600 hover:underline text-xs font-medium">مشاهده جزئیات</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {orders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">شما هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;