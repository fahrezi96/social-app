import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import Posts from './pages/Posts';
import Writers from './pages/Writers';
import About from './pages/About';
import Contact from './pages/Contact';
import Post from './components/Post';
import Writer from './components/Writer';
import Albums from './components/Albums';
import Album from './components/Album';
import Photo from './components/Photo';

function App() {
  return (
    <div className="global-container">
      <Header />
      <main className="mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="posts" />} />
          <Route path="/posts" element={<Posts userId={0} />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/albums" element={<Albums userId={0} />} />
          <Route path="/albums/:id" element={<Album />} />
          <Route path="/photos/:id" element={<Photo />} />
          <Route path="/writers" element={<Writers />} />
          <Route path="/writers/:id" element={<Writer />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
        </Routes>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
