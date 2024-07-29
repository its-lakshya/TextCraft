import { Link, useLocation } from 'react-router-dom';
import { buttonHoverAnimaiton } from '../../utils/Tailwind.utils';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { motion } from 'framer-motion';
import ProfileModal from '../../modals/Profile.modal';

const Header: React.FC = () => {
  const location = useLocation();
  const loginRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLSpanElement>(null);
  const documentRef = useRef<HTMLAnchorElement>(null);
  const user = useSelector((store: RootState) => store.auth);
  const [profileModal, setProfileModal] = useState<boolean>(false);
  const [showProfileImage, setShowProfileImage] = useState<boolean>(false);

  const hideLoginSigninButton = (): void => {
    if (loginRef.current && documentRef.current) {
      loginRef.current.style.display = 'none';
      documentRef.current.style.display = 'block';
    }
  };

  const showLoginSigninButton = (): void => {
    if (loginRef.current && documentRef.current) {
      loginRef.current.style.display = 'block';
      documentRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    if (user.isAuthenticated) {
      hideLoginSigninButton();
      setShowProfileImage(true);
    } else {
      setShowProfileImage(false);
      showLoginSigninButton();
    }
  }, [user, location]);

  // Handling closing of profile model when clicked outsied
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileModal(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLocation = location.pathname.split('/');
  if (currentLocation[1] === 'document' || currentLocation[2] === 'documents') return null;

  return (
    <div
      className={`HEADER w-full h-20 flex justify-between items-center px-rootXPadd text-md font-medium`}
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
      <div
        ref={loginRef}
        className="HEADER-RIGHT flex justify-center items-center gap-4 w-auto capitalize"
      >
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
      {showProfileImage ? (
        <div className="relative">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={user.profileImage}
            alt="img"
            className="size-10 bg-gray-300 rounded-full cursor-pointer"
            onClick={() => setProfileModal(!profileModal)}
          />
          {profileModal ? (
            <span ref={profileRef}>
              <ProfileModal setProfileModal={setProfileModal} />{' '}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
export default Header;
