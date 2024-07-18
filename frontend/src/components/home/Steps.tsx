import CreateIcon from '../../assets/images/CreateIcon.svg';
import CollaborateIcon from '../../assets/images/CollaborateIcon.svg';
import EditIcon from '../../assets/images/EditIcon.svg';
import AccomplishIcon from '../../assets/images/AccomplishIcon.svg';

const Steps = () => {
  const stepsData = [
    {
      image: CreateIcon,
      title: 'Create',
      description: 'Create together seamlessly with our collaborative document editor.',
    },
    {
      image: CollaborateIcon,
      title: 'Collaborate',
      description: 'Collaborate in real-time to refine and enhance your work.',
    },
    {
      image: EditIcon,
      title: 'Edit',
      description: 'Edit efficiently with synchronized updates and feedback.',
    },
    {
      image: AccomplishIcon,
      title: 'Accomplish',
      description: 'Accomplish your goals through productive and innovative teamwork.',
    },
  ];

  return (
    <div className="STEPS-WRAPPER flex justify-center items-center w-full h-96 p-rootXPadd">
      <div className="STEPS flex justify-center items-center gap-16 w-full h-full">
        {stepsData?.map(data => {
          return (
            <div className="STEP flex flex-col justify-between gap-3 items-center">
              <img src={data?.image} alt="img" />
              <span className="TITLE text-xl font-bold">{data?.title}</span>
              <span className="DESCRIPTION text-md text-center">{data?.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;
