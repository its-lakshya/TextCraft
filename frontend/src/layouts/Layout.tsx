import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './header/Header.tsx';
import Footer from './footer/Footer.tsx';
import { isAuthenticated } from '../utils/Auth.utils.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStatus, setUserDetails } from '../store/slices/Auth.slice.ts';
import Toast from '../components/toast/Toast.tsx';
import { RootState } from '../store/Store.ts';
import { VerifiedUser } from '../types/Global.types.ts';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.pathname.split('/');
  const toast = useSelector((store: RootState) => store.toast);
  const authStatus = useSelector((store: RootState) => store.auth)

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
  }, [authStatus]);

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
