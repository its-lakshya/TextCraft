import { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { MdError } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { setShowToast } from '../../store/slices/Toast.slice';
import { motion } from 'framer-motion';

const Toast: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useSelector((store: RootState) => store.toast);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setShowToast({ showToast: false, message: '', type: 'DEFAULT' }));
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const getTypeStyle = (type: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED' | 'DEFAULT') => {
    switch (type) {
      case 'SUCCESS':
        return {
          borderBottom: '6px solid #22BB33',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        };
      case 'FAILED':
        return {
          bordeBottom: '6px solid #BB2124',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        };
      case 'UNAUTHORIZED':
        return {
          bordeBottom: '6px solid #F0AD4E',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        };
      default:
        return {
          bordeBottom: '6px solid gray',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        };
    }
  };

  return (
    <motion.div
      className="TOAST fixed left-[calc(50%-10rem)] flex justify-start items-center gap-3 w-80 h-16 bg-white z-50 rounded-[4px] p-3 text-md text-gray-500"
      style={getTypeStyle(toast.type)}
      initial={{opacity: 0, top: 0}}
      animate={{opacity: 1, top: 30, rotateX: 360}}
      transition={{duration: 0.5, ease: 'easeInOut'}}
    >
      {toast.type === 'SUCCESS' ? (
        <span className="text-[#22BB33] text-2xl">
          <FaCheckCircle />
        </span>
      ) : toast.type === 'FAILED' ? (
        <span className="text-[#BB2124] text-2xl">
          <MdError />
        </span>
      ) : (
        <span>
          <IoIosWarning className="text-[#F0AD4E] text-2xl" />
        </span>
      )}
      {toast.message}
    </motion.div>
  );
};

export default Toast;
