import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { buttonHoverAnimaiton } from '../../utils/Tailwind.utils';
import { IoEarthSharp } from 'react-icons/io5';
import axios from '../../axios.config';
import { getDate } from '../../utils/Date.utils';
import { CircularLoader } from '../../components/loader/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { Socket } from 'socket.io-client';
import { User } from '../../pages/DocumentEdit';
import { FaUserGroup } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import ActiveUsersModal from '../../modals/ActiveUsers.modal';
import { MdOutlineCloudDone } from 'react-icons/md';
import ShareModal from '../../modals/Share.modal';

interface Document {
  createdAt: string;
  documentName: string;
  content: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface DocumentProps {
  document?: Document;
  socket: Socket;
}

interface ActiveUsers {
  documentId: string,
  userDetails: User
}

const EditorHeader: React.FC<DocumentProps> = ({ document, socket }) => {
  const location = useLocation();
  const activeUsersRef = useRef<HTMLSpanElement>(null);
  const documentNameRef = useRef<HTMLDivElement>(null);
  const currentLocation = location.pathname.split('/');
  const documentId = currentLocation[currentLocation.length - 1];
  const [showShareModal, setShowShareModa] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUsers[]>();
  const isSaving = useSelector((store: RootState) => store.docSaving.isSaving);
  const [activeUsersVisibility, setActiveUsersVisibility] = useState<boolean>(false)

  let lastUpdatedAt: string = '';

  if (document?.updatedAt) {
    lastUpdatedAt = getDate(document?.updatedAt);
  }

  // Handling Rename api request
  const renameDocument = async (): Promise<void> => {
    if (documentNameRef.current?.innerHTML) {
      await axios.patch(`/documents/d/rename/${documentId}`, {
        documentName: documentNameRef.current.innerHTML,
      });
    }
  };

  // handle blur of the rename input div
  const handleDocumentNameBlur = async (): Promise<void> => {
    if (documentNameRef.current?.innerHTML === '') {
      documentNameRef.current.innerHTML = 'Untitled_Document';
    }
    await renameDocument();
  };

  // Preventing the rename div to add line break when pressing enter
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent): Promise<void> => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent line breaks
        if (documentNameRef.current) documentNameRef.current.blur();
      }
    };

    const editableDiv = documentNameRef.current;
    if (editableDiv) {
      editableDiv.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (editableDiv) {
        editableDiv.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  socket.on('update-active-users', data => {
    setActiveUsers(data);
  });

  // Handling closing of the more options modal when click outside the button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        activeUsersRef.current &&
        !activeUsersRef.current.contains(event.target as Node)
      ) {
        setActiveUsersVisibility(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="WRAPPER flex w-full h-[4rem] justify-between items-center box-border z-10 bg-documentBackground">
      <div className="HEADER-LEFT flex w-auto items-center">
        <Link to="/" className="LOGO text-5xl font-bold leading-none mr-1">
          <span className="text-primaryDark">
            T<span className="text-primary">c</span>
          </span>
        </Link>
        <div className="DOCUMENT-INFORMATION flex flex-col items-start w-auto h-auto">
          <div className="flex items-center w-auto gap-2">
            <div
              ref={documentNameRef}
              className="max-w-[50vw] w-auto h-7 px-2 border-none text-lg font-medium overflow-hidden whitespace-nowrap focus:outline-primary"
              contentEditable="true"
              onBlur={handleDocumentNameBlur}
            >
              {document?.documentName}
            </div>
            {isSaving ? (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <CircularLoader size={'size-4'} border="border border-[3px]" /> saving...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-gray-500"><MdOutlineCloudDone /> Saved to cloud</span>
            )}
          </div>
          <div className="flex items-center gap-0 w-auto h-auto text-sm">
            <button className="px-2 py-[2px] rounded-sm hover:bg-primaryLight hover:bg-opacity-30">
              Download PDF
            </button>
            <button className="px-2 py-[2px] rounded-sm hover:bg-primaryLight hover:bg-opacity-30">
              Download Doc
            </button>
            <Link
              to="/user/documents"
              className="px-2 py-[2px] rounded-sm hover:bg-primaryLight hover:bg-opacity-30"
            >
              All Documents
            </Link>
            <span className="ml-2 text-gray-500 font-light">Last updated at {lastUpdatedAt}</span>
          </div>
        </div>
      </div>
      <div className="HEADER-RIGHT flex items-center gap-3 w-auto">
        <div className='relative'>
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="flex justify-center items-center text-2xl text-primaryDark mr-2"
            onClick={() => setActiveUsersVisibility(!activeUsersVisibility)}
          >
            <FaUserGroup />
          </motion.button>
          {activeUsersVisibility ? <span ref={activeUsersRef}><ActiveUsersModal activeUsers={activeUsers}/></span> : null}
        </div>
        <button
          className={`SHARE flex justify-center items-center gap-2 w-32 h-10 bg-primary ${buttonHoverAnimaiton} hover:bg-primaryDark text-white rounded-full`}
          onClick={() => setShowShareModa(!showShareModal)}
        >
          <IoEarthSharp />
          Share
        </button>
        <span className="PROFILE size-8 rounded-full bg-gray-300"></span>
      </div>
      {showShareModal ? <ShareModal document={document}/> : null}
    </div>
  );
};
export default EditorHeader;
