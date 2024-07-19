import { Link } from 'react-router-dom';

const EditorHeader = () => {
  return (
    <div className="WRAPPER fixed top-0 z-50 flex w-[95vw] h-20 justify-between box-border items-center bg-documentBackground">
      <div className="HEADER-LEFT flex w-auto items-center">
        <Link to="/" className="LOGO text-logoFontSizeSmall font-bold leading-none mr-4">
          <span className="text-primaryDark">
            Text<span className="text-primary">Craft</span>
          </span>
        </Link>
        <div></div>
      </div>
      <div className="HEADER-RIGHT flex w-auto items-center"></div>
    </div>
  );
};
export default EditorHeader;
