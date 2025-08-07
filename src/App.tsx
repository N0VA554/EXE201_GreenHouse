import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecycleGuideList from './pages/RecycleGuideList';
import Home from './pages/Home';
import Footer from './components/Footer';
import RecycleItem from './pages/RecycleItem';
import ScrollToTop from './components/ScrollToTop';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import DonateCampaign from './components/DonateCompaign';
import { Navigate } from 'react-router-dom';
import AdminPage from './pages/Admin';
import PaymentResponse from './components/PaymentResponse';
import Users from './pages/Users';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Events from './pages/Events';
import MyBookings from './pages/MyBookings';
import BookingsManagement from './pages/BookingsManagement';
import RecyclingGame from './pages/RecyclingGame';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const roleName = localStorage.getItem('roleName');
  if (roleName !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
const AppContent: React.FC = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/dang-nhap'
    || location.pathname === '/dang-ky'
    || location.pathname === '/thanhtoan';//|| location.pathname === "/admin"; // hoặc thêm || location.pathname === '/dang-ky'

  return (
    <>
      <ScrollToTop />
      {/* <DonateCampaign /> */}
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/profile" element={<Users />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/danhsachphanloai" element={<RecycleGuideList />} />
        <Route path="/danhsachphanloai/:id" element={<RecycleItem />} />
        <Route path="/thanhtoan" element={<PaymentResponse />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/baiviet" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/su-kien" element={<Events />} />
        <Route path="/lich-dat" element={<MyBookings />} />
        <Route path="/quan-ly-lich-dat" element={<BookingsManagement />} />
        <Route path="/minigame" element={<RecyclingGame />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
