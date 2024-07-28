import { ActiveUserprops } from '../types/Global.types';

const ActiveUsersModal: React.FC<ActiveUserprops> = ({ activeUsers }) => {
  return (
    <div
      className="WRAPPER absolute top-10 right-2 flex flex-col w-44 min-auto max-h-64 rounded-[4px] py-2 bg-white overflow-y-scroll overflow-x-hidden select-none"
      style={{
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
      }}
    >
      {activeUsers?.map((data, index) => {
        return (
          <span
            key={index}
            className="flex items-center gap-2 w-full h-8 px-4 overflow-auto hover:bg-primaryExtraLight cursor-pointer"
          >
            <img src={data.userDetails.profileImage} alt='img' className='size-6 rounded-full'/>
            {data.userDetails.userName}
          </span>
        );
      })}
    </div>
  );
};

export default ActiveUsersModal;
