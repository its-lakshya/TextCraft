import { FaArrowRightLong } from "react-icons/fa6";
import { buttonHoverAnimaiton } from "../../utils/TailwindUtils";

const JoinCommunity = () => {
  return (
    <div className="WRAPPER flex justify-center items-center w-full h-auto py-rootXPadd bg-white mb-52 text-white text-center">
      <div
        className="COLORED-DIV flex flex-col justify-between items-center p-rootXPadd w-[90vw] h-96 rounded-3xl"
        style={{
          background:
            'linear-gradient(99.45deg, #D8B4FE 0%, #7C3AED 0.01%, #1E3A8A 46%, #4C1D95 80.97%)',
        }}
      >
        <span className="text-[4vw] leading-none font-bold">Join the community today</span>
        <p className='text-lg'>
          We invite you to join our vibrant community at TextCraft. Whether you're a
          creative writer, a business collaborator, or a team leader, our platform is designed to
          empower you to collaborate, create, and achieve together.
        </p>
        <button
          className={`START-BUTTON flex justify-center items-center gap-3 bg-primary text-2xl text-white 
            capitalize font-medium px-10 py-3 rounded-full ${buttonHoverAnimaiton} hover:-translate-y-2 group`}
            style={{boxShadow: `0px 25px 50px -12px rgba(0, 0, 0, 0.25), 0px 0px 15px rgba(0, 0, 0, 0.07)`}}
        >
          Start for free
          <span className="ARROW group-hover:animate-arrowMove relative">
            <FaArrowRightLong />
          </span>
        </button>
      </div>
    </div>
  );
};

export default JoinCommunity;
