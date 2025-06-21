import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecycleGuideList from './pages/RecycleGuideList';
import Home from './pages/Home';
import Footer from './components/Footer';
import RecycleItem from './pages/RecycleItem';
import ScrollToTop from './components/ScrollToTop';
import BlogDetail from './pages/BlogDetail';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/danhsachphanloai" element={<RecycleGuideList />} />
        <Route path="/danhsachphanloai/:id" element={<RecycleItem />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;