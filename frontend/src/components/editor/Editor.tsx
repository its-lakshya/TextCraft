import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { modules } from '../toolbar/Toolbar';
import 'react-quill/dist/quill.snow.css';
import './A4Document.css'

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
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

  const handleChange = (value: string | undefined) => {
    setValue(value);
  };

  return (
    <div className="text-editor flex flex-col justify-center items-center mt-32">
      <ReactQuill
        className="z-10 my-4"
        id="document"
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={'Write something awesome...'}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
