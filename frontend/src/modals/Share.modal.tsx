import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/Store';
import { MdLockPerson } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';
import { IoEarthSharp, IoEyeSharp, IoLink } from 'react-icons/io5';
import axios from '../axios.config';
import { useLocation } from 'react-router-dom';
import { setShowToast } from '../store/slices/Toast.slice';
import { FaUserEdit } from 'react-icons/fa';
import { Collaborators, publicAccess, ShareProps, User } from '../types/Global.types';
import CollaboratorsModal from './Collaborators.modal';

const ShareModal: React.FC<ShareProps> = ({ document, setShowShareModal }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isPublicRef = useRef<HTMLSpanElement>(null)
  const publicAccessModal = useRef<HTMLDivElement>(null)
  const publicAccessRef = useRef<HTMLButtonElement>(null)
  const publicAccessTypeModal = useRef<HTMLDivElement>(null)

  const currentLocation = location.pathname.split('/');
  const documentId = currentLocation[currentLocation.length - 1];
  
  const user = useSelector((store: RootState) => store.auth);

  const [owner, setOwner] = useState<User>()
  const [accessType, setAccessType] = useState<string>('Viewer');
  const [collaborators, setCollaborators] = useState<Collaborators[]>();
  const [showPublicAccessModal, setShowPublicAccessModal] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<publicAccess>({ tag: '', description: '' });
  const [showPublicAccessTypeModal, setShowPublicAccessTypeModal] = useState<boolean>(false);


  const restricted = {
    tag: 'Restricted',
    description: 'Only people with access can open with the link',
  };

  const anyoneWithLink = {
    tag: 'Anyone with the link',
    description: `Anyone on the internet with the link can be `,
  };

  const handleAccess = async () => {
    try {
      const response = await axios.post(`/public/${documentId}`);
      if(response.data.data.isPublic){
        setIsPublic({ tag: anyoneWithLink.tag, description: anyoneWithLink.description });
        dispatch(setShowToast({ showToast: true, message: 'Document is public now', type: 'SUCCESS', timing: 3000 }));
      }
      else{
        setIsPublic({ tag: restricted.tag, description: restricted.description });
        setAccessType('Viewer');
        dispatch( setShowToast({ showToast: true, message: 'Document is no longer public', type: 'SUCCESS', timing: 3000 }))}
    } catch (error) {
       if ((error as Error)?.message === 'Request failed with status code 405') {
        dispatch(setShowToast({ showToast: true, message: 'You are not authorized', type: 'UNAUTHORIZED', timing: 3000 }));
      } else {
        dispatch(setShowToast({ showToast: true, message: 'Oop! please try again', type: 'DEFAULT', timing: 3000 }));
      }
      console.log(error, 'Error while updating public status');
    }
    setShowPublicAccessModal(false);
  };

  const handleAccessType = async (accessType: string) => {
    try {
      await axios.post(`/public/${documentId}/access`, { accessType });
      if (accessType === 'read') {
        setAccessType('Viewer');
        dispatch(setShowToast({ showToast: true, message: 'Public access is set to view', type: 'SUCCESS', timing: 3000 }));
      } else {
        setAccessType('Editor');
        dispatch( setShowToast({ showToast: true, message: 'Public access is set to edit', type: 'SUCCESS', timing: 3000 }));
      }
    } catch (error) {
      if ((error as Error)?.message === 'Request failed with status code 405'){
        dispatch( setShowToast({ showToast: true, message: 'You are not authorized', type: 'UNAUTHORIZED', timing: 3000 }));
      }
      console.log(error, "Error while setting public access types");
    }
  };

  const getPublicAccessTypes = async () => {
    try {
      const response = await axios.get(`/public/${documentId}`);
      setIsPublic({ tag: anyoneWithLink.tag, description: anyoneWithLink.description });
      if (response.data.data.accessType === 'read') setAccessType('Viewer');
      else setAccessType('Editor');
    } catch (error) {
      console.log(error);
      setIsPublic({ tag: restricted.tag, description: restricted.description });
    }
  };

  const getCollaborators = async () => {
    try {
      const response = await axios.get(`/collaborations/c/${documentId}`);
      setCollaborators(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOwner = async () => {
    try{
      const owner = await axios.get(`/documents/d/${documentId}/owner`);
      setOwner(owner.data.data)
    }catch(error){
      console.log(error, "Error while fetching the owner details");
    }
  }

  useEffect(() => {
    getPublicAccessTypes();
    getCollaborators();
    getOwner();
  }, []);

  // Handling closing of public access and access types modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (isPublicRef.current && !isPublicRef.current.contains(event.target as Node)) setShowPublicAccessModal(false);
      if (publicAccessRef.current && !publicAccessRef.current.contains(event.target as Node)) setShowPublicAccessTypeModal(false);
      // if (collaboratorAccessRef.current && !collaboratorAccessRef.current.contains(event.target as Node)) setShowCollaboratorAccessTypeModal('');
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="WAPPER fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-300 bg-opacity-50 backdrop-blur-sm text-black font-light select-none">
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
              <img src={owner?.profileImage} alt="img" className="size-9 rounded-full" />
              <div className="flex flex-col gap-0 text-sm font-medium">
                {owner?.fullName} {owner?._id === user._id ? '(you)' : null}
                <span className="text-xs font-light h-auto leading-none">{owner?.email}</span>
              </div>
              <span className="absolute right-6 text-sm text-gray-400 font-light">Owner</span>
            </div>

            {collaborators &&
              collaborators?.map((collaborator) => {
                return (
                  <CollaboratorsModal collaborator={collaborator} documentId={documentId}/>
                );
              })}

          </div>
        </div>

        <div className="GENERAL-ACCESS">
          <span className="font-medium px-6">General access</span>

          <div className="relative OWNER flex items-center gap-2 w-full h-14 px-6 cursor-pointer hover:bg-primaryExtraLight">

            <span className="size-9 flex items-center justify-center text-xl bg-primaryLight rounded-full">
              {isPublic.tag === 'Restricted' ? <MdLockPerson /> : <IoEarthSharp />}
            </span>

            <div className="flex flex-col items-start text-sm font-medium">
              <span className="relative flex items-center" ref={isPublicRef}>
                <span
                  onClick={() => setShowPublicAccessModal(!showPublicAccessModal)}
                  className="flex items-center h-7 px-2 gap-2 hover:bg-zinc-300 rounded-md"
                >
                  {isPublic?.tag} <IoMdArrowDropdown />
                </span>
                {showPublicAccessModal ? (
                  <div
                    ref={publicAccessModal}
                    className="absolute top-6 flex flex-col justify-center items-start py-2 w-44 h-auto bg-white rounded-[4px]"
                    style={{
                      boxShadow:
                        'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                    }}
                  >
                    <span
                      className="flex items-center w-full h-8 px-4 hover:bg-primaryExtraLight"
                      onClick={() => handleAccess()}
                    >
                      {isPublic.tag !== 'Restricted' ? restricted.tag : anyoneWithLink.tag }
                    </span>
                  </div>
                ) : null}
              </span>
              <span className="text-xs font-light ml-2">{isPublic?.description} {isPublic.tag !== 'Restricted' ? accessType : null}</span>
            </div>

            <button className={`absolute right-6 text-sm`} ref={publicAccessRef}>
              <span
                className={`flex justify-center items-center w-24 h-9 px-3 gap-2 right-6 text-sm font-normal rounded-[4px] hover:bg-zinc-300 ${isPublic.tag === 'Restricted' ? 'pointer-events-none text-gray-400 font-light' : null} `}
                onClick={() => setShowPublicAccessTypeModal(!showPublicAccessTypeModal)}
              >
                {accessType}
                <IoMdArrowDropdown />
              </span>
              {showPublicAccessTypeModal ? (
                <div
                  ref={publicAccessTypeModal}
                  className="absolute top-10 left-0 flex flex-col justify-center items-start py-2 w-28 font-normal h-auto bg-white rounded-[4px]"
                  style={{
                    boxShadow:
                      'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                  }}
                >
                  <span
                    className="flex items-center gap-2 w-full h-8 px-4 hover:bg-primaryExtraLight"
                    onClick={() => handleAccessType('read')}
                  >
                    <IoEyeSharp /> Viewer
                  </span>
                  <span
                    className="flex items-center gap-2 w-full h-8 px-4 hover:bg-primaryExtraLight"
                    onClick={() => handleAccessType('write')}
                  >
                    <FaUserEdit /> Editor
                  </span>
                </div>
              ) : null}
            </button>

          </div>
        </div>

        <div className="BUTTONS flex justify-between items-center px-6">

          <button className={`COPY flex justify-center items-center gap-2 h-10 w-36 border border-primary text-sm text-primary font-medium rounded-3xl hover:bg-primaryExtraLight ${collaborators?.length === 0 && isPublic.tag === 'Restricted' ? 'pointer-events-none opacity-40' : null}`}>
            <span className="text-lg">
              <IoLink />
            </span>
            Copy link
          </button>

          <button className="DONE w-36 h-10 bg-primary hover:bg-primaryDark text-sm text-white font-medium rounded-3xl"
          onClick={() => setShowShareModal(false)}
          >
            Done
          </button>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;
