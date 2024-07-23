import { useEffect, useState } from 'react';
import Editor from '../components/editor/Editor';
import { Toolbar } from '../components/toolbar/Toolbar';
import EditorHeader from '../layouts/header/EditorHeader';
import axios from '../axios.config';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
interface Document {
  createdAt: string;
  documentName: string;
  content: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

const DocumentEdit = () => {
  const currentLocation = location.pathname.split('/');
  const documentId = currentLocation[2];
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState<Document>();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/documents/d/${documentId}`);
        console.log(response);
        setDocumentData(response.data.data.document);
      } catch (error) {
        console.log(error, 'Error fetching document details');
        navigate(
          '/error',
          { replace: true, state: { text: "Oops, You don't have access to the document!" }  },
        );
      }
    })();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (documentData) {
    return (
      <div className="WAPPER flex flex-col justify-start items-center w-full h-auto bg-documentBackground">
        <div className="flex flex-col fixed top-0 z-50 w-full px-10">
          <EditorHeader document={documentData} />
          <Toolbar />
        </div>
        <Editor document={documentData} />
      </div>
    );
  } else {
    return null;
  }
};

export default DocumentEdit;
