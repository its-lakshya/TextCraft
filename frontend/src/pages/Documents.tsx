import DocumentsHeader from '../components/documents/DocumentsHeader';
import { MdPlaylistAdd } from 'react-icons/md';
import { motion } from 'framer-motion';

const Documents = () => {
  return (
    <div className="WRAPPER flex flex-col w-full bg-documentBackground">
      <DocumentsHeader />
      <div className="flex justify-center items-center gap-[10vw] mt-[4rem] w-full h-[20rem] max-h-[20rem] bg-primaryDark text-white">
        <motion.button className="CREATE-DOCUMENT flex justify-center items-center w-36 h-48 bg-white text-6xl text-[#EA4336]"
          initial = {{scale: 100}}
          animate = {{scale: 1}}
          transition = {{duration: 0.8, ease: 'easeInOut'}}
          whileHover={{scale: 1.1}}
        >
          <MdPlaylistAdd />
        </motion.button>
        <div className="TEXT flex flex-col justify-center items-center h-full">
          <div className="HEADING flex gap-0 text-5xl text-white font-semibold">
            Just click and create
            <span className='animate-bounce text-6xl'>
              !
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
