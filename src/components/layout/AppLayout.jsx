import React, { useEffect } from 'react';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import { APP_NAME, APP_VERSION } from '../../constants'; // constants ইম্পোর্ট

const AppLayout = ({ children }) => {
  
  // ব্রাউজার ট্যাব টাইটেল আপডেট করার জন্য
  useEffect(() => {
    document.title = `${APP_NAME} | ${APP_VERSION}`;
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14]">
      {/* Top Header */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-20 md:pt-24 w-full overflow-x-hidden">
        <div className="animate-in fade-in duration-700">
            {children}
        </div>
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Mobile Footer Nav (z-index 100 fixed in component) */}
      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;