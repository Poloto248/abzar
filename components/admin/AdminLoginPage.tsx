import React, { useState, FormEvent } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolIcon, UserIcon, LockClosedIcon } from '../icons/Icons';

const AdminLoginPage: React.FC = () => {
    const { adminLogin, setView } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = adminLogin(username, password);
        if (success) {
            setView('admin');
        } else {
            setError('نام کاربری یا رمز عبور اشتباه است.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div 
                className="flex items-center gap-2 cursor-pointer mb-8"
                onClick={() => setView('home')}
            >
                <ToolIcon className="w-10 h-10 text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    ابزار آنلاین
                </h1>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">ورود به پنل مدیریت</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">لطفا اطلاعات خود را وارد کنید</p>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">نام کاربری</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
                                placeholder="admin"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">رمز عبور</label>
                         <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
                                placeholder="admin"
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        ورود
                    </button>
                </form>
            </div>
             <button onClick={() => setView('home')} className="mt-8 text-sm text-gray-500 hover:underline">
               بازگشت به فروشگاه
            </button>
        </div>
    );
};

export default AdminLoginPage;
