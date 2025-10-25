import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadIcon, TrashIcon, PencilIcon } from '../icons/Icons';
import type { GeneralSettings, FooterSettings, ShippingMethod, PaymentMethod } from '../../types';

type SettingsTab = 'general' | 'footer' | 'shipping' | 'payment';

const AdminSettings: React.FC = () => {
    const { settings, updateGeneralSettings, updateFooterSettings, addShippingMethod, updateShippingMethod, deleteShippingMethod, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useApp();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    // General Settings
    const [generalData, setGeneralData] = useState<GeneralSettings>(settings.general);
    
    const handleGeneralChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGeneralData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGeneralData(prev => ({ ...prev, [name]: reader.result as string }));
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleGeneralSave = (e: FormEvent) => {
        e.preventDefault();
        updateGeneralSettings(generalData);
        alert('تنظیمات عمومی ذخیره شد.');
    };
    
    // Footer Settings
    const [footerData, setFooterData] = useState<FooterSettings>(settings.footer);

    const handleFooterChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFooterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleFooterSave = (e: FormEvent) => {
        e.preventDefault();
        updateFooterSettings(footerData);
        alert('تنظیمات فوتر ذخیره شد.');
    };

    // Shipping Method State
    const [shippingForm, setShippingForm] = useState<Omit<ShippingMethod, 'id'>>({ name: '', cost: 0 });
    const [editingShipping, setEditingShipping] = useState<ShippingMethod | null>(null);

    const handleShippingSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingShipping) {
            updateShippingMethod({ ...editingShipping, ...shippingForm });
            setEditingShipping(null);
        } else {
            addShippingMethod(shippingForm);
        }
        setShippingForm({ name: '', cost: 0 });
    };

    const editShipping = (method: ShippingMethod) => {
        setEditingShipping(method);
        setShippingForm({ name: method.name, cost: method.cost });
    };
    
    // Payment Method State
    const [paymentForm, setPaymentForm] = useState<Omit<PaymentMethod, 'id'>>({ name: '', description: '' });
    const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);

    const handlePaymentSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingPayment) {
            updatePaymentMethod({ ...editingPayment, ...paymentForm });
            setEditingPayment(null);
        } else {
            addPaymentMethod(paymentForm);
        }
        setPaymentForm({ name: '', description: '' });
    };
    
    const editPayment = (method: PaymentMethod) => {
        setEditingPayment(method);
        setPaymentForm({ name: method.name, description: method.description });
    };

    const TabButton: React.FC<{ tab: SettingsTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab 
                ? 'bg-white dark:bg-gray-800 border-b-0 border-t border-r border-l border-gray-200 dark:border-gray-700 text-yellow-600'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <form onSubmit={handleGeneralSave} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="form-label">عنوان سایت</label>
                            <input type="text" id="title" name="title" value={generalData.title} onChange={handleGeneralChange} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="description" className="form-label">توضیحات متا (Meta Description)</label>
                            <textarea id="description" name="description" value={generalData.description} onChange={handleGeneralChange} rows={3} className="form-input" />
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <label className="form-label">آیکن سایت</label>
                                <div className="flex items-center gap-4">
                                    <img src={generalData.icon || 'https://placehold.co/64x64/f59e0b/white?text=Icon'} alt="Site Icon" className="w-16 h-16 rounded-md object-cover bg-gray-200" />
                                    <input type="file" name="icon" accept="image/*" onChange={handleFileChange} className="text-sm" />
                                </div>
                            </div>
                             <div>
                                <label className="form-label">فاوآیکن (Favicon)</label>
                                <div className="flex items-center gap-4">
                                    <img src={generalData.favicon || 'https://placehold.co/32x32/f59e0b/white?text=Fav'} alt="Favicon" className="w-8 h-8 rounded-md object-cover bg-gray-200" />
                                    <input type="file" name="favicon" accept="image/x-icon,image/png,image/svg+xml" onChange={handleFileChange} className="text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="text-left"><button type="submit" className="form-submit-btn">ذخیره تنظیمات عمومی</button></div>
                    </form>
                );
            case 'footer':
                return (
                     <form onSubmit={handleFooterSave} className="space-y-4">
                        <div>
                            <label htmlFor="aboutUs" className="form-label">متن درباره ما (فوتر)</label>
                            <textarea id="aboutUs" name="aboutUs" value={footerData.aboutUs} onChange={handleFooterChange} rows={4} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="enamadLink" className="form-label">لینک نماد اعتماد (اینماد)</label>
                            <input type="text" id="enamadLink" name="enamadLink" value={footerData.enamadLink} onChange={handleFooterChange} className="form-input" dir="ltr" placeholder="https://..." />
                        </div>
                         <div>
                            <label htmlFor="samandehiLink" className="form-label">لینک نماد ساماندهی</label>
                            <input type="text" id="samandehiLink" name="samandehiLink" value={footerData.samandehiLink} onChange={handleFooterChange} className="form-input" dir="ltr" placeholder="https://..." />
                        </div>
                         <div>
                            <label htmlFor="copyrightText" className="form-label">متن کپی رایت</label>
                            <input type="text" id="copyrightText" name="copyrightText" value={footerData.copyrightText} onChange={handleFooterChange} className="form-input" />
                        </div>
                        <div className="text-left"><button type="submit" className="form-submit-btn">ذخیره تنظیمات فوتر</button></div>
                    </form>
                );
            case 'shipping':
                 return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold mb-4">{editingShipping ? 'ویرایش روش ارسال' : 'افزودن روش ارسال'}</h4>
                            <form onSubmit={handleShippingSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="shippingName" className="form-label">نام روش</label>
                                    <input type="text" id="shippingName" value={shippingForm.name} onChange={e => setShippingForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
                                </div>
                                <div>
                                    <label htmlFor="shippingCost" className="form-label">هزینه (تومان)</label>
                                    <input type="number" id="shippingCost" value={shippingForm.cost} onChange={e => setShippingForm(p => ({ ...p, cost: Number(e.target.value) }))} className="form-input" required />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="form-submit-btn">{editingShipping ? 'بروزرسانی' : 'افزودن'}</button>
                                    {editingShipping && <button type="button" onClick={() => { setEditingShipping(null); setShippingForm({ name: '', cost: 0 }); }} className="form-cancel-btn">لغو</button>}
                                </div>
                            </form>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">روش‌های موجود</h4>
                            <ul className="space-y-2">
                                {settings.shippingMethods.map(method => (
                                    <li key={method.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                        <div>
                                            <span className="font-medium">{method.name}</span>
                                            <span className="text-sm text-gray-500 mr-2">({method.cost.toLocaleString('fa-IR')} تومان)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => editShipping(method)} className="text-blue-500"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => deleteShippingMethod(method.id)} className="text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'payment':
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold mb-4">{editingPayment ? 'ویرایش روش پرداخت' : 'افزودن روش پرداخت'}</h4>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="paymentName" className="form-label">نام روش</label>
                                    <input type="text" id="paymentName" value={paymentForm.name} onChange={e => setPaymentForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
                                </div>
                                <div>
                                    <label htmlFor="paymentDesc" className="form-label">توضیحات</label>
                                    <input type="text" id="paymentDesc" value={paymentForm.description} onChange={e => setPaymentForm(p => ({ ...p, description: e.target.value }))} className="form-input" />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="form-submit-btn">{editingPayment ? 'بروزرسانی' : 'افزودن'}</button>
                                    {editingPayment && <button type="button" onClick={() => { setEditingPayment(null); setPaymentForm({ name: '', description: '' }); }} className="form-cancel-btn">لغو</button>}
                                </div>
                            </form>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">روش‌های موجود</h4>
                             <ul className="space-y-2">
                                {settings.paymentMethods.map(method => (
                                    <li key={method.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                        <div>
                                            <span className="font-medium">{method.name}</span>
                                            <span className="text-sm text-gray-500 mr-2">({method.description})</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => editPayment(method)} className="text-blue-500"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => deletePaymentMethod(method.id)} className="text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-[-1px]">
                <nav className="-mb-px flex space-x-2 space-x-reverse" aria-label="Tabs">
                    <TabButton tab="general" label="عمومی" />
                    <TabButton tab="footer" label="فوتر" />
                    <TabButton tab="shipping" label="روش‌های ارسال" />
                    <TabButton tab="payment" label="روش‌های پرداخت" />
                </nav>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-b-lg rounded-tr-lg shadow-md p-6">
                {renderContent()}
            </div>
             <style jsx>{`
                .form-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
                .form-input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: #f9fafb; }
                .dark .form-input { background-color: #374151; border-color: #4b5563; color: #f3f4f6; }
                .form-input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5); }
                .form-submit-btn { background-color: #16a34a; color: white; padding: 0.5rem 1.5rem; border-radius: 0.375rem; font-weight: 700; }
                .form-submit-btn:hover { background-color: #15803d; }
                .form-cancel-btn { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; }
                .dark .form-cancel-btn { background-color: #4b5563; color: #e5e7eb; }
            `}</style>
        </div>
    );
};

export default AdminSettings;
