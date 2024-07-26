import { useRef } from 'react';
import axios from '../axios.config';

interface props {
  name: string;
  documentId: string;
  setShowRenameModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
}

const RenameModel: React.FC<props> = ({ name, documentId, setShowRenameModal, setNewName }) => {
  const nameRef = useRef<HTMLInputElement>(null);

  // Handling click propogation
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // Handling rename api request
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (nameRef.current && name !== nameRef.current.value) {
        await axios.patch(`/documents/d/rename/${documentId}`, {
          documentName: nameRef.current.value,
        });
        setNewName(nameRef.current.value)
      }
    } catch (error) {
      console.log(error, 'Error renaming the document');
    }
    setShowRenameModal(false);
  };

  const handleReset = () => {
    setShowRenameModal(false);
  };

  return (
    <div
      className="WRAPPER fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-[#666666] bg-opacity-75 pointer-events-auto"
      onClick={handleClick}
    >
      <form
        className="MAIN-CONTAINER w-96 h-48 flex flex-col justify-center gap-4 items-start p-7 bg-white rounded-lg"
        onSubmit={e => handleSubmit(e)}
        method="post"
        onReset={handleReset}
      >
        <span className="RENAME-HEADING text-2xl font-light">Rename</span>
        <input
          ref={nameRef}
          type="text"
          defaultValue={name}
          className="INPUT-FIELD w-full h-8 outline-none border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-primary overflow-hidden"
        ></input>
        <div className="w-full flex justify-end items-center gap-4 capitalize">
          <button
            type="reset"
            className="CANCEL-BUTTON border text-primary border-gray-200 rounded-[4px] w-24 py-2 hover:border-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="OK-BUTTON bg-primary text-white rounded-[4px] w-24 py-2 uppercase hover:bg-primaryDark"
          >
            OK
          </button>
        </div>
      </form>
    </div>
  );
};

export default RenameModel;
