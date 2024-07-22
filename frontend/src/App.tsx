import './App.css';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import DocumentEdit from './pages/DocumentEdit';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Documents from './pages/Documents';

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
        element: <DocumentEdit/>,
      },
      {
        path: '/contact-us',
        element: <Contact/>
      },
      {
        path: '/user/documents',
        element: <Documents/>
      },
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
