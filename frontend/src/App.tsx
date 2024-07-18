import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Editor from './components/editor/Editor';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';

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
      {
        path: '/contact-us',
        element: <Contact/>
      }
    ],
  },
  {
    path:'/auth/login',
    element: <Login/>
  },
  {
    path:'/auth/register',
    element: <Register/>
  }
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
