import { motion } from 'framer-motion';
import { MdPlaylistAdd } from 'react-icons/md';

const CreateDocument: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-[10vw] mt-[4rem] w-full h-[20rem] max-h-[20rem] bg-primaryDark text-white">
      <div className='flex justify-center items-center gap-[10vw] w-documentsPageWidth max-w-documentsPageMaxWidth'>
        <motion.button
          className="CREATE-DOCUMENT flex justify-center items-center w-36 h-48 bg-white text-6xl text-[#EA4336] rounded-documentCard"
          initial={{ scale: 100 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.span
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeIn', delay: 0.5 }}
          >
            <MdPlaylistAdd />
          </motion.span>
        </motion.button>
        <div className="TEXT flex flex-col justify-center items-center h-full">
          <div className="HEADING flex gap-0 text-5xl text-white font-semibold">
            Just click and create
            <span className="animate-bounce text-[3.2vw]">!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;