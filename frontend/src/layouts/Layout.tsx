import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header.tsx';
import Footer from './footer/Footer.tsx';
import { isAuthenticated } from '../utils/Auth.utils.ts';
import { useDispatch } from 'react-redux';
import { setAuthStatus } from '../store/slices/Auth.slice.ts';

const Layout: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const isLoggedIn: boolean = await isAuthenticated();
        dispatch(setAuthStatus(isLoggedIn));
      } catch (error) {
        console.error(error, 'Error checking authentication');
        dispatch(setAuthStatus(false));
      }
    })();
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
