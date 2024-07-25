import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { modules } from '../toolbar/Toolbar';
import 'react-quill/dist/quill.snow.css';
import './A4Document.css';
import { Socket } from 'socket.io-client';
import axios from '../../axios.config';

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
  const [value, setValue] = useState<string | undefined>(undefined);
  const currentLocation = location.pathname.split('/');
  const documentId = currentLocation[currentLocation.length - 1];
  const [oldContent, setOldConent] = useState<string>('')

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

  // Saving changes to mongoDB and emiting edit-document socket event
  const handleChange = (content: string) => {
    // console.log(content, oldContent)
    if(oldContent !== content){
      const encodedRichText = encodeURIComponent(JSON.stringify(content));
      socket.emit('edit-document', { documentId, changes: encodedRichText});
      setTimeout(() => {
        (async () => {
          await axios.patch(`/documents/d/${documentId}`, { content: content });
        })();
      }, 1000);
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

    socket.on('document-changes', ({socketId, changes}) => {
      if(socketId != socket.id){
        const decodedRichText = decodeURIComponent(changes);
        // console.log(decodedRichText)
        setValue(JSON.parse(decodedRichText));
        setOldConent(JSON.parse(decodedRichText));
      }
    });

    // return () => {
    //   socket.off('document-changes', handleDocumentChanges);
    // };
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
