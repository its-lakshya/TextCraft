import { Link, useNavigate } from 'react-router-dom';
import AuthBackgroundImage from '../assets/images/AuthBackgroundImage.svg';
import { buttonHoverAnimaiton } from '../utils/Tailwind.utils';
import { useState } from 'react';
import axios from '../axios.config';
import { UserEmailPassword } from '../types/Global.types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const inputStyles: string =
    'w-full h-8 rounded-md px-4 border border-[#BCBEC0] text-black text-sm';
  const inputContainerStyles: string = 'flex flex-col gap-2 w-full';
  const [user, setUser] = useState<UserEmailPassword>({ email: '', password: '' });
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsLoginFailed(false)
    if (emailRegex.test(event.target.value) === true) {
      setInvalidEmail(false);
      setUser({ ...user, email: event.target.value });
    } else setInvalidEmail(true);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsLoginFailed(false)
    setUser({ ...user, password: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!invalidEmail) {
      try {
        await axios.post('/users/login', {
          email: user.email,
          password: user.password,
        });
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } catch (error) {
        console.log(error, 'Logged in unsuccessfull');
        setIsLoginFailed(true);
      }
    }
  };

  return (
    <div className="WRAPPER relative flex justify-center items-center w-full h-screen bg-center bg-cover text-white overflow-hidden bg-primaryDark">
      <img src={AuthBackgroundImage} alt="img" className="absolute" />
      <div
        className="MAIN-CONTAINER flex flex-col justify-center items-center gap-10 w-[450px] h-auto p-10 px-rootXPadd border border-primary rounded-3xl"
        style={{ background: 'rgba(88, 130, 193, 0.28)', backdropFilter: 'blur(8.89323px)' }}
      >
        <button className="LOGO text-logoFontSize font-bold mr-4 drop-shadow-lg">
          <span className="text-primaryDark">
            Text<span className="text-primary">Craft</span>
          </span>
        </button>
        {isLoginFailed ? <div className='absolute top-24 text-sm text-red-500'>Login failed, either passwor or email is incorrect</div> : null }
        <div className="FORM-CONTAINER flex flex-col gap-6 w-full">
          <div className="HEADING text-2xl font-bold">Login</div>
          <form className="FORM flex flex-col gap-6" onSubmit={e => handleLogin(e)} method="post">
            <div className="flex flex-col gap-3 items-start w-full">
              <div className={`relative ${inputContainerStyles}`}>
                <label className="EMAIL-LABEL capitalize">Email</label>
                <input
                  type="text"
                  placeholder="username@gmail.com"
                  onChange={e => {
                    handleEmail(e);
                  }}
                  className={`EMAIL-INPUT ${inputStyles}`}
                />
                {invalidEmail ? (
                  <div className="absolute top-16 right-0 text-xs text-red-500">Invalid Email</div>
                ) : null}
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="PASSWORD-LABEL capitalize">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  onChange={e => handlePassword(e)}
                  className={`PASSWORD-INPUT ${inputStyles}`}
                />
              </div>
              <button className="FORGOT-PASSWORD capitalize">Forgot Password?</button>
            </div>
            <button
              type="submit"
              className={`LOGIN-BUTTON flex justify-center items-center text-lg font-bold bg-primary py-2 rounded-lg ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark ${invalidEmail ? 'pointer-events-none' : null}`}
            >
              Login
            </button>
          </form>
          <span className="SIGN-UP text-xs text-center font-light">
            Don't have an account yet?{' '}
            <Link to="/auth/register" className="font-bold">
              Register for free
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
