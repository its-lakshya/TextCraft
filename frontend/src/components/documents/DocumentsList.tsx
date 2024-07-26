import { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import DocumentCard from './DocumentCard';
import axios from '../../axios.config';
import { useNavigate } from 'react-router-dom';

enum Owner {
  Anyone = 'Owned by anyone',
  Me = 'Owned by me',
  Shared = 'Shared with me',
}
interface Document {
  createdAt: string;
  documentName: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

const DocumentsList: React.FC = () => {
  const navigate = useNavigate();
  const ownerRef = useRef<HTMLDivElement>(null);
  const ownerListRef = useRef<HTMLDivElement>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner>(Owner.Anyone);
  const [documents, setDocument] = useState<Document[]>();
  const [ownerModelVisibility, setOwnerModelVisibility] = useState<string>('hidden');
  const [callApi, setCallApi] = useState<boolean>(false);

  const handleShowOwnerRefs = (): void => {
    if (ownerModelVisibility === 'hidden') setOwnerModelVisibility('visible');
    else setOwnerModelVisibility('hidden');
  };

  const handleDocumentClick = (id: string): void => {
    navigate(`/document/${id}`);
  };

  // Handling clicking outside of the owners modal or button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        ownerRef.current != event.target &&
        ownerListRef.current &&
        !ownerListRef.current.contains(event.target as Node)
      ) {
        setOwnerModelVisibility('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDocuments = async (type: string): Promise<void> => {
    try {
      const response = await axios.get(`/documents/d/${type}`);
      setDocument(response.data.data);
    } catch (error) {
      console.log(error, 'Error getting documents');
    }
  };

  useEffect(() => {
    (async () => {
      await getDocuments('');
    })();
  }, [callApi]);

  const handleOwnerSelect = async (Owner: Owner): Promise<void> => {
    setSelectedOwner(Owner);
    switch (Owner) {
      case 'Owned by anyone':
        await getDocuments('');
        break;
      case 'Owned by me':
        await getDocuments('user');
        break;
      case 'Shared with me':
        await getDocuments('shared');
        break;
      default:
    }
  };

  return (
    <div className="flex flex-col gap-6 w-documentsPageWidth max-w-documentsPageMaxWidth h-auto">
      <div className="HEADER flex justify-between items-center w-full h-12">
        <span className="text-lg font-medium">Documents</span>
        <div
          className="relative flex justify-center items-center gap-2 outline-none w-44 h-6 text-sm text-gray-600 font-medium rounded-documentCard hover:bg-primaryLight hover:bg-opacity-30 cursor-pointer select-none"
          onClick={() => handleShowOwnerRefs()}
          ref={ownerRef}
        >
          {selectedOwner} <IoMdArrowDropdown />
          <div
            className={`absolute top-7 py-2 w-full h-auto rounded-documentCard ${ownerModelVisibility} bg-documentBackground`}
            style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
            ref={ownerListRef}
          >
            {[Owner.Anyone, Owner.Me, Owner.Shared].map((Owner, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleOwnerSelect(Owner)}
                  className="flex justify-start items-center w-full h-8 px-3 hover:bg-primaryLight hover:bg-opacity-30"
                >
                  {Owner}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="DOCUMENT-LIST flex flex-wrap  gap-[22.5px] w-full h-auto">
        {documents &&
          documents.map((document, index) => (
            <span key={index} onClick={() => handleDocumentClick(document._id)}>
              <DocumentCard data={document} setCallApi={setCallApi} />
            </span>
          ))}
      </div>
    </div>
  );
};

export default DocumentsList;
