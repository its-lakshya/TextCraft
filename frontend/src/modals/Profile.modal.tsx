import { IoSettingsOutline } from 'react-icons/io5';
import { TbLogout } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RootState } from '../store/Store';

const ProfileModal:React.FC = () => {
  const user = useSelector((store: RootState) => store.auth);
  return (
    <div
      className="WRAPPER absolute top-12 right-2 flex flex-col w-64 min-auto max-h-64 rounded-md pb-2 bg-white text-sm overflow-y-scroll overflow-x-hidden select-none z-10"
      style={{
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
      }}
    >
      <div className='flex w-full items-center gap-4 px-4 py-4 border-b border-b-gray-200 bg-primaryExtraLight'>
        <img src={user.profileImage} alt='img' className='size-14 rounded-full'/>
        <div className='flex flex-col'>
         <span className='text-xl font-semibold'>{user.fullName}</span>
         <span className='text-xs font-light'>{user.email}</span>
        </div>
      </div>
      <span className="flex items-center gap-2 w-full px-4 h-8 hover:bg-primaryExtraLight cursor-pointer select-none text-primary">
        <span className="text-xl">
          <IoSettingsOutline />
        </span>
        Profile
      </span>
      <span className="flex items-center gap-2 w-full px-4 h-8 hover:bg-primaryExtraLight cursor-pointer select-none text-red-500">
        <span className="text-xl">
          <TbLogout />
        </span>
        Logout
      </span>
    </div>
  );
};

export default ProfileModal;
