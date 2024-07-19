import { Link, useLocation, useNavigate } from 'react-router-dom';
import { buttonHoverAnimaiton } from '../../utils/TailwindUtils';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const [visibility, setVisibility] = useState<string>('visible');

  useEffect(() => {
    const currentLocation = location.pathname.split('/');
    if (currentLocation[1] === 'document') setVisibility('hidden');
    else setVisibility('visibile');
  }, []);



  return (
    <div
      className={`HEADER w-full h-20 flex justify-between items-center px-rootXPadd text-md capitalize font-medium ${visibility}`}
    >
      <div className="HEADER-LEFT flex justify-between items-center gap-8 w-auto h-8 text-black">
        <button className="LOGO text-logoFontSize font-bold mr-4" onClick={() => navigate('/')}>
          <span className="text-primaryDark">
            Text<span className="text-primary">Craft</span>
          </span>
        </button>
        <Link to='/contact-us' className="CONTACT US">Contact us</Link>
      </div>
      <div className="HEADER-RIGHT flex justify-center items-center gap-4 w-auto">
        <Link
          to='/auth/login'
          className={`LOGIN text-primary px-6 py-3 rounded-full ${buttonHoverAnimaiton} hover:bg-primaryLight`}
        >
          Log in
        </Link>
        <Link
          to='/auth/register'
          className={`SIGNUP bg-primary text-white px-8 py-3 rounded-full ${buttonHoverAnimaiton} hover:bg-primaryDark`}
        >
          Sign up now
        </Link>
      </div>
    </div>
  );
};

export default Header;
