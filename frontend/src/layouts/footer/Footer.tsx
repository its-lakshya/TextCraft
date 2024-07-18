import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { IoHeartSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<string>('visible');

  useEffect(() => {
    const currentLocation = location.pathname.split('/');
    if (currentLocation[1] === 'document') setVisibility('hidden');
    else setVisibility('visibile');
  }, []);

  return (
    <div
      className={`WRAPPER fixed bottom-0 -z-10 flex flex-col justify-between w-full h-52 py-12 px-rootXPadd bg-primaryExtraLight text-black ${visibility}`}
    >
      <div className="flex items-center gap-2">
        Developed with
        <span className="text-primary">
          <IoHeartSharp />
        </span>
        by
        <span className="NAME text-primary text-lg font-bold">
          Lakshya <span className="text-primaryDark">Kumar</span>
        </span>
      </div>
      <hr className="border-1 border-[#CBD5E1]" />
      <div className="flex justify-between items-center w-full">
        <div className="flex items-end gap-4 w-full">
          <button className="LOGO text-logoFontSizeSmall font-bold leading-none mr-4" onClick={() => navigate('/')}>
            <span className="text-primaryDark">
              Text<span className="text-primary">Craft</span>
            </span>
          </button>
          <span>Features</span>
          <span>Contact us</span>
        </div>
        <div className="flex justify-center items-end gap-6 w-auto [&>*]:text-xl [&>*]:text-black">
          <FaGithub />
          <FaLinkedinIn />
          <FaXTwitter />
        </div>
      </div>
    </div>
  );
};

export default Footer;
