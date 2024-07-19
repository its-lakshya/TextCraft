import { useRef } from 'react';
import { Link } from 'react-router-dom';

const EditorHeader = () => {
  const documentNameRef = useRef<HTMLDivElement>(null);

  const handleDocumentNameBlur = () => {
    if(documentNameRef.current?.innerHTML === ''){
      documentNameRef.current.innerHTML = 'Untitled_Document'
    }
  }

  return (
    <div className="WRAPPER fixed top-0 z-50 flex w-[95vw] h-[4rem] justify-between items-center bg-documentBackground">
      <div className="HEADER-LEFT flex w-auto items-center">
        <Link to="/" className="LOGO text-5xl font-bold leading-none mr-1">
          <span className="text-primaryDark">
            T<span className="text-primary">c</span>
          </span>
        </Link>
        <div className="DOCUMENT-INFORMATION flex flex-col w-auto h-auto">
          <div ref={documentNameRef} className='w-auto h-auto px-2 border-none text-[17px]' contentEditable="true" onBlur={handleDocumentNameBlur}>Untitled_Document</div>
          <div className='flex items-center gap-4 w-auto h-auto ml-2 text-sm font-light'>
            <button>Download PDF</button>
            <button>Download Doc</button>
            <button>Last edited 2d ago</button>
          </div>
        </div>
      </div>
      <div className="HEADER-RIGHT flex w-auto items-center"></div>
    </div>
  );

};
export default EditorHeader;
