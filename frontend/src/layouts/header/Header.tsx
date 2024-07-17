import { buttonHoverAnimaiton } from "../../utils/TailwindUtils";

const Header = () => {

  return (
    <div className="HEADER w-full h-20 flex justify-between items-center px-rootXPadd text-md capitalize font-medium">
      <div className="HEADER-LEFT flex justify-between items-center gap-8 w-auto h-8 text-black">
        <div className="LOGO text-logoFontSize font-bold mr-4">
          <span className="text-primaryDark">
            Text<span className="text-primary">Craft</span>
          </span>
        </div>
        <button className="ABOUT ">About</button>
        <button className="EXPLORE ">Explore</button>
      </div>
      <div className="HEADER-RIGHT flex justify-center items-center gap-4 w-auto">
        <button
          className={`LOGIN text-primary px-6 py-3 rounded-full ${buttonHoverAnimaiton} hover:bg-primaryLight`}
        >
          Log in
        </button>
        <button
          className={`SIGNUP bg-primary text-white px-8 py-3 rounded-full ${buttonHoverAnimaiton} hover:bg-primaryDark`}
        >
          Sign up now
        </button>
      </div>
    </div>
  );
};

export default Header;
