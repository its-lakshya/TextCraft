import { Link, useNavigate } from 'react-router-dom';
import AuthBackgroundImage from '../assets/images/AuthBackgroundImage.svg';
import { buttonHoverAnimaiton } from '../utils/Tailwind.utils';
import { useState } from 'react';
import axios from '../axios.config';
import Loader from '../components/loader/Loader';

type User = {
  fullName: string;
  userName: string;
  mobileNumber: string;
  email: string;
  password: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const inputStyles: string =
    'w-full h-8 rounded-md px-4 border border-[#BCBEC0] text-black text-sm';
  const inputContainerStyles: string = 'flex flex-col gap-2 w-full';
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidNumber, setInvalidNumber] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const indianMobileNumberRegex = /^[6789]\d{9}$/;

  const [user, setUser] = useState<User>({
    fullName: '',
    userName: '',
    mobileNumber: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === 'email') {
      if (emailRegex.test(value) === true) setInvalidEmail(false);
      else setInvalidEmail(true);
    }

    if (name === 'mobileNumber') {
      if (indianMobileNumberRegex.test(value) === true) setInvalidNumber(false);
      else setInvalidNumber(true);
    }

    setUser(previousUser => ({
      ...previousUser,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!invalidEmail && !invalidNumber) {
      setIsLoading(true);
      const userData = {
        fullName: user.fullName,
        userName: user.userName,
        ...(user.mobileNumber && { mobileNumber: user.mobileNumber }),
        email: user.email,
        password: user.password,
      };
      try {
        const response = await axios.post('/users/register', userData);
        console.log(response);
        navigate('/auth/login');
      } catch (error) {
        console.log(error, 'Not registered');
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader />
      </div>
    );
  } else {
    return (
      <div
        className="WRAPPER flex justify-center items-center w-full h-screen bg-center bg-cover bg-primaryDark text-white"
        style={{ backgroundImage: `url(${AuthBackgroundImage})` }}
      >
        <div
          className="MAIN-CONTAINER flex flex-col justify-center items-center gap-10 w-[450px] h-auto p-10 px-rootXPadd border border-primary rounded-3xl"
          style={{ background: 'rgba(88, 130, 193, 0.28)', backdropFilter: 'blur(8.89323px)' }}
        >
          <button className="LOGO text-logoFontSize font-bold mr-4 drop-shadow-lg">
            <span className="text-primaryDark">
              Text<span className="text-primary">Craft</span>
            </span>
          </button>
          <div className="FORM-CONTAINER flex flex-col gap-6 w-full">
            <div className="HEADING text-2xl font-bold">Register</div>
            <form
              className="FORM flex flex-col gap-6"
              onSubmit={e => handleRegister(e)}
              method="post"
            >
              <div className="flex flex-col gap-3 items-start w-full">
                <div className={`${inputContainerStyles}`}>
                  <label className="NAME-LABEL capitalize">Fullname</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    required
                    className={`NAME-INPUT ${inputStyles}`}
                    onChange={e => handleInputChange(e)}
                  />
                </div>
                <div className={`${inputContainerStyles}`}>
                  <label className="EMAIL-LABEL capitalize">username</label>
                  <input
                    type="text"
                    name="userName"
                    placeholder="john@doe"
                    required
                    className={`EMAIL-INPUT ${inputStyles}`}
                    onChange={e => handleInputChange(e)}
                  />
                </div>
                <div className={`relative ${inputContainerStyles}`}>
                  <label className="MOBILE-LABEL capitalize">
                    mobile <span className="text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="91XXXXXXXX"
                    className={`MOBILE-INPUT ${inputStyles}`}
                    onChange={e => handleInputChange(e)}
                  />
                  {invalidNumber ? (
                    <div className="absolute top-[66px] right-0 text-xs text-red-500">
                      Invalid mobile number
                    </div>
                  ) : null}
                </div>
                <div className={`relative ${inputContainerStyles}`}>
                  <label className="EMAIL-LABEL capitalize">email</label>
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="username@gmail.com"
                    className={`EMAIL-INPUT ${inputStyles}`}
                    onChange={e => handleInputChange(e)}
                  />
                  {invalidEmail ? (
                    <div className="absolute top-[66px] right-0 text-xs text-red-500">
                      Invalid email
                    </div>
                  ) : null}
                </div>
                <div className={`${inputContainerStyles}`}>
                  <label className="PASSWORD-LABEL capitalize">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="password"
                    className={`PASSWORD-INPUT ${inputStyles}`}
                    onChange={e => handleInputChange(e)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`LOGIN-BUTTON flex justify-center items-center text-lg font-bold bg-primary py-2 rounded-lg ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark ${invalidEmail ? 'pointer-events-none' : null}`}
              >
                Sign up
              </button>
            </form>
            <span className="SIGN-UP text-xs text-center font-light">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-bold">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default Register;
