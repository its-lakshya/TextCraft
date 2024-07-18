import ImproveWorkFlow from '../components/home/ImproveWorkFlow';
import JoinCommunity from '../components/home/JoinCommunity';
import Landing from '../components/home/Landing';
import Steps from '../components/home/Steps';

const Home = () => {
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
