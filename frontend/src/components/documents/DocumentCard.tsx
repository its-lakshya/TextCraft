import { BsThreeDotsVertical } from "react-icons/bs";

const DocumentCard: React.FC = () => {
  return (
    <div className="WRAPPER w-52 h-[330px] flex flex-col rounded-documentCard border border-gray-300 hover:border-primary overflow-hidden cursor-pointer">
      <div className="DOCUMENT-OVERVIEW w-full h-full bg-white"></div>
      <div className="DOCUMENT-INFORMATION flex flex-col w-full h-20 py-3 px-4 box-border border border-t-gray-300">
        <span className="text-sm font-medium">Untitle_Document</span>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-end">
            <div className="LOGO text-xl font-bold leading-none mr-1">
              <span className="text-primaryDark">
                T<span className="text-primary">c</span>
              </span>
            </div>
            <span className='text-xs text-gray-500'>Opened Jul 19, 2024</span>
          </div>
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
