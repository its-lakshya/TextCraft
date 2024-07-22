import { Link, useLocation } from 'react-router-dom';
import { buttonHoverAnimaiton } from '../../utils/Tailwind.utils';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';

const Header: React.FC = () => {
  const location = useLocation();
  const loginRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLAnchorElement>(null);
  const isAuthenticated = useSelector((store: RootState) => store.auth.isAuthenticated);

  const hideLoginSiginButton = (): void => {
    if (loginRef.current && documentRef.current) {
      loginRef.current.style.display = 'none';
      documentRef.current.style.display = 'block';
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      hideLoginSiginButton();
    }
  }, [isAuthenticated, location]);

  const currentLocation = location.pathname.split('/');
  if (currentLocation[1] === 'document' || currentLocation[2] === 'documents') return null;

  return (
    <div
      className={`HEADER w-full h-20 flex justify-between items-center px-rootXPadd text-md capitalize font-medium`}
    >
      <div className="HEADER-LEFT flex justify-between items-end gap-8 w-auto h-8 text-black capitalize">
        <Link to="/" className="LOGO text-logoFontSize leading-none font-bold mr-4">
          <span className="text-primaryDark">
            Text<span className="text-primary">Craft</span>
          </span>
        </Link>
        <Link to="/contact-us" className="CONTACT US">
          Contact us
        </Link>
        <Link ref={documentRef} to="/user/documents" className="CONTACT US hidden">
          Documents
        </Link>
      </div>
      <div ref={loginRef} className="HEADER-RIGHT flex justify-center items-center gap-4 w-auto">
        <Link
          to="/auth/login"
          className={`LOGIN text-primary px-6 py-3 rounded-full ${buttonHoverAnimaiton} hover:bg-primaryLight`}
        >
          Log in
        </Link>
        <Link
          to="/auth/register"
          className={`SIGNUP bg-primary text-white px-8 py-3 rounded-full ${buttonHoverAnimaiton} hover:bg-primaryDark`}
        >
          Sign up now
        </Link>
      </div>
      <div className="size-8 bg-gray-300 rounded-full"></div>
    </div>
  );
};

export default Header;
