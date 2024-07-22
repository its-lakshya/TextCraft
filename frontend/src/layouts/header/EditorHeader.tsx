import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { buttonHoverAnimaiton } from '../../utils/Tailwind.utils';
import { IoEarthSharp } from 'react-icons/io5';

const EditorHeader = () => {
  const documentNameRef = useRef<HTMLDivElement>(null);

  const handleDocumentNameBlur = () => {
    if (documentNameRef.current?.innerHTML === '') {
      documentNameRef.current.innerHTML = 'Untitled_Document';
    }
  };

  return (
    <div className="WRAPPER flex w-full h-[4rem] justify-between box-border items-center bg-documentBackground">
      <div className="HEADER-LEFT flex w-auto items-center">
        <Link to="/" className="LOGO text-5xl font-bold leading-none mr-1">
          <span className="text-primaryDark">
            T<span className="text-primary">c</span>
          </span>
        </Link>
        <div className="DOCUMENT-INFORMATION flex flex-col items-start w-auto h-auto">
          <div
            ref={documentNameRef}
            className="max-w-[50vw] w-auto h-auto px-2 border-none text-lg font-medium overflow-hidden whitespace-nowrap focus:outline-primary"
            contentEditable="true"
            onBlur={handleDocumentNameBlur}
          >
            Untitled_Document
          </div>
          <div className="flex items-center gap-0 w-auto h-auto text-sm">
            <button className="px-2 py-[2px] rounded-sm hover:bg-primaryLight hover:bg-opacity-30">
              Download PDF
            </button>
            <button className="px-2 py-[2px] rounded-sm hover:bg-primaryLight hover:bg-opacity-30">
              Download Doc
            </button>
            <Link to='/user/documents' className="px-2 py-[2px] rounded-sm hover:bg-primaryLight hover:bg-opacity-30">
              All Documents
            </Link>
            <span className="ml-2 text-gray-500 font-light">Last edited 2d ago</span>
          </div>
        </div>
      </div>
      <div className="HEADER-RIGHT flex items-center gap-3 w-auto">
        <button
          className={`SHARE flex justify-center items-center gap-2 w-32 h-10 bg-primary ${buttonHoverAnimaiton} hover:bg-primaryDark text-white rounded-full`}
        >
          <IoEarthSharp />
          Share
        </button>
        <span className='PROFILE size-8 rounded-full bg-gray-300'></span>
      </div>
    </div>
  );
};
export default EditorHeader;
