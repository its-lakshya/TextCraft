import './App.css';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import DocumentEdit from './pages/DocumentEdit';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Documents from './pages/Documents';
import { Provider } from 'react-redux';
import Store from './store/Store';
import Error404 from './pages/Error404';

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
  },
  {
    path: '/error',
    element: <Error404/>
  }
]);

function App() {
  return (
    <Provider store = {Store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;
