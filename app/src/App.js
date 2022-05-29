import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import React from 'react';

import Login from './components/public/Login';
import Register from './components/public/Register';

/* Public components */
import Home from './components/public/Home';
import Users from './components/public/Users';
import Groups from './components/public/Groups';
import RoutesMap from './components/public/RoutesMap';

/* Private components */
import MyGroups from './components/private/MyGroups';
import MyInvoices from './components/private/MyInvoices';
import Profile from './components/private/Profile';
import GroupDetail from './components/private/GroupDetail';
import GroupInvoiceForm from './components/private/grouptabs/GroupInvoiceForm';
import GroupInvoiceDetail from './components/private/grouptabs/GroupInvoiceDetail';

import NavigationPrivate from './components/navs/Private';
import NavigationPublic from './components/navs/Public';

import NotFound from './components/NotFound';

import { useStore } from './store';
import { useToasts } from 'react-toast-notifications';


function App() {
  const isAuth = useStore((state) => state.token !== null);
  const { addToast } = useToasts();

  function PrivateRoute({ children }) {
    if (!isAuth) {
      addToast('Unauthorized redirect to "/"', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
      return <Navigate to="/" />;
    }

    return children;
  }

  return (
    <>
      <BrowserRouter>
        <div className='nav-container'>
          {isAuth ? <NavigationPrivate /> : <NavigationPublic />}
        </div>

        <div className='content-container'>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/groups" element={<Groups />} />

            <Route path="/profile-groups" element={<PrivateRoute><MyGroups /></PrivateRoute>} />
            <Route path="/profile-invoices" element={<PrivateRoute><MyInvoices /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            <Route path="/group/edit/:id" element={<GroupDetail />} />
            <Route path="/invoice/edit/:id" element={<GroupInvoiceForm mode="edit" goto_invoices={null} />} />
            <Route path="/invoice/detail/:id" element={<GroupInvoiceDetail />} />
            <Route path="/docs/swagger" element={<RoutesMap />} />
            <Route path='*' element={<NotFound />} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default () => (
  <ToastProvider>
    <App />
  </ToastProvider>
);





