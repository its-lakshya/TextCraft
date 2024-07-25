import { BsThreeDotsVertical } from 'react-icons/bs';
import { getDate } from '../../utils/Date.utils';
import { useEffect, useRef, useState } from 'react';
import { MdEditDocument } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';
import RenameModel from '../../modals/Rename.model';

interface Document {
  createdAt: string;
  documentName: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface DocumentCardProps {
  data: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ data }) => {
  const lastUpdatedAt = getDate(data?.updatedAt);
  const moreOptionsRef = useRef<HTMLSpanElement>(null);
  const documentNameRef = useRef<HTMLSpanElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(data.documentName)

  const handleMoreOptions = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  };

  // Handeling closing of the more options modal when click outside the button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) && !showRenameModal
      ) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRename = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    setShowRenameModal(true);
    setShowMoreOptions(false)
  };

  return (
    <div className="WRAPPER relative w-52 h-[330px] flex flex-col rounded-documentCard border border-gray-300 hover:border-primary cursor-pointer">
      <div className="DOCUMENT-OVERVIEW w-full h-full bg-white rounded-documentCard"></div>
      <div className="DOCUMENT-INFORMATION flex flex-col w-full h-20 py-3 px-4 box-border border border-t-gray-300 rounded-b-documentCard">
        <span ref={documentNameRef} className="text-sm font-medium">
          {newName}
        </span>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-end">
            <div className="LOGO text-xl font-bold leading-none mr-1">
              <span className="text-primaryDark">
                T<span className="text-primary">c</span>
              </span>
            </div>
            <span className="text-xs text-gray-500 font-light">Opened {lastUpdatedAt}</span>
          </div>
          <span
            ref={moreOptionsRef}
            onClick={e => handleMoreOptions(e)}
            className="size-6 flex justify-center items-center -mr-1 rounded-full hover:bg-primaryLight"
          >
            <BsThreeDotsVertical />
          </span>
        </div>
      </div>
      {showMoreOptions ? (
        <div
          ref={modalRef}
          className="absolute w-44 h-auto flex flex-col py-2 bg-white bottom-10 -right-8 text-lg text-zinc-600 font-light rounded-md z-10 select-none"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
        >
          <div
            className="w-full flex justify-start items-center gap-4 h-9 px-4 hover:bg-primaryExtraLight"
            onClick={e => handleRename(e)}
          >
            <MdEditDocument /> <span className="text-sm">Rename</span>
          </div>
          <div className="w-full flex justify-start items-center gap-4 h-9 px-4 hover:bg-primaryExtraLight">
            <AiFillDelete /> <span className="text-sm">Remove</span>
          </div>
        </div>
      ) : null}
      {showRenameModal ? <RenameModel name={data.documentName} documentId={data._id} setShowRenameModal={setShowRenameModal} setNewName={setNewName} /> : null}
    </div>
  );
};

export default DocumentCard;
