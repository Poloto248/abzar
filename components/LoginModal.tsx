
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login } = useApp();
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send an OTP here.
    // We'll just log the user in directly.
    if (mobile.match(/^09\d{9}$/)) {
        login(mobile);
    } else {
        alert('لطفا شماره موبایل معتبر وارد کنید.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">ورود / ثبت نام</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">شماره موبایل خود را وارد کنید</p>
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            dir="ltr"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="09123456789"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-gray-50 dark:bg-gray-700 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 font-bold"
          >
            ادامه
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline">
          انصراف
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
