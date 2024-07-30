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
import { Document, User } from '../types/Global.types';

const DocumentEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLocation = location.pathname.split('/');
  const [userDetails, setUserDetails] = useState<User>();
  const [documentData, setDocumentData] = useState<Document>();
  const socket = useMemo(() => io('https://textcraft.onrender.com'), []);
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
  }, []);

  // Specifying the condition that user details are available only then emit join-document socket event
  useEffect(() => {
    if (userDetails !== undefined) {
      socket.emit('join-document', { documentId, userDetails });
    }
  }, [userDetails]);

  // Showing the notification when user dissconnects from the document
  socket.on('disconnected-user', userDetails => {
    dispatch(
      setShowToast({
        showToast: true,
        message: `${userDetails.userName} disconnected`,
        type: 'DEFAULT',
        timing: 3000,
        image: `${userDetails.profileImage}`,
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
        timing: 3000,
        image: `${userDetails.profileImage}`,
      }),
    );
  });

  // Maintaning the list of active users
  if (documentData) {
    return (
      <div className="WAPPER flex flex-col justify-start items-center w-full h-auto bg-documentBackground">
        <div className="flex flex-col fixed top-0 z-50 w-full px-10">
          <EditorHeader documentData={documentData} socket={socket} />
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
