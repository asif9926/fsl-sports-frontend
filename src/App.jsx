import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Components & Layout ---
import AppLayout from './components/layout/AppLayout';
import ScrollToTop from './components/ScrollToTop'; // Scroll fix korar jonno
import PrivateRoute from './routes/PrivateRoute'; 
import AdminRoute from './routes/AdminRoute';

// --- Auth Pages ---
import Signup from './pages/auth/Signup';
import Verify from './pages/auth/Verify';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword'; 

// --- Main App Pages ---
import Home from './pages/Home';
import Profile from './pages/profile/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import FanZone from './pages/FanZone/FanZone';
import FanWall from './pages/FanWall/FanWall';
import LiveScore from './pages/LiveScore/LiveScore';
import NewsFeed from './pages/News/NewsFeed';
import NewsDetail from './pages/News/NewsDetail';
import About from './pages/About/About'; // 
import FootballOverlay from './components/FootballOverlay';


function App() {
  return (
    <BrowserRouter>
      {/* 1. Scroll Restoration: Protibar link change hole page-er top-e niye jabe */}
      <ScrollToTop /> 

   <Toaster 
        position="top-center" 
        reverseOrder={false}
        containerStyle={{
          top: 40, // ন্যাভবার থেকে একটু নিচে দেখাবে
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0d131f',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: '600', // টেক্সট একটু স্পষ্ট দেখাবে
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }} 
      />

      <Routes>
        {/* =========================================
            PUBLIC ROUTES (Shobai dekhte parbe)
        ========================================== */}
        
        {/* Default Redirect to Home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Home Page */}
        <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
        
        {/* News Feed & News Detail (Layout wrapper add kora hoyese) */}
        <Route path="/news" element={<AppLayout><NewsFeed /></AppLayout>} />
        <Route path="/news/:id" element={<AppLayout><NewsDetail /></AppLayout>} />

        {/* Fan Zone (Layout wrapper add kora hoyese) */}
        <Route path="/fan-zone" element={<AppLayout><FanZone /></AppLayout>} />
        <Route path="/about" element={<About />} />
        <Route path="/overlay/football" element={<FootballOverlay />} />




        {/* Auth Routes (Layout chara, karon aigulo full screen hoy) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 

        <Route 
  path="/live-score" 
  element={
    <AppLayout>
      <LiveScore />
    </AppLayout>
  } 
/>

        {/* =========================================
            PRIVATE ROUTES (Login chara dhuka jabe na)
        ========================================== */}
        
        {/* User Profile */}
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        {/* Fan Wall */}
        <Route 
          path="/fan-wall" 
          element={
            <PrivateRoute>
              <AppLayout>
                <FanWall />
              </AppLayout>
            </PrivateRoute>
          } 
        />

       

        {/* =========================================
            ADMIN ROUTES (Shudhu Admin dhukte parbe)
        ========================================== */}
        
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              {/* Admin dashboard e amra AppLayout use korchi na 
                  karon admin panel er design purapuri alada hoy */}
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 Redirect - Vul path e gele Home e niye jabe */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;