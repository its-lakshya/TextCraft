import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { buttonHoverAnimaiton } from '../../utils/Tailwind.utils';
import { IoEarthSharp } from 'react-icons/io5';
import axios from '../../axios.config';
import { getDate } from '../../utils/Date.utils';
import { CircularLoader } from '../../components/loader/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { FaUserGroup } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import ActiveUsersModal from '../../modals/ActiveUsers.modal';
import { MdOutlineCloudDone } from 'react-icons/md';
import ShareModal from '../../modals/Share.modal';
import ProfileModal from '../../modals/Profile.modal';
import { ActiveUsers, EditorProps } from '../../types/Global.types';
import { IoIosHeart, IoMdHeartEmpty } from 'react-icons/io';

const EditorHeader: React.FC<EditorProps> = ({ documentData, socket }) => {
  const location = useLocation();
  const profileRef = useRef<HTMLSpanElement>(null);
  const activeUsersRef = useRef<HTMLDivElement>(null);
  const documentNameRef = useRef<HTMLDivElement>(null);
  const currentLocation = location.pathname.split('/');
  const [profileModal, setProfileModal] = useState(false);
  const user = useSelector((store: RootState) => store.auth);
  const documentId = currentLocation[currentLocation.length - 1];
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUsers[]>();
  const isSaving = useSelector((store: RootState) => store.docSaving.isSaving);
  const [activeUsersVisibility, setActiveUsersVisibility] = useState<boolean>(false);
  const [favourite, setFavourite] = useState<boolean>(false);
  const [isFavouriteSaving, setIsFavouriteSaving] = useState<boolean>(false);

  let lastUpdatedAt: string = '';

  // Extracting last update data
  if (documentData?.updatedAt) {
    lastUpdatedAt = getDate(documentData?.updatedAt);
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

  const handleFavourite = async (): Promise<void> => {
    setIsFavouriteSaving(true);
    try {
      const response = await axios.post(`/favourite/d/${documentId}`);
      setFavourite(response.data.data.isFavourite);
    } catch (error) {
      console.log(error, 'Error while toggling favourite status');
      setFavourite(false);
    }
    setIsFavouriteSaving(false);
  };

  // Calling api to check favourite status of the document
  const checkIsFavourite = async (): Promise<void> => {
    try {
      const response = await axios.get(`/favourite/d/${documentId}`);
      setFavourite(response.data.data.isFavourite);
    } catch (error) {
      console.log(error, 'Error while checking is favourite or either it is favourite ');
      setFavourite(false);
    }
  };

  // Calling checkIsFavourite function
  useEffect(() => {
    checkIsFavourite();
  }, []);

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

  // Listening soket update-active-user event
  socket.on('update-active-users', data => {
    setActiveUsers(data);
  });

  // Handling closing of the active user modal when click outside the button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (activeUsersRef.current && !activeUsersRef.current.contains(event.target as Node)) {
        setActiveUsersVisibility(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handling closing of profile model when clicked outsied
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileModal(false);
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
              {documentData?.documentName}
            </div>
            <motion.span
              whileHover={{ scale: 1.2 }}
              className={`flex justify-center items-center size-6 rounded-full hover:bg-gray-200 cursor-pointer`}
              onClick={() => handleFavourite()}
            >
              {isFavouriteSaving ? (
                <CircularLoader size={'size-4'} border="border border-[3px]" />
              ) : !favourite ? (
                <span className="text-lg text-gray-600 font-bold">
                  <IoMdHeartEmpty />{' '}
                </span>
              ) : (
                <span className="text-lg text-primary">
                  <IoIosHeart />
                </span>
              )}
            </motion.span>
            {isSaving ? (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <CircularLoader size={'size-4'} border="border border-[3px]" /> saving...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <MdOutlineCloudDone /> Saved to cloud
              </span>
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
        <div
          className="relative"
          ref={activeUsersRef}
          onClick={() => setActiveUsersVisibility(!activeUsersVisibility)}
        >
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="flex justify-center items-center text-2xl text-primaryDark mr-2"
          >
            <FaUserGroup />
          </motion.button>
          {activeUsersVisibility ? (
            <span>
              <ActiveUsersModal activeUsers={activeUsers} />
            </span>
          ) : null}
        </div>
        <button
          className={`SHARE flex justify-center items-center gap-2 w-32 h-10 bg-primary ${buttonHoverAnimaiton} hover:bg-primaryDark text-white rounded-full`}
          onClick={() => setShowShareModal(!showShareModal)}
        >
          <IoEarthSharp />
          Share
        </button>
        <div className="relative">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={user.profileImage}
            alt="img"
            className="size-8 bg-gray-300 rounded-full cursor-pointer"
            onClick={() => setProfileModal(!profileModal)}
          />
          {profileModal ? (
            <span ref={profileRef}>
              <ProfileModal setProfileModal={setProfileModal} />{' '}
            </span>
          ) : null}
        </div>
      </div>
      {showShareModal ? (
        <ShareModal document={documentData} setShowShareModal={setShowShareModal} />
      ) : null}
    </div>
  );
};

export default EditorHeader;
