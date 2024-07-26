import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { modules } from '../toolbar/Toolbar';
import 'react-quill/dist/quill.snow.css';
import './A4Document.css';
import { Socket } from 'socket.io-client';
import axios from '../../axios.config';
import { setIsSaving } from '../../store/slices/DocSaving.slice';
import { useDispatch } from 'react-redux';

interface Document {
  createdAt: string;
  documentName: string;
  content: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface EditorProps {
  documentData?: Document;
  socket: Socket;
}

const Editor: React.FC<EditorProps> = ({ documentData, socket }) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef<number | null>(null); // Ref to store timeout ID
  const currentLocation = location.pathname.split('/');
  const [oldContent, setOldConent] = useState<string>('');
  const documentId = currentLocation[currentLocation.length - 1];
  const [value, setValue] = useState<string | undefined>(undefined);


  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
    'strike',
    'script',
    'blockquote',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'code-block',
  ];

  // Saving content of the document to database
  const handleSave = async (content: string) => {
    try{
      await axios.patch(`/documents/d/${documentId}`, { content: content });
      console.log('hiii')
      dispatch(setIsSaving(false));
    }catch(error){
      console.log(error, "Error saving the content of the document")
    }
  }

  // Emiting edit-document socket event and calling handleSave function
  const handleChange = (content: string) => {
    if (oldContent !== content) {
      const encodedRichText = encodeURIComponent(JSON.stringify(content));
      socket.emit('edit-document', { documentId, changes: encodedRichText });
      dispatch(setIsSaving(true));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = window.setTimeout(() => {
        handleSave(content);
      }, 1000);
      // setTimeout(() => {
      //     HandleSave(content)
      // }, 3000);
    }
  };

  // Setting the value of text editor recieved from mongoDB at time of load
  useEffect(() => {
    if (documentData?.content != undefined) {
      setValue(decodeURIComponent(documentData?.content));
    }
    // eslint-disable-next-line
  }, []);

  // socket.on('document-changes', (socketid, changes) => {
  //   console.log(socketid);
  //   const decodedRichText = decodeURIComponent(changes);
  //   setValue(decodedRichText);
  // });

  useEffect(() => {
    socket.on('document-changes', ({ socketId, changes }) => {
      if (socketId != socket.id) {
        const decodedRichText = decodeURIComponent(changes);
        setValue(JSON.parse(decodedRichText));
        setOldConent(JSON.parse(decodedRichText));
      }
    });
  }, [socket]);

  return (
    <div className="text-editor flex flex-col justify-center items-center mt-[6.5rem]">
      <ReactQuill
        className="z-10 my-4"
        id="document"
        theme="snow"
        value={value}
        onChange={content => handleChange(content)}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
