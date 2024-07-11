import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Toolbar, modules } from './Toolbar';
import 'react-quill/dist/quill.snow.css';

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
    <div className="text-editor">
      <Toolbar />
      <ReactQuill
        className='h-[80vh] border-0 bordre-none'
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
