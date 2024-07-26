import { useEffect, useMemo, useState } from 'react';
import Editor from '../components/editor/Editor';
import { Toolbar } from '../components/toolbar/Toolbar';
import EditorHeader from '../layouts/header/EditorHeader';
import axios from '../axios.config';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loader/Loader';
import { useDispatch } from 'react-redux';
import { setShowToast } from '../store/slices/Toast.slice';
interface Document {
  createdAt: string;
  documentName: string;
  content: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface User {
  createdAt: string;
  email: string;
  fullName: string;
  gender: string;
  updatedAt: string;
  userName: string;
  _id: string;
}

const DocumentEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLocation = location.pathname.split('/');
  const [userDetails, setUserDetails] = useState<User>();
  const [documentData, setDocumentData] = useState<Document>();
  const socket = useMemo(() => io('http://localhost:8000'), []);
  const documentId = currentLocation[currentLocation.length - 1];

  // Api calls for getting document and user details
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/documents/d/${documentId}`);
        const details = await axios.get(`/users/details`);
        setUserDetails(details.data.data);
        setDocumentData(response.data.data.document);
      } catch (error) {
        console.log(error, 'Error fetching document details');
        navigate('/error', {
          replace: true,
          state: { text: "Oops, You don't have access to the document!" },
        });
      }
    })();
  }, []);

  // Handling the socket connect and dissconnect events
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userDetails !== undefined) {
      console.log(userDetails.userName);
      socket.emit('join-document', { documentId, userDetails });
    }
    // eslint-disable-next-line
  }, [userDetails]);

  // Showing the notification when user dissconnects from the document
  socket.on('disconnected-user', userDetails => {
    dispatch(
      setShowToast({
        showToast: true,
        message: `${userDetails.userName} disconnected`,
        type: 'DEFAULT',
        timing: 3000
      }),
    );
  });

  // Showing notification when user joins the document
  socket.on('joined-user', userDetails => {
    dispatch(
      setShowToast({
        showToast: true,
        message: `${userDetails.userName} joined`,
        type: 'DEFAULT',
        timing: 3000
      }),
    );
  });

  // Maintaning the list of active users

  if (documentData) {
    return (
      <div className="WAPPER flex flex-col justify-start items-center w-full h-auto bg-documentBackground">
        <div className="flex flex-col fixed top-0 z-50 w-full px-10">
          <EditorHeader document={documentData} socket={socket}/>
          <Toolbar />
        </div>
        <Editor documentData={documentData} socket={socket} />
      </div>
    );
  } else {
    return (
      <div
        className="w-screen h-screen flex justify-center items-center"
        style={{ backdropFilter: 'blur(5px)' }}
      >
        <Loader />
      </div>
    );
  }
};

export default DocumentEdit;
