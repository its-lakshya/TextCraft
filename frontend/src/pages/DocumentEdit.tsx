import Editor from "../components/editor/Editor"
import { Toolbar } from "../components/toolbar/Toolbar"
import EditorHeader from "../layouts/header/EditorHeader"

const DocumentEdit = () => {
  return (
    <div className='WAPPER flex flex-col justify-start items-center w-full h-auto bg-documentBackground'>
      <div className='flex flex-col fixed top-0 z-50 w-full px-10'>
        <EditorHeader/>
        <Toolbar />
      </div>
      <Editor/>
    </div>
  )
}

export default DocumentEdit