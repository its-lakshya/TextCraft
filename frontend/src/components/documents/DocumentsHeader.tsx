import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RootState } from '../../store/Store';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import ProfileModal from '../../modals/Profile.modal';

const DocumentsHeader = () => {
  const profileRef = useRef<HTMLSpanElement>(null);
  const user = useSelector((store: RootState) => store.auth);
  const [profileModal, setProfileModal] = useState<boolean>(false);

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

  return (
    <div className="WRAPPER fixed flex justify-between items-center w-full px-10 h-[4rem] bg-documentBackground">
      <div className="HEADER-LEFT flex gap-4 items-end">
        <Link to="/" className="LOGO text-5xl font-bold leading-none mr-1">
          <span className="text-primaryDark">
            T<span className="text-primary">c</span>
          </span>
        </Link>
        <span className="text-2xl text-gray-500 capitalize">Docs</span>
      </div>
      <div className="HEADER-LEFT">
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
              <ProfileModal />{' '}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DocumentsHeader;
