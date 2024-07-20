import { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

enum Owner {
  Anyone = 'Owned by anyone',
  Me = 'Owned by me',
  Shared = 'Shared with me',
}

const DocumentsList: React.FC = () => {
  const ownerRef = useRef<HTMLDivElement>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner>(Owner.Anyone);

  const handleOwnerSelect = (Owner: Owner): void => {
    setSelectedOwner(Owner);
  };

  const handleShowownerRefs = (): void => {
    if (ownerRef.current){
      ownerRef.current.style.display = ownerRef.current.style.display === 'flex' ? 'none' : 'flex';
      ownerRef.current.style.flexDirection = 'column';
    }
  }


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ownerRef.current && !ownerRef.current.contains(event.target as Node)) {
        ownerRef.current.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-[80vw] h-auto">
      <div className="HEADER flex justify-between items-center w-full h-12">
        <span className="text-lg font-medium">Documents</span>
        <button className="relative flex justify-center items-center gap-2 outline-none w-44 h-6 text-sm text-gray-600 font-medium rounded-sm hover:bg-gray-200"
        onClick={handleShowownerRefs}
        >
          {selectedOwner} <IoMdArrowDropdown />
          <div
            ref={ownerRef}
            className="absolute top-7 py-2 w-full h-auto bg-transparent rounded-sm hidden"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
          >
            {[Owner.Anyone, Owner.Me, Owner.Shared].map((Owner, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleOwnerSelect(Owner)}
                  className="flex justify-start items-center w-full h-8 px-3 hover:bg-gray-200"
                >
                  {Owner}
                </button>
              );
            })}
          </div>
        </button>
      </div>
    </div>
  );
};

export default DocumentsList;
