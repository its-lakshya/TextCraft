import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './header/Header.tsx';
import Footer from './footer/Footer.tsx';
import { isAuthenticated } from '../utils/Auth.utils.ts';
import { useDispatch } from 'react-redux';
import { setAuthStatus } from '../store/slices/Auth.slice.ts';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const currentLocation = location.pathname.split('/');

  useEffect(() => {
    (async () => {
      try {
        const isLoggedIn: boolean = await isAuthenticated();
        dispatch(setAuthStatus(isLoggedIn));
        if(!isLoggedIn && currentLocation[1] !== '' && currentLocation[1] !== 'contact-us'){
          navigate('/auth/login')
        }
      } catch (error) {
        console.error(error, 'Error checking authentication');
        dispatch(setAuthStatus(false));
        if(currentLocation[1] !== '' && currentLocation[1] !== 'contact-us') navigate('/auth/login')
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
