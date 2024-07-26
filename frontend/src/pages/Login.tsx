import { Link, useNavigate } from 'react-router-dom';
import AuthBackgroundImage from '../assets/images/AuthBackgroundImage.svg';
import { buttonHoverAnimaiton } from '../utils/Tailwind.utils';
import { useState } from 'react';
import axios from '../axios.config';

type User = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const inputStyles: string =
    'w-full h-8 rounded-md px-4 border border-[#BCBEC0] text-black text-sm';
  const inputContainerStyles: string = 'flex flex-col gap-2 w-full';
  const [user, setUser] = useState<User>({ email: '', password: '' });

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, email: e.target.value });
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, password: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await axios.post('/users/login', {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } catch (error) {
      console.log(error, 'Logged in unsuccessfull');
    }
  };

  return (
    <div
      className="WRAPPER relative flex justify-center items-center w-full h-screen bg-center bg-cover text-white overflow-hidden bg-primaryDark"
    >
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
        <div className="FORM-CONTAINER flex flex-col gap-6 w-full">
          <div className="HEADING text-2xl font-bold">Login</div>
          <form className="FORM flex flex-col gap-6" onSubmit={e => handleLogin(e)} method="post">
            <div className="flex flex-col gap-3 items-start w-full">
              <div className={`${inputContainerStyles}`}>
                <label className="EMAIL-LABEL capitalize">Email</label>
                <input
                  type="text"
                  placeholder="username@gmail.com"
                  onChange={e => {
                    handleUserName(e);
                  }}
                  className={`EMAIL-INPUT ${inputStyles}`}
                />
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
              className={`LOGIN-BUTTON flex justify-center items-center text-lg font-bold bg-primary py-2 rounded-lg ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark`}
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
