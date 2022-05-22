import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/public/Login';
import Register from './components/public/Register';

/* Public components */
import Home from './components/public/Home';
import Users from './components/public/Users';
import Groups from './components/public/Groups';

/* Private components */
import MyGroups from './components/private/MyGroups';
import Profile from './components/private/Profile';

import NavigationPrivate from './components/navs/Private';
import NavigationPublic from './components/navs/Public';

import NotFound from './components/NotFound';

export default function () {
  return (
    <>
      <BrowserRouter>
        <div className='nav-container'>
          <NavigationPrivate />
        </div>
        
        <div className='content-container'>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/groups" element={<Groups />} />


            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/profile" element={<Profile />} />

            <Route path='*' element={<NotFound />} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}





