import { buttonHoverAnimaiton } from '../../utils/TailwindUtils';
import { FaArrowRightLong } from 'react-icons/fa6';
import LandingPageBackground from '../../assets/images/LandingPageBackground.svg';
import LandingPageImage from '../../assets/images/LandingPageImage.avif';
import { motion } from 'framer-motion';

const Landing = () => {
  const text = 'Unite Ideas. Write Together.'.split('');
  return (
    <div
      className={`LANDING-PAGE flex flex-col justify-center items-center gap-20 w-screen h-auto py-20`}
      style={{ backgroundImage: `url(${LandingPageBackground})` }}
    >
      <div className="TEXT-SECTION flex flex-col justify-center items-center gap-10">
        <span className="TAG-LINE text-[5vw] leading-none text-black font-extrabold">
          {text.map((letter, index) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index / 20 }}
              key={index}
            >
              {letter}
            </motion.span>
          ))}
        </span>
        <span className="DESCRIPTION w-[60vw] text-center text-[18px]">
          Designed for teams to effortlessly create and innovate together, enhance productivity in
          every document. <br />
          Streamline teamwork with synchronized edits and real-time feedback.
        </span>
        <button
          className={`START-BUTTON flex justify-center items-center gap-3 bg-primary text-2xl text-white 
            capitalize font-medium px-10 py-3 rounded-full ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark group`}
        >
          Start for free
          <span className="ARROW group-hover:animate-arrowMove relative">
            <FaArrowRightLong />
          </span>
        </button>
      </div>
      <motion.div initial={{ opacity: 0, marginTop: '20rem' }}
                            animate={{ opacity: 1, marginTop: "0" }}
                            exit={{ opacity: 0, scale: 0 }} transition={{duration: 1}} className="IMAGE-CONTAINER flex justify-center items-center w-[78vw] h-[50vw] bg-white rounded-[20px] border-[6px] border-primaryDark">
        <img src={LandingPageImage} alt="img" className="w-full" />
      </motion.div >
    </div>
  );
};

export default Landing;
