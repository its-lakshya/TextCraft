import './Loader.style.css';

const Loader = () => {
  return <div className='loader w-[65px]'></div>;
};

interface Size {
  size: string,
  border: string,
}

export const CircularLoader:React.FC<Size> = ({size, border}) => {
  return <div className={`circular-loader ${size} ${border}`}></div>
}

export default Loader;
