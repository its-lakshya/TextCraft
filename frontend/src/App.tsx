import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Editor from './components/editor/Editor';
import Layout from './layouts/Layout';
import Home from './pages/Home';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/document/:documentId',
        element: <Editor />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
