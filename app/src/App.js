import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users/" element={<About />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const response = await fetch('http://localhost/api/v1/users');
    const json = await response.json();
    setUsers(json);
    console.log(json);
  }

  return (
    <div>
      <h2>Home</h2>
      <a href="/users/">okj</a>
      <div>{users.map((user, idx) =>
        <div style={{ margin: '10px' }} key={`user_${idx}`}>
          {user.fullname}<br />
          <i>{user.email}</i>
        </div>)}</div>
    </div>
  );
}

function About() {
  const [grous, setGroups] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const response = await fetch('http://localhost/api/v1/groups');
    const json = await response.json();
    setGroups(json);
  }

  return (
    <div>
      <h2>About</h2>
      <a href="/">houm</a>
      <div>{grous.map((group, idx) =>
        <div style={{ margin: '10px' }} key={`user_${idx}`}>
          {group.name}<br />
          <i>{group.created_at}</i>
        </div>)}</div>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h2>Page does not exist</h2>
      <a href="/">houm</a>
    </div>
  );
}
