import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductListPage from './components/ProductListPage';
import ProductsPage from './components/ProductsPage';
import CartView from './components/CartView';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import ProductDetailPage from './components/ProductDetailPage';
import AdminPanel from './components/AdminPanel';
import AdminLoginPage from './components/admin/AdminLoginPage';

export type View = 'home' | 'products' | 'productList' | 'productDetail' | 'cart' | 'dashboard' | 'adminLogin' | 'admin';

const MainContent: React.FC = () => {
    const { view } = useApp();

    // Admin panel and login have their own full-page layouts
    if (view === 'admin' || view === 'adminLogin') {
        if (view === 'admin') return <AdminPanel />;
        return <AdminLoginPage />;
    }

    const renderView = () => {
        switch (view) {
            case 'home':
                return <HomePage />;
            case 'products':
                return <ProductsPage />;
            case 'productList':
                return <ProductListPage />;
            case 'productDetail':
                return <ProductDetailPage />;
            case 'cart':
                return <CartView />;
            case 'dashboard':
                return <Dashboard />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};


const App: React.FC = () => {
    const { showLogin, setShowLogin, settings } = useApp();

    useEffect(() => {
        document.title = settings.general.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', settings.general.description);
        }
        
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        if (settings.general.favicon) {
            link.href = settings.general.favicon;
        }
    }, [settings.general]);

    return (
        <>
            <MainContent />
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </>
    );
};

// This wrapper provides the context to the App and is the default export
const AppWrapper: React.FC = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

export default AppWrapper;
