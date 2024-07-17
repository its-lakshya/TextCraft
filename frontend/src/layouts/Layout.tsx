import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header.tsx';
import Footer from './footer/Footer.tsx';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className='bg-black w-screen h-screen'>
      <Outlet />
      <Footer />

      </div>
    </div>
  );
};

export default Layout;
