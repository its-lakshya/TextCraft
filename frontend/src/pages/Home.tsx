import { useEffect } from 'react';
import ImproveWorkFlow from '../components/home/ImproveWorkFlow';
import JoinCommunity from '../components/home/JoinCommunity';
import Landing from '../components/home/Landing';
import Steps from '../components/home/Steps';

const Home = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  },[])
  return (
    <>
      <Landing />
      <Steps />
      <ImproveWorkFlow/>
      <JoinCommunity/>
    </>
  );
};

export default Home;
