import { Link } from 'react-router-dom';

const DocumentsHeader = () => {
  return (
    <div className="WRAPPER fixed flex justify-between items-center w-full px-10 h-[4rem] bg-documentBackground">
      <div className="HEADER-LEFT flex gap-4 items-end">
        <Link to="/" className="LOGO text-5xl font-bold leading-none mr-1">
          <span className="text-primaryDark">
            T<span className="text-primary">c</span>
          </span>
        </Link>
        <span className="text-2xl text-gray-500 capitalize">Docs</span>
      </div>
      <div className="HEADER-LEFT">
        <div className="PROFILE size-8 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default DocumentsHeader;
