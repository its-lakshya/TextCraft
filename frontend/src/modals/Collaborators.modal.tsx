import { useEffect, useRef, useState } from 'react';
import { CollaboratorModalProps } from '../types/Global.types';
import axios from '../axios.config';
import { IoEyeSharp, IoPersonRemove } from 'react-icons/io5';
import { FaUserEdit } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../store/Store';

const CollaboratorsModal: React.FC<CollaboratorModalProps> = ({ collaborator, documentId }) => {
  const user = useSelector((store: RootState) => store.auth);
  const collaboratorAccessRef = useRef<HTMLButtonElement>(null);
  const collaboratorAccessTypeModal = useRef<HTMLDivElement>(null);
  const [accessType, setAccessType] = useState<string>(collaborator.accessType === 'read' ? 'Viewer' : 'Editor');
  const [showCollaboratorAccessTypeModal, setShowCollaboratorAccessTypeModal] = useState<boolean>(false);

    // handling removal of the collaborator from the document
  const handleRemoveCollaborator = async (email: string) => {
    try {
      await axios.post(`/collaborations/c/${documentId}/remove`, { email });
    } catch (error) {
      console.log(error, 'Error while removing collaborator from document');
    }
    setShowCollaboratorAccessTypeModal(false)
  };

  // Handling access permission of the collaborator
  const handleCollaboratorPermission = async (email: string, accessType: string) => {
    try {
      await axios.patch(`collaborations/c/${documentId}`, { email, accessType });
      if(accessType === 'read')  setAccessType('Viewer')
      else setAccessType('Editor')
    } catch (error) {
      console.log(error, 'Error while updating access type of the collaborator');
    }
    setShowCollaboratorAccessTypeModal(false)
  };

  // Handeling closing of the collaboration access type modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        collaboratorAccessRef.current &&
        !collaboratorAccessRef.current.contains(event.target as Node) &&
        collaboratorAccessTypeModal.current &&
        !collaboratorAccessTypeModal.current.contains(event.target as Node) &&
        !showCollaboratorAccessTypeModal
      ) {
        setShowCollaboratorAccessTypeModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      key={collaborator._id}
      className="relative OWNER flex items-center gap-4 w-full h-14 px-6 cursor-pointer hover:bg-primaryExtraLight"
    >
      <img src={collaborator.profileImage} alt="img" className="size-9 rounded-full" />
      <div className="flex flex-col gap-0 text-sm font-medium">
        {collaborator.fullName} {collaborator?._id === user._id ? '(you)' : null}
        <span className="text-xs font-light h-auto leading-none">{collaborator.email}</span>
      </div>
      <button className={`absolute right-6 text-sm`} ref={collaboratorAccessRef}>
        <span
          className={`flex justify-center items-center w-24 h-9 px-3 gap-2 right-6 text-sm font-normal rounded-[4px] hover:bg-zinc-300`}
          onClick={() => setShowCollaboratorAccessTypeModal(!showCollaboratorAccessTypeModal)}
          ref={collaboratorAccessRef}
        >
          {accessType}
          <IoMdArrowDropdown />
        </span>
        {showCollaboratorAccessTypeModal ? (
          <div
            ref={collaboratorAccessTypeModal}
            className="absolute -top-[3px] right-[100px] flex justify-center items-start py-1 w-auto font-normal h-auto bg-white rounded-[4px] z-50"
            style={{
              boxShadow:
                'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
            }}
          >
            <span
              className="flex items-center gap-2 w-full h-8 px-2 hover:bg-primaryExtraLight rounded-sm"
              onClick={() => handleRemoveCollaborator(collaborator.email)}
            >
              <IoPersonRemove /> Remove
            </span>
            <span
              className="flex items-center gap-2 w-full h-8 px-2 hover:bg-primaryExtraLight rounded-sm"
              onClick={() => handleCollaboratorPermission(collaborator.email, 'read')}
            >
              <IoEyeSharp /> Viewer
            </span>
            <span
              className="flex items-center gap-2 w-full h-8 px-2 hover:bg-primaryExtraLight rounded-sm"
              onClick={() => handleCollaboratorPermission(collaborator.email, 'write')}
            >
              <FaUserEdit /> Editor
            </span>
          </div>
        ) : null}
      </button>
    </div>
  );
};

export default CollaboratorsModal;
