
'use client';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import Head from 'next/head';
import './globals.css';
import Navbar from './components/Navbar';
import SessionProvider from './components/SessionProvider';
import FeaturedBooks from './components/FeaturedBooks';
import ExploreBooks from './components/ExploreBooks';
import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { usePathname } from 'next/navigation'; 
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../app/redux/store';
import Footer from './components/Footer';
import Bestsellers from './components/Bestsellers';
import HeroSection from './components/Hero';
import ComingSoon from './components/ComingSoon';
import { WishlistProvider } from './context/WishlistContext';



// Load local fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff', 
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null); 
  const pathname = usePathname();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Clear search term when a category is selected
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedCategory(null); // Clear category when searching
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId); // Set the selected book ID
  };

  const isDetailsPage = pathname.startsWith('/details');

  return (
    <html lang="en">
            <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <SessionProvider>
          <CartProvider>
          <WishlistProvider>
            {!isDetailsPage && (
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <div className="pb-14">
                    {/* Pass selectedBookId as currentBookId */}
                    <Navbar 
                      onSearch={handleSearch} 
                      onCategorySelect={handleCategorySelect} 
                      currentBookId={selectedBookId} 
                    />
                 <main className="flex-grow">{children}</main>
                  </div>
                  <div className='pt-8 mt-8'>
                  </div> 
                  <div className='pt-1 mt-1'>
               <HeroSection />
               </div>
                  <div>
                    <Bestsellers />
                  </div>
                  <div>
                    <FeaturedBooks onBookSelect={handleBookSelect} /> {/* Ensure you handle book selection here */}
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
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}







