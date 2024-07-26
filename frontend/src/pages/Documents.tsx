import CreateDocument from '../components/documents/CreateDocument';
import DocumentsHeader from '../components/documents/DocumentsHeader';
import DocumentsList from '../components/documents/DocumentsList';

const Documents = () => {
  return (
    <div className="WRAPPER flex flex-col justify-start items-center w-full min-h-screen bg-documentBackground">
      <DocumentsHeader />
      <CreateDocument/>
      <DocumentsList/>
    </div>  
  );
};

export default Documents;
