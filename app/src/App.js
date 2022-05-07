import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function() {
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
  return (
    <div>
      <h2>Home</h2>
      <a href="/users/">okj</a>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <a href="/">houm</a>
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
