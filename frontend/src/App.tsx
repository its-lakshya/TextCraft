import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Editor from './components/editor/editor/Editor';
import Layout from './layouts/Layout';


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <div>home</div>
      },
      {
        path: "/document/:documentId",
        element: <Editor/>
      }
    ]
  }
])


function App() {
  return (
        <RouterProvider router={appRouter}/>
  )
}

export default App;
