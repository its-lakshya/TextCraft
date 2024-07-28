import { Link, useLocation } from 'react-router-dom';
import ErrorBackgroundImage from '../assets/images/404BackgroundImage.svg';
import { buttonHoverAnimaiton } from '../utils/Tailwind.utils';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Error404Props } from '../types/Global.types';

const Error404: React.FC<Error404Props> = () => {
  const location = useLocation();
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-12">
      <div className="flex w-full h-[25vw] justify-center items-center gap-4 text-[20vw] font-bold text-primary font-sans">
        4
        <img className="w-auto h-full" src={ErrorBackgroundImage} alt="img" />4
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <span className="text-primary text-[3vw] font-bold">{location.state.text}</span>
        <Link
          to="/"
          className={`flex justify-center items-center gap-6 px-6 w-[18vw] h-16 bg-primary text-white text-[1.6vw] font-semibold ${buttonHoverAnimaiton} hover:bg-primaryDark rounded-3xl group`}
        >
          <span className="ARROW group-hover:animate-arrowMove relative">
            <FaArrowLeftLong />
          </span>
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
