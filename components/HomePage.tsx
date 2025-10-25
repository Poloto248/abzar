import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { ChevronLeftIcon, ChevronRightIcon, TruckIcon, ShieldCheckIcon, HeadsetIcon, CreditCardIcon, ToolIcon } from './icons/Icons';
import type { Product } from '../types';
import type { View } from '../App';


interface Slide {
    title: string;
    description: string;
    buttonText: string;
    view: View;
    bgClass: string;
}

const HomePage: React.FC = () => {
    const { products, setView, recentlyViewed, getProductById, setCategoryFilter } = useApp();

    const slides: Slide[] = [
      {
        title: 'مرکز پخش ابزارآلات صنعتی',
        description: 'تامین کننده انواع ابزار برقی، شارژی، دستی و اندازه گیری با بهترین قیمت',
        buttonText: 'مشاهده همه محصولات',
        view: 'products',
        bgClass: 'bg-gradient-to-l from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700'
      },
      {
        title: 'تخفیف ویژه ابزار دستی',
        description: 'بهترین انبرها، آچارها و پیچ‌گوشتی‌ها با ۱۰٪ تخفیف تا پایان هفته.',
        buttonText: 'خرید با تخفیف',
        view: 'products',
        bgClass: 'bg-gradient-to-l from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700'
      },
      {
        title: 'جدیدترین دریل‌های شارژی رسید',
        description: 'قدرتمند، با دوام و با باتری‌های لیتیوم-یون نسل جدید.',
        buttonText: 'مشاهده دریل‌ها',
        view: 'products',
        bgClass: 'bg-gradient-to-l from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900'
      }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);


    const featuredProducts = products.slice(0, 4);
    const newProducts = products.slice(4, 8);
    const recentlyViewedProducts = recentlyViewed.map(getProductById).filter((p): p is Product => p !== undefined);
    
    const categories = useMemo(() => {
        const allCategories = products.map(p => p.category);
        return [...new Set(allCategories)];
    }, [products]);

    const handleCategoryClick = (category: string) => {
        setCategoryFilter(category);
        setView('products');
    };

    const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all hover:shadow-xl hover:scale-105">
            <div className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-4 rounded-full mb-4">
                {icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
    
    const ProductSection: React.FC<{title: string, products: Product[]}> = ({title, products}) => {
        if (!products || products.length === 0) return null;
        
        return (
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
                    <button onClick={() => setView('products')} className="flex items-center gap-1 text-sm text-yellow-600 hover:underline">
                        <span>مشاهده همه</span>
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => (
                       product && <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Slider Section */}
            <section className="relative h-64 md:h-80 rounded-lg shadow-xl overflow-hidden group">
                <div 
                    className="w-full h-full flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className={`w-full h-full flex-shrink-0 flex items-center justify-center text-center text-white p-6 md:p-10 ${slide.bgClass}`}>
                           <div className="animate-fade-in-down">
                             <h1 className="text-2xl md:text-4xl font-extrabold mb-3">{slide.title}</h1>
                             <p className="text-md md:text-lg mb-6 max-w-2xl mx-auto">{slide.description}</p>
                             <button
                                 onClick={() => setView(slide.view)}
                                 className="bg-white text-gray-800 font-bold px-6 py-2.5 rounded-md hover:bg-gray-100 transition-transform hover:scale-105"
                             >
                                 {slide.buttonText}
                             </button>
                           </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <ChevronRightIcon className="w-6 h-6"/>
                </button>
                <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 left-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <ChevronLeftIcon className="w-6 h-6"/>
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}></button>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Feature 
                    icon={<TruckIcon className="w-8 h-8"/>}
                    title="ارسال سریع"
                    description="ارسال فوری به تمام نقاط کشور"
                />
                <Feature 
                    icon={<ShieldCheckIcon className="w-8 h-8"/>}
                    title="ضمانت اصالت"
                    description="تمامی کالاها با ضمانت اصلی عرضه می‌شوند"
                />
                <Feature 
                    icon={<HeadsetIcon className="w-8 h-8"/>}
                    title="پشتیبانی تخصصی"
                    description="مشاوره فنی رایگان قبل و بعد از خرید"
                />
                <Feature 
                    icon={<CreditCardIcon className="w-8 h-8"/>}
                    title="پرداخت امن"
                    description="درگاه پرداخت امن و معتبر بانکی"
                />
            </section>

            {/* Categories Section */}
            <section>
                 <div className="flex justify-center items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">دسته‌بندی محصولات</h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-y-6 gap-x-4 justify-items-center">
                    {categories.slice(0, 9).map(category => (
                        <div key={category} className="flex flex-col items-center group">
                            <button 
                                onClick={() => handleCategoryClick(category)}
                                className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-amber-500 dark:from-yellow-500 dark:to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all"
                                aria-label={`مشاهده محصولات دسته ${category}`}
                            >
                                <ToolIcon className="w-10 h-10 md:w-12 md:h-12" />
                            </button>
                            <span className="mt-3 text-sm font-medium text-center text-gray-700 dark:text-gray-300 group-hover:text-yellow-600 transition-colors">{category}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <ProductSection title="محصولات پیشنهادی" products={featuredProducts} />

            {/* Recently Viewed Products */}
            <ProductSection title="بازدیدهای اخیر شما" products={recentlyViewedProducts} />

            {/* New Products */}
            <ProductSection title="جدیدترین محصولات" products={newProducts} />

        </div>
    );
};

export default HomePage;