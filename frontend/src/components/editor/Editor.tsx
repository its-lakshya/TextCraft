import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { modules } from '../toolbar/Toolbar';
import 'react-quill/dist/quill.snow.css';
import './A4Document.css';
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
  document?: Document;
}

const Editor: React.FC<EditorProps> = ({ document }) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const currentLocation = location.pathname.split('/');
  const documentId = currentLocation[currentLocation.length - 1];

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

  const handleChange = (content: string) => {
    setValue(content);
    console.log(JSON.stringify(content))
    setTimeout(() => {
      (async () => {
        await axios.patch(`/documents/d/${documentId}`, {content: JSON.stringify(content)})
      })();
    }, 1000);
  };

  useEffect(() => {
    if(document?.content != undefined){
      setValue(JSON.parse(document?.content));
    }
    // eslint-disable-next-line
  }, []);

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
