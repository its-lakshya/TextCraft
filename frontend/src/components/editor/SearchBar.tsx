import { useEffect, useRef, useState } from 'react';
import axios from '../../axios.config';
import { Collaborator, SearchProps, User } from '../../types/Global.types';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { CircularLoader } from '../loader/Loader';
import { IoMdArrowDropdown } from 'react-icons/io';

const SearchBar: React.FC<SearchProps> = ({ setIsLoading, collaborators }) => {
  const accessRef = useRef<HTMLDivElement>(null);
  const searchedUserRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentLocation = location.pathname.split('/');
  const documentId = currentLocation[currentLocation.length - 1];
  const [searchedUser, setSearchedUser] = useState<User>();
  const [searching, setSearching] = useState<boolean>(false);
  const [alreadyACollaborator, setAlreadyACollaborator] = useState<Collaborator>();
  const [accessTypeModal, setAccessTypeModal] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    setSearching(true);
    try {
      const response = await axios.post('/users/find-user', { email: form.search.value });
      setSearchedUser(response.data.data);
      const collaborator = collaborators?.find(collaborator => {
        return collaborator._id === response.data.data._id;
      });

      if (collaborator) {
        setAlreadyACollaborator(collaborator);
      }
    } catch (error) {
      console.log(error, 'Error while fetching user details');
    }
    setSearching(false);
  };

  const handleChange = (): void => {
    setSearchedUser(undefined);
    setAlreadyACollaborator(undefined);
  };

  // Handling access permission of the already collaborator
  const handleCollaboratorPermission = async (accessType: string) => {
    try {
      await axios.patch(`collaborations/c/${documentId}`, { email: searchedUser?.email, accessType });
    } catch (error) {
      console.log(error, 'Error while updating access type of the collaborator');
    }
  };

  const handleAddUser = async (accessType: string): Promise<void> => {
    setIsLoading(true);
    if(alreadyACollaborator){
      handleCollaboratorPermission(accessType)
    }else{
      try {
        await axios.post(`/collaborations/c/${documentId}`, {
          email: searchedUser?.email,
          accessType,
        });
      } catch (error) {
        console.log(error, 'Error while adding user and collaborator');
      }

    }
    setSearchedUser(undefined);
  };

  const handleRemoveCollaborator = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/collaborations/c/${documentId}/remove`, { email: searchedUser?.email });
    } catch (error) {
      console.log(error, 'Error while removing collaborator from document');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (accessRef.current && !accessRef.current.contains(event.target as Node)) {
        setAccessTypeModal(false);
      }

      if (searchedUserRef.current && !searchedUserRef.current.contains(event.target as Node)) {
        setSearchedUser(undefined);
        setAlreadyACollaborator(undefined);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form
      className="relative flex justify-between items-center w-full h-12 px-6"
      onSubmit={event => handleSubmit(event)}
    >
      <input
        name="search"
        placeholder="Search with email and add people"
        className="SEARCH h-full border border-gray-300 rounded-md px-4 text-sm focus:outline-primary"
        style={{ width: 'calc(100% - 8rem)' }}
        onChange={() => handleChange()}
      ></input>
      <button
        type="submit"
        className="flex justify-center items-center w-28 h-full bg-primary text-white rounded-md hover:bg-primaryDark"
      >
        {searching ? <CircularLoader size={'size-5'} border="border border-[3px]" /> : 'Search'}
      </button>
      {searchedUser ? (
        <motion.div
          ref={searchedUserRef}
          whileHover={{ scale: 1.05 }}
          className="absolute flex items-center gap-4 w-[91%] top-14 h-16 bg-primaryExtraLight px-4 rounded-md z-10 cursor-pointer"
          style={{
            boxShadow:
              'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
          }}
        >
          <img src={searchedUser.profileImage} alt="img" className="size-10 rounded-full" />
          <div className="flex flex-col font-medium leading-none">
            <span>{searchedUser.fullName}</span>
            <span className="text-sm text-gray-600 font-light">{searchedUser.email}</span>
          </div>
          <div className="absolute right-4 flex items-center gap-2 text-xs font-normal ">
            {alreadyACollaborator ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative flex justify-center items-center gap-2 bg-zinc-300 w-24 h-8 rounded-md cursor-pointer"
                onClick={() => handleRemoveCollaborator()}
              >
                Remove
              </motion.div>
            ) : null}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative flex justify-center items-center gap-2 bg-zinc-300 w-24 h-8 rounded-md cursor-pointer"
              onClick={() => setAccessTypeModal(!accessTypeModal)}
              ref={accessRef}
            >
              {alreadyACollaborator?.accessType === 'write' ? 'Editor' : 'Viewer'}
              <IoMdArrowDropdown />
              {accessTypeModal ? (
                <div
                  className="absolute w-full top-9 py-1 bg-white rounded-md"
                  style={{
                    boxShadow:
                      'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                  }}
                >
                  <div
                    className="flex justify-center items-center h-6 w-full px-2 hover:bg-primaryExtraLight"
                    onClick={() => handleAddUser('read')}
                  >
                    Viewer
                  </div>
                  <div
                    className="flex justify-center items-center h-6 w-full px-2 hover:bg-primaryExtraLight"
                    onClick={() => handleAddUser('write')}
                  >
                    Editor
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </form>
  );
};
export default SearchBar;
