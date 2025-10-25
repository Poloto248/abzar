import React from 'react';
import { useApp } from '../../context/AppContext';
// FIX: Replaced UsersIcon with TruckIcon for better semantics.
import { BoxIcon, ClipboardListIcon, UsersIcon, ChartBarIcon, TrophyIcon, CurrencyDollarIcon, UserIcon, TruckIcon } from '../icons/Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center transition-all hover:shadow-xl hover:scale-105">
        <div className="bg-yellow-100 dark:bg-yellow-500/20 p-4 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const SalesChart: React.FC = () => {
    // Mock data for the last 7 days
    const chartData = [
        { day: 'شنبه', sales: 1500000 },
        { day: '۱ش', sales: 2200000 },
        { day: '۲ش', sales: 1800000 },
        { day: '۳ش', sales: 2800000 },
        { day: '۴ش', sales: 2500000 },
        { day: '۵ش', sales: 3100000 },
        { day: 'جمعه', sales: 1200000 },
    ];

    const maxSale = Math.max(...chartData.map(d => d.sales));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">نمودار فروش ۷ روز اخیر</h3>
            <div className="flex justify-around items-end h-64 border-b-2 border-r-2 border-gray-200 dark:border-gray-700 p-4">
                {chartData.map(data => (
                    <div key={data.day} className="flex flex-col items-center w-1/7">
                        <div 
                            className="w-8 md:w-10 bg-yellow-400 dark:bg-yellow-500 rounded-t-md hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all"
                            style={{ height: `${(data.sales / maxSale) * 95}%` }}
                            title={`${data.sales.toLocaleString('fa-IR')} تومان`}
                        ></div>
                        <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">{data.day}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const AdminDashboard: React.FC = () => {
    const { products, orders } = useApp();
    
    // Mock calculations for new stats
    const todaySales = orders.length > 0 ? orders[0].total : 0;
    const todayOrdersCount = orders.length > 0 ? 1 : 0;
    const pendingOrders = orders.filter(o => o.status === 'در حال پردازش').length;
    
    // Mock calculation for top selling products
    const productSales: { [key: string]: number } = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            productSales[item.productName] = (productSales[item.productName] || 0) + item.quantity;
        });
    });
    const topProducts = Object.entries(productSales)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3);
    
    // Mock top customer
    const topCustomer = { name: 'علی محمدی', total: 2820000 };


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="فروش امروز" value={`${todaySales.toLocaleString('fa-IR')} ت`} icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500" />} />
                <StatCard title="فروش امروز (تعداد)" value={todayOrdersCount} icon={<ClipboardListIcon className="w-8 h-8 text-blue-500" />} />
                <StatCard title="در انتظار تایید" value={pendingOrders} icon={<TruckIcon className="w-8 h-8 text-red-500" />} />
                <StatCard title="کل محصولات" value={products.length} icon={<BoxIcon className="w-8 h-8 text-yellow-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SalesChart />
                
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrophyIcon className="w-6 h-6 text-amber-400" /> برترین مشتری ماه</h3>
                        <div className="flex items-center space-x-4 space-x-reverse">
                           <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                               <UserIcon className="w-8 h-8 text-gray-500"/>
                           </div>
                           <div>
                               <p className="font-bold">{topCustomer.name}</p>
                               <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{topCustomer.total.toLocaleString('fa-IR')} تومان</p>
                           </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><ChartBarIcon className="w-6 h-6 text-indigo-500"/> پرفروش ترین محصولات</h3>
                        <ul className="space-y-4">
                            {topProducts.map(([name, count], index) => (
                               <li key={name} className="flex justify-between items-center text-sm">
                                   <span className="font-medium text-gray-700 dark:text-gray-300">{index + 1}. {name}</span>
                                   <span className="font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{count} عدد</span>
                               </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;