import { BsThreeDotsVertical } from 'react-icons/bs';

interface Document {
  createdAt: string;
  documentName: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface DocumentCardProps {
  data: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ data }) => {
  const dateObj = new Date(data.updatedAt);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const month = monthNames[dateObj.getMonth()];
  const day = ('0' + dateObj.getDate()).slice(-2);
  const year = dateObj.getFullYear().toString();

  const formattedDate = `${month} ${day}, ${year}`;

  return (
    <div className="WRAPPER w-52 h-[330px] flex flex-col rounded-documentCard border border-gray-300 hover:border-primary overflow-hidden cursor-pointer">
      <div className="DOCUMENT-OVERVIEW w-full h-full bg-white"></div>
      <div className="DOCUMENT-INFORMATION flex flex-col w-full h-20 py-3 px-4 box-border border border-t-gray-300">
        <span className="text-sm font-medium">{data.documentName}</span>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-end">
            <div className="LOGO text-xl font-bold leading-none mr-1">
              <span className="text-primaryDark">
                T<span className="text-primary">c</span>
              </span>
            </div>
            <span className="text-xs text-gray-500 font-light">Opened {formattedDate}</span>
          </div>
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
