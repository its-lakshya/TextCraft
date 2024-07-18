import { motion } from 'framer-motion';
import ImproveWorkFlowImage from '../../assets/images/ImproveWorkFlowImage.jpg';
import { FaArrowRightLong } from 'react-icons/fa6';

const ImproveWorkFlow = () => {
  const tableCellStyle: string =
    'flex justify-center items-center w-44 h-12 bg-[#F1F5F9] text-center border border-[#CBD5E1] text-black';
  return (
    <div className="WRAPPER flex justify-center items-center w-full h-[560px] bg-white p-rootXPadd">
      <div className="WORK-FLOW flex justify-between items-center w-full h-full py-12">
        <div className="TEXT flex flex-col justify-around items-start w-full h-full">
          <span className="TITLE text-[3.5vw] leading-none font-bold w-full">Improve workflow</span>
          <div className="flex font-medium">
            <span className={`${tableCellStyle} rounded-tl-md rounded-bl-md`}>Effortless</span>
            <span className={`${tableCellStyle}`}>Streamlined</span>
            <span className={`${tableCellStyle} rounded-tr-md rounded-br-md`}>Efficient</span>
          </div>

          <span className="DESCRIPTION text-lg">
            Edit together in real time with easy sharing, With TextCraft, everyone’s working on the
            latest version of a document. And with edits automatically saved in version history,
            it’s easy to track or undo changes.
          </span>
          <button className="flex justify-center items-center gap-2 text-primary group">
            Get started for free{' '}
            <span className="group-hover:animate-arrowMove relative">
              <FaArrowRightLong />
            </span>
          </button>
        </div>
        <motion.div className="IMAGE w-full" whileHover={{ scale: 0.95 }} transition={{duration: 0.3}}>
          <img src={ImproveWorkFlowImage} alt="img" className='w-full'/>
        </motion.div>
      </div>
    </div>
  );
};

export default ImproveWorkFlow;
