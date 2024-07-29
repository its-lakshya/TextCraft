import { useDispatch, useSelector } from 'react-redux';
import ProfilePageBannerImage from '../assets/images/ProfilePageBannerImage.svg';
import { RootState } from '../store/Store';
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
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidNumber, setInvalidNumber] = useState<boolean>(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const indianMobileNumberRegex = /^[6789]\d{9}$/;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (emailRegex.test(event.target.value) === true) setInvalidEmail(false);
    else setInvalidEmail(true);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (indianMobileNumberRegex.test(event.target.value) === true) setInvalidNumber(false);
    else setInvalidNumber(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setIsLoading(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if(!invalidEmail && !invalidNumber){
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
    }

    setIsLoading(false);
  };

  const handleProfileImage = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('profileImage', file);
    console.log(formData);

    try {
      const response = await axios.patch('/users/profile-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for FormData
        },
      });
      dispatch(setUserDetails(response.data.data));
    } catch (error) {
      console.log(error, 'Error while updating profile image');
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
              className="relative w-auto border-8 border-primaryDark rounded-full overflow-hidden cursor-pointer"
            >
              <img src={user.profileImage} alt="img" className="size-44 rounded-full" />
              <input
                type="file"
                className="absolute -top-10 bottom-0 left-0 right-0 rounded-full cursor-pointer"
                onChange={e => handleProfileImage(e)}
              ></input>
            </motion.span>
            <span className="flex flex-col mt-10 text-2xl font-medium">
              {user.fullName}
              <span className="text-md font-normal text-[#8D8D8D]">{user.email}</span>
            </span>
          </div>
          <form
            className="flex flex-col gap-12 w-full text-sm"
            onSubmit={e => handleSubmit(e)}
            method="post"
          >
            <div className="flex justify-between items-center gap-10 w-full">
              <div className="flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">
                  Full Name <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  name="fullName"
                  required
                  defaultValue={user.fullName}
                  className="FULL-NAME w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                ></input>
              </div>
              <div className="flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">
                  User Name <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  name="userName"
                  required
                  defaultValue={user.userName}
                  className="EMAIL w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                ></input>
              </div>
            </div>
            <div className="flex justify-between items-center gap-10 w-full">
              <div className="relative flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">
                  Email <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  name="email"
                  required
                  defaultValue={user.email}
                  className="USER-NAME w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                  onChange={e => handleEmailChange(e)}
                ></input>
                {invalidEmail ? (
                  <div className="absolute top-[53px] text-xs text-red-500">Invalid Email</div>
                ) : null}
              </div>
              <div className="relative flex flex-col justify-center w-[49%] items-start gap-1">
                <label className="text-[#8D8D8D] capitalize">
                  Mobile Number <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  name="mobileNumber"
                  required
                  defaultValue={user?.mobileNumber}
                  placeholder="Enter you mobile number"
                  className="MOBILE-NUMBER w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                  onChange={e => handleNumberChange(e)}
                ></input>
                {invalidNumber ? (
                  <div className="absolute top-[53px] text-xs text-red-500">
                    Invalid mobile number
                  </div>
                ) : null}
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
                className={`w-36 h-12 bg-primary text-md text-white font-medium rounded-md hover:bg-primaryDark ${buttonHoverAnimaiton} ${invalidEmail || invalidNumber ? 'pointer-events-none' : null} select-none`}
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
