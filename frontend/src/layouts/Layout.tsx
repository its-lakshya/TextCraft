import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './header/Header.tsx';
import Footer from './footer/Footer.tsx';
import { isAuthenticated } from '../utils/Auth.utils.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStatus, setUserDetails } from '../store/slices/Auth.slice.ts';
import Toast from '../components/toast/Toast.tsx';
import { RootState } from '../store/Store.ts';

interface VerifiedUser {
  isLoggedIn: boolean;
  user: {
    _id: string;
    userName: string;
    gender: string;
    email: string;
    fullName: string;
    profileImage: string;
  };
}

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.pathname.split('/');
  const toast = useSelector((store: RootState) => store.toast);

  useEffect(() => {
    (async () => {
      try {
        const data: VerifiedUser | boolean = await isAuthenticated();
        if (typeof data !== 'boolean') {
          const verifiedUser = data as VerifiedUser;
          dispatch(setAuthStatus(verifiedUser.isLoggedIn));
          dispatch(setUserDetails(verifiedUser.user));
          if (
            !verifiedUser.isLoggedIn &&
            currentLocation[1] !== '' &&
            currentLocation[1] !== 'contact-us'
          ) {
            navigate('/auth/login');
          }
        }

        if (typeof data === 'boolean') navigate('/auth/login');
      } catch (error) {
        console.error(error, 'Error checking authentication');
        dispatch(setAuthStatus(false));
        if (currentLocation[1] !== '' && currentLocation[1] !== 'contact-us')
          navigate('/auth/login');
      }
    })();
  }, []);

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
