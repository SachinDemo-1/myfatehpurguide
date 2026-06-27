import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookings from './pages/MyBookings';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';

const ProtectedUser = ({ children }) => {
  const { isLoggedIn, isOwner } = useAuth();
  return isLoggedIn && !isOwner ? children : <Navigate to="/login" replace />;
};
const ProtectedOwner = ({ children }) => {
  const { isLoggedIn, isOwner } = useAuth();
  return isLoggedIn && isOwner ? children : <Navigate to="/owner/login" replace />;
};

const WithLayout = ({ children }) => <><Navbar />{children}<Footer /></>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
          style: { background:'#0D7377', color:'#fff', fontFamily:'Inter,sans-serif', borderRadius:'12px' },
          success: { iconTheme: { primary:'#D4A017', secondary:'#0D7377' } },
          error: { style: { background:'#E05A2B' } },
        }} />
        <Routes>
          <Route path="/" element={<WithLayout><HomePage /></WithLayout>} />
          <Route path="/book" element={<WithLayout><BookingPage /></WithLayout>} />
          <Route path="/booking-success" element={<WithLayout><BookingSuccess /></WithLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-bookings" element={<ProtectedUser><WithLayout><MyBookings /></WithLayout></ProtectedUser>} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/dashboard" element={<ProtectedOwner><OwnerDashboard /></ProtectedOwner>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
