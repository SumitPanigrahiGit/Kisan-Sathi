import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CropLibrary from './pages/CropLibrary';
import CropDetail from './pages/CropDetail';
import Community from './pages/Community';
import QuestionDetail from './pages/QuestionDetail';
import MandiRates from './pages/MandiRates';
import Transport from './pages/Transport';
import Profile from './pages/Profile';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader"></div><p>Loading...</p></div>;

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crops" element={<CropLibrary />} />
          <Route path="/crops/:id" element={<CropDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<QuestionDetail />} />
          <Route path="/mandi" element={<MandiRates />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
