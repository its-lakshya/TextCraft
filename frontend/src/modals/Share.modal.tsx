import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/Store';
import { MdLockPerson } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { IoLink } from 'react-icons/io5';
import axios from '../axios.config';
import { useLocation } from 'react-router-dom';
import { setShowToast } from '../store/slices/Toast.slice';
import { FaRegEye } from 'react-icons/fa6';
import { FaUserEdit } from 'react-icons/fa';

interface Document {
  createdAt: string;
  documentName: string;
  content: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface ShareProps {
  document: Document | undefined;
}

interface publicAccess {
  tag: string;
  description: string;
}

const ShareModal: React.FC<ShareProps> = ({ document }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentLocation = location.pathname.split('/');
  const user = useSelector((store: RootState) => store.auth);
  const documentId = currentLocation[currentLocation.length - 1];
  const [publicAccessType, setPublicAccessType] = useState<string>('Viewer');
  const [showPublicAccessModal, setShowPublicAccessModal] = useState<boolean>(false);
  const [showPublicAccessTypeModal, setShowPublicAccessTypeModal] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<publicAccess>({ tag: '', description: '' });

  const restricted = {
    tag: 'Restricted',
    description: 'Only people with access can open with the link',
  };

  const anyoneWithLink = {
    tag: 'Anyone with the link',
    description: `Anyone on the internet with the link can ${publicAccessType}`,
  };

  const handlePublicAccess = async (isPublic: boolean) => {
    try {
      await axios.post(`/collaborations/c/${documentId}/public`, { isPublic });
      if (isPublic) {
        setIsPublic({ tag: anyoneWithLink.tag, description: anyoneWithLink.description });
        dispatch(
          setShowToast({
            showToast: true,
            message: 'Document is public now',
            type: 'SUCCESS',
            timing: 3000,
          }),
        );
      } else {
        setIsPublic({ tag: restricted.tag, description: restricted.description });
        dispatch(
          setShowToast({
            showToast: true,
            message: 'Document is remove from public',
            type: 'SUCCESS',
            timing: 3000,
          }),
        );
      }
    } catch (error) {
      if ((error as Error)?.message === 'Request failed with status code 400' && isPublic) {
        dispatch(
          setShowToast({
            showToast: true,
            message: 'Document is already public',
            type: 'UNAUTHORIZED',
            timing: 3000,
          }),
        );
      } else if ((error as Error)?.message === 'Request failed with status code 400' && !isPublic) {
        dispatch(
          setShowToast({
            showToast: true,
            message: 'Document is already private',
            type: 'UNAUTHORIZED',
            timing: 3000,
          }),
        );
      } else if ((error as Error)?.message === 'Request failed with status code 405') {
        dispatch(
          setShowToast({
            showToast: true,
            message: 'You are not authorized',
            type: 'UNAUTHORIZED',
            timing: 3000,
          }),
        );
      } else {
        dispatch(
          setShowToast({
            showToast: true,
            message: 'Oop! please try again',
            type: 'DEFAULT',
            timing: 3000,
          }),
        );
      }
      console.log(error, 'Error while updating public status');
    }
    setShowPublicAccessModal(false);
  };

  const handlePublicAccessType = async (publicAccessType: string) => {
    try {
      await axios.post(`/collaborations/c/${documentId}/public/access`, publicAccessType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/collaborations/c/${documentId}/public/access`);
        setIsPublic({ tag: anyoneWithLink.tag, description: anyoneWithLink.description });
        if (response.data.data.publicAccessType === 'read') setPublicAccessType('Viewer');
        else setPublicAccessType('Editor');
      } catch (error) {
        console.log(error);
        if ((error as Error)?.message === 'Request failed with status code 405') {
          setIsPublic({ tag: restricted.tag, description: restricted.description });
        }
      }
    })();
  }, []);

  return (
    <div className="WAPPER fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-300 bg-opacity-50 backdrop-blur-sm text-black font-light">
      <div className="MAIN-CONTAINER flex flex-col gap-6 py-6 bg-white w-[35vw] h-auto rounded-lg">
        <div className="DOCUMENT-NAME text-2xl px-6">Share "{document?.documentName}" </div>
        <input
          placeholder="Search and add people"
          className="SEARCH  h-12 border border-gray-300 rounded-md px-4 mx-6 text-sm focus:outline-primary"
        ></input>
        <div className="PEOPLE-WITH-ACCESS flex flex-col gap-2">
          <span className="font-medium px-6">People with access</span>
          <div className="LIST-OF-PEOPLE w-full max-h-44 h-auto overflow-scroll">
            <div className="relative OWNER flex items-center gap-4 w-full h-14 px-6 cursor-pointer hover:bg-primaryExtraLight">
              <img src={user.profileImage} alt="img" className="size-9 rounded-full" />
              <div className="flex flex-col gap-0 text-sm font-medium">
                {user.fullName} (you)
                <span className="text-xs font-light h-auto leading-none">{user.email}</span>
              </div>
              <span className="absolute right-6 text-sm text-gray-400 font-light">Owner</span>
            </div>
          </div>
        </div>
        <div className="GENERAL-ACCESS">
          <span className="font-medium px-6">General access</span>
          <div className="relative OWNER flex items-center gap-2 w-full h-14 px-6 cursor-pointer hover:bg-primaryExtraLight">
            <span className="size-9 flex items-center justify-center text-xl bg-primaryLight rounded-full">
              <MdLockPerson />
            </span>
            <div className="flex flex-col items-start text-sm font-medium">
              <span className="relative flex items-center h-7 px-2 hover:bg-zinc-300 rounded-md">
                <span
                  onClick={() => setShowPublicAccessModal(!showPublicAccessModal)}
                  className="flex items-center gap-2"
                >
                  {isPublic?.tag} <IoMdArrowDropdown />
                </span>
                {showPublicAccessModal ? (
                  <div
                    className="absolute top-6 flex flex-col justify-center items-start py-2 w-44 h-auto bg-white rounded-[4px]"
                    style={{
                      boxShadow:
                        'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                    }}
                  >
                    <span
                      className="flex items-center w-full h-8 px-2 hover:bg-primaryExtraLight"
                      onClick={() => handlePublicAccess(false)}
                    >
                      {restricted.tag}
                    </span>
                    <span
                      className="flex items-center w-full h-8 px-2 hover:bg-primaryExtraLight"
                      onClick={() => handlePublicAccess(true)}
                    >
                      {anyoneWithLink.tag}
                    </span>
                  </div>
                ) : null}
              </span>
              <span className="text-xs font-light ml-2">{isPublic?.description}</span>
            </div>
            <button
              className={`absolute flex items-center h-9 px-3 gap-2 right-6 text-sm font-normal rounded-[4px] hover:bg-zinc-300 ${isPublic.tag === 'Restricted' ? 'pointer-events-none text-gray-400 font-light' : null} `}
            >
              <span
                className="flex items-center gap-2"
                onClick={() => setShowPublicAccessTypeModal(!showPublicAccessTypeModal)}
              >
                {publicAccessType}
                <IoMdArrowDropdown />
              </span>
              {showPublicAccessTypeModal ? (
                <div
                  className="absolute top-10 flex flex-col justify-center items-start py-2 w-28 h-auto bg-white rounded-[4px]"
                  style={{
                    boxShadow:
                      'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                  }}
                >
                  <span
                    className="flex items-center gap-2 w-full h-8 px-4 hover:bg-primaryExtraLight"
                    onClick={() => handlePublicAccessType('read')}
                  >
                    <FaRegEye /> Viewer
                  </span>
                  <span
                    className="flex items-center gap-2 w-full h-8 px-4 hover:bg-primaryExtraLight"
                    onClick={() => handlePublicAccessType('write')}
                  >
                    <FaUserEdit /> Editor
                  </span>
                </div>
              ) : null}
            </button>
          </div>
        </div>
        <div className="BUTTONS flex justify-between items-center px-6">
          <button className="COPY flex justify-center items-center gap-2 h-10 w-36 border border-primary text-sm text-primary font-medium rounded-3xl hover:bg-primaryExtraLight">
            <span className="text-lg">
              <IoLink />
            </span>
            Copy link
          </button>
          <button className="DONE w-36 h-10 bg-primary hover:bg-primaryDark text-sm text-white font-medium rounded-3xl">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
