import { LoaderSize } from '../../types/Global.types';
import './Loader.style.css';

const Loader = () => {
  return <div className='loader w-[65px]'></div>;
};

export const CircularLoader:React.FC<LoaderSize> = ({size, border}) => {
  return <div className={`circular-loader ${size} ${border}`}></div>
}

export default Loader;
