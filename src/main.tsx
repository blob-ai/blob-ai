
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import ContentCreationPage from "./pages/ContentCreationPage";
import Library from "./pages/Library";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <ContentCreationPage />
  },
  {
    path: '/dashboard/content',
    element: <ContentCreationPage />
  },
  {
    path: '/library',
    element: <Library />
  },
  {
    path: '/auth/login',
    element: <LoginPage />
  },
  {
    path: '/auth/register',
    element: <RegisterPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
