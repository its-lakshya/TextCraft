import { FaGithub, FaLinkedinIn, FaLocationDot, FaXTwitter } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import ContactUsImage from '../assets/images/ContactUsImage.svg';
import ContactUsPlaneImage from '../assets/images/ContactUsPlaneImage.svg';
import { useEffect, useRef } from 'react';
import { buttonHoverAnimaiton } from '../utils/Tailwind.utils';
import { motion } from 'framer-motion';

const Contact = () => {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement;

    form.fullName.value = ''
    form.email.value = ''
    form.message.value = ''
  }

  return (
    <div className="WRAPPER flex flex-col justify-center items-center gap-8 w-full h-[calc(100vh-5rem)] bg-white px-rootXPadd mb-52">
      <div className="TEXT flex flex-col justify-center items-center gap-4">
        <h1 className="HEADING capitalize text-logoFontSize font-bold leading-none">Contact Us</h1>
        <p className="DESCRIPTION text-lg font-light">
          Any question or remarks? Just write us a message!
        </p>
      </div>
      <div className="M-CONTAINER flex w-[70vw] h-[40vw] rounded-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ rotateZ: '2deg', rotateX: '10deg' }}
          transition={{ duration: 0.5 }}
          className="INFORMATION relative flex flex-col justify-between w-[40%] h-full rounded-xl p-10 text-white overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,1) 11%, rgba(76,29,149,1) 99%)',
          }}
        >
          <div className="MAIL flex flex-col gap-2">
            <span className="INFORMATION text-2xl font-semibold">Contact Information</span>
            <span className="text-sm font-light">Feel free to write us</span>
          </div>
          <div className="LINKS flex flex-col gap-8">
            <span className="flex items-center gap-4">
              <IoMail /> TextCraft@proton.me
            </span>
            <span className="flex items-center gap-4">
              <FaLocationDot />
              Noida, India
            </span>
          </div>
          <div className="SOCIAL-MEDIA-LINKS flex gap-4">
            <Link
              to="https://github.com/its-lakshya"
              className="flex justify-center items-center size-6 rounded-full hover:bg-primary"
            >
              <FaGithub />
            </Link>
            <Link
              to="https://www.linkedin.com/in/lakshyakumar-/"
              className="flex justify-center items-center size-6 rounded-full hover:bg-primary"
            >
              <FaLinkedinIn />
            </Link>
            <Link
              to="https://x.com/its_lakshya"
              className="flex justify-center items-center size-6 rounded-full hover:bg-primary"
            >
              <FaXTwitter />
            </Link>
          </div>
          <img
            src={ContactUsImage}
            alt="img"
            className="BG-IMAGE absolute bottom-0 right-0 opacity-50"
          />
        </motion.div>
        <div className="FORM w-[60%] h-full relative text-md">
          <img
            src={ContactUsPlaneImage}
            alt="img"
            className="ARROW-ELEMENT absolute bottom-8 right-28"
          />
          <form className="FORM flex flex-col gap-8 p-10" method='post' onSubmit={(e) => handleSubmit(e)}>
            <div className="flex gap-8">
              <div className="NAME-CONTAINER flex flex-col justify-center items-start w-1/2 gap-4">
                <label className="text-sm text-[#8D8D8D] capitalize">Name</label>
                <input
                  ref={nameRef}
                  type="text"
                  name='fullName'
                  placeholder="john doe"
                  className="NAME w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black autofocus"
                />
              </div>
              <div className="EMAIL-CONTAINER flex flex-col justify-center items-start w-1/2 gap-4">
                <label className="text-sm text-[#8D8D8D] capitalize">Email</label>
                <input
                  type="text"
                  name='email'
                  placeholder="john@gmail.com"
                  className="EMAIL w-full pb-[6px] font-light outline-none border-b focus:border-b-primary focus:pb-[5px] focus:border-b-2  border-b-black "
                />
              </div>
            </div>
            <div className="TEXTAREA-CONTAINER flex flex-col justify-center items-start w-full gap-4">
              <label className="text-sm text-[#8D8D8D] capitalize">Message</label>
              <textarea
                rows={4}
                name='message'
                placeholder="write your message..."
                className="NAME w-full p-2 font-light outline-none border border-black focus:outline-primary focus:border-none rounded-md resize-none"
              />
            </div>
            <button
              type="submit"
              className={`flex justify-center items-center self-end px-6 py-3 text-white font-bold capitalize rounded-md bg-primary ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark`}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
