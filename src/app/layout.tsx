'use client';
import './globals.css';
import Navbar from './components/Navbar';
import SessionProvider from './components/SessionProvider';
import FeaturedBooks from './components/FeaturedBooks';
import ExploreBooks from './components/ExploreBooks';
import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../app/redux/store';
import { usePathname } from 'next/navigation'; 
import Footer from './components/Footer';
import Bestsellers from './components/Bestsellers';
import HeroSection from './components/Hero';
import ComingSoon from './components/ComingSoon';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const pathname = usePathname();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Clear search term when a category is selected
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedCategory(null); // Clear category when searching
  };

  const isDetailsPage = pathname?.startsWith('/details');

  return (
    <html lang="en">
      <body className='overflow-x-hidden'>
        <SessionProvider>
          <CartProvider>
              {!isDetailsPage && (
                            <Provider store={store}>
                            <PersistGate loading={null} persistor={persistor}>
                              <div className="pb-14">
                      <Navbar 
                        onSearch={handleSearch} 
                        onCategorySelect={handleCategorySelect} 
                      />
                      <main className="flex-grow">{children}</main>
                    </div>
                    <div className='pt-8 mt-8'>
                      <HeroSection />
                    </div>
                    <div>
                      <Bestsellers />
                    </div>
                    <div>
                      <FeaturedBooks />
                    </div>
                    <div className='pt-4 mt-4'>
                      <ComingSoon />
                    </div>
                    <div>
                      <ExploreBooks category={selectedCategory} searchTerm={searchTerm} />
                    </div>
                    <div className='pt-6 mt-6'>
                      <Footer />
                    </div>
                    </PersistGate>
                    </Provider>
              )}
              {children}
              </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}







