import React from 'react';
import { useApp } from '../context/AppContext';
import { ToolIcon } from './icons/Icons';

const Footer: React.FC = () => {
    const { setView, settings } = useApp();
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-right">
            {/* About Us Section */}
            <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2 mb-4">
                    {settings.general.icon ? 
                        <img src={settings.general.icon} alt="Site Icon" className="w-8 h-8"/> : 
                        <ToolIcon className="w-8 h-8 text-yellow-500" />
                    }
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{settings.general.title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {settings.footer.aboutUs}
                </p>
            </div>

            {/* Quick Links Section */}
            <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-4">دسترسی سریع</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li><button onClick={() => setView('home')} className="hover:text-yellow-500">صفحه اصلی</button></li>
                    <li><button onClick={() => setView('productList')} className="hover:text-yellow-500">لیست قیمت</button></li>
                    <li><button onClick={() => setView('cart')} className="hover:text-yellow-500">سبد خرید</button></li>
                    <li><button onClick={() => setView('adminLogin')} className="hover:text-yellow-500">ورود مدیر</button></li>
                    <li><button disabled className="cursor-not-allowed text-gray-400">قوانین و مقررات</button></li>
                </ul>
            </div>
            
            {/* Contact Info Section */}
             <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-4">تماس با ما</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li>آدرس: تهران، خیابان امام خمینی</li>
                    <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
                    <li>ایمیل: info@abzaronline.com</li>
                </ul>
            </div>

            {/* Trust Seals Section */}
            <div className="flex flex-col items-center sm:items-start">
                 <h4 className="font-bold text-gray-800 dark:text-white mb-4">نمادهای اعتماد</h4>
                 <div className="flex gap-4">
                     {settings.footer.enamadLink && (
                         <a href={settings.footer.enamadLink} target="_blank" rel="noopener noreferrer" className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                            اینماد
                         </a>
                     )}
                      {settings.footer.samandehiLink && (
                         <a href={settings.footer.samandehiLink} target="_blank" rel="noopener noreferrer" className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                            ساماندهی
                         </a>
                     )}
                 </div>
            </div>

        </div>
      </div>
       <div className="bg-gray-100 dark:bg-gray-900 py-4">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>{settings.footer.copyrightText}</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
