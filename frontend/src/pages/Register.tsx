import { Link } from 'react-router-dom';
import AuthBackgroundImage from '../assets/images/AuthBackgroundImage.svg';
import { buttonHoverAnimaiton } from '../utils/TailwindUtils';

const Register: React.FC = () => {
  const inputStyles: string = 'w-full h-8 rounded-md px-4 border border-[#BCBEC0] text-black text-sm';
  const inputContainerStyles: string = 'flex flex-col gap-2 w-full';
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
          <form className="FORM flex flex-col gap-6">
            <div className="flex flex-col gap-3 items-start w-full">
              <div className={`${inputContainerStyles}`}>
                <label className="EMAIL-LABEL capitalize">Fullname</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`EMAIL-INPUT ${inputStyles}`}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="EMAIL-LABEL capitalize">username</label>
                <input
                  type="text"
                  placeholder="john@doe"
                  className={`EMAIL-INPUT ${inputStyles}`}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="EMAIL-LABEL capitalize">mobile (optional)</label>
                <input
                  type="text"
                  placeholder="91XXXXXXXX"
                  className={`EMAIL-INPUT ${inputStyles}`}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="EMAIL-LABEL capitalize">email</label>
                <input
                  type="text"
                  placeholder="username@gmail.com"
                  className={`EMAIL-INPUT ${inputStyles}`}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="PASSWORD-LABEL capitalize">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  className={`PASSWORD-INPUT ${inputStyles}`}
                />
              </div>
            </div>
            <button className={`LOGIN-BUTTON flex justify-center items-center text-lg font-bold bg-primary py-2 rounded-lg ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark`}>
              Sign up
            </button>
          </form>
          <span className="SIGN-UP text-xs text-center font-light">
            Already have an account? <Link to='/auth/login' className="font-bold">Login</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register