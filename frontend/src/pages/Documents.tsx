import CreateDocument from '../components/documents/CreateDocument';
import DocumentsHeader from '../components/documents/DocumentsHeader';


const Documents = () => {
  return (
    <div className="WRAPPER flex flex-col w-full bg-documentBackground">
      <DocumentsHeader />
      <CreateDocument/>
    </div>  
  );
};

export default Documents;
