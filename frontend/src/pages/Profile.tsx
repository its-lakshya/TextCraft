import { useDispatch, useSelector } from 'react-redux';
import ProfilePageBannerImage from '../assets/images/ProfilePageBannerImage.svg';
import { RootState } from '../store/Store';
import { HiCamera } from 'react-icons/hi';
import { buttonHoverAnimaiton } from '../utils/Tailwind.utils';
import { motion } from 'framer-motion';
import axios from '../axios.config';
import { useState } from 'react';
import { setUserDetails } from '../store/slices/Auth.slice';
import Loader from '../components/loader/Loader';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setIsLoading(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    try {
      const response = await axios.patch('/users/update-account', {
        fullName: form.fullName.value,
        userName: form.userName.value,
        email: form.email.value,
        mobileNumber: form.mobileNumber.value,
        gender: form.gender.value,
      });
      dispatch(setUserDetails(response.data.data));
    } catch (error) {
      console.log(error, "Error while updating user's details");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center w-screen"
        style={{ height: 'calc(100vh - 5rem)' }}
      >
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="WAPPER flex flex-col justify-start items-center w-screen bg-white">
        <div
          className="BANNER-IMAGE w-full h-44 bg-primaryExtraLight"
          style={{ backgroundImage: `url(${ProfilePageBannerImage})` }}
        ></div>
        <div className="FORM-CONTAIER flex flex-col gap-12 w-[60vw] h-auto">
          <div className="PROFILE-IMAGE-CONTAINER flex justify-start gap-12 -mt-16 items-center w-full h-auto">
            <motion.span
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1 }}
              className="relative w-auto border-8 border-primaryDark rounded-full cursor-pointer"
            >
              <img src={user.profileImage} alt="img" className="size-44 rounded-full" />
              <span className="absolute flex justify-center items-center text-3xl text-primaryDark bottom-2 right-0 size-10 bg-primaryLight rounded-full">
                <HiCamera />
              </span>
            </motion.span>
            <span className='flex flex-col mt-10 text-2xl font-medium'>
              {user.fullName}
              <span className='text-md font-normal text-[#8D8D8D]'>{user.email}</span>
            </span>
          </div>
          <form
            className="flex flex-col gap-12 w-full text-sm"
            onSubmit={e => handleSubmit(e)}
            method="post"
          >
            <div className="flex justify-between items-center gap-10 w-full">
              <div className="flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">Full Name</label>
                <input
                  name="fullName"
                  required
                  defaultValue={user.fullName}
                  className="FULL-NAME w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                ></input>
              </div>
              <div className="flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">User Name</label>
                <input
                  name="email"
                  required
                  defaultValue={user.email}
                  className="EMAIL w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                ></input>
              </div>
            </div>
            <div className="flex justify-between items-center gap-10 w-full">
              <div className="flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">Email</label>
                <input
                  name="userName"
                  required
                  defaultValue={user.userName}
                  className="USER-NAME w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                ></input>
              </div>
              <div className="flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">Mobile Number</label>
                <input
                  name="mobileNumber"
                  required
                  defaultValue={user?.mobileNumber}
                  placeholder="Enter you mobile number"
                  className="MOBILE-NUMBER w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                ></input>
              </div>
            </div>
            <select
              name="gender"
              required
              className="flex justify-between items-center gap-10 w-[48%] h-10 px-2 bg-primaryExtraLight rounded-md"
            >
              <option defaultChecked={user.gender === 'male'} value="male">
                Male
              </option>
              <option defaultChecked={user.gender === 'female'} value="female">
                Female
              </option>
              <option
                defaultChecked={user.gender === 'prefer-not-to-say'}
                value="prefer-not-to-say"
              >
                Prefer not to say
              </option>
            </select>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className={`w-36 h-12 bg-primary text-md text-white font-medium rounded-md hover:bg-primaryDark ${buttonHoverAnimaiton}`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Profile;
