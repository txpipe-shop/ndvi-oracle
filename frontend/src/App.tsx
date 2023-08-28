import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Index from './routes/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
]);

export default function App() {
  useEffect(() => { import('preline'); }, []);
  return <RouterProvider router={router} />;
}
