import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './header/Header.tsx';
import Footer from './footer/Footer.tsx';
import { isAuthenticated } from '../utils/Auth.utils.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStatus, setUserDetails } from '../store/slices/Auth.slice.ts';
import Toast from '../components/toast/Toast.tsx';
import { RootState } from '../store/Store.ts';
import { VerifiedUser } from '../types/Global.types.ts';
import Loader from '../components/loader/Loader.tsx';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.pathname.split('/');
  const toast = useSelector((store: RootState) => store.toast);
  const authStatus = useSelector((store: RootState) => store.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data: VerifiedUser | boolean = await isAuthenticated();
        if (typeof data !== 'boolean') {
          const verifiedUser = data as VerifiedUser;
          dispatch(setAuthStatus(verifiedUser.isLoggedIn));
          dispatch(setUserDetails(verifiedUser.user));
          if (
            currentLocation[1] !== 'contact-us' &&
            currentLocation[1] !== '' &&
            !verifiedUser.isLoggedIn
          ) {
            navigate('/auth/login');
          }
        }

        if (
          typeof data === 'boolean' &&
          currentLocation[1] !== '' &&
          currentLocation[1] !== 'contact-us'
        ) {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error(error, 'Error checking authentication');
        dispatch(setAuthStatus(false));
        if (currentLocation[1] !== '' && currentLocation[1] !== 'contact-us')
          navigate('/auth/login');
      }
    })();
    // eslint-disable-next-line
  }, [authStatus, localStorage.getItem('accessToken')]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed flex justify-center items-center w-screen h-screen bg-gray-300 bg-opacity-50 backdrop-blur-md">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <Header />
      <Outlet />
      <Footer />
      {toast.showToast ? <Toast /> : null}
    </div>
  );
};

export default Layout;
