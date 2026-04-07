import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import AdminDashBoard from './pages/AdminDashBoard';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchHero from './components/SearchHero';
import UpcomingTrips from './components/UpcomingTrips';
import { authService } from './services/api';

const ProtectedAdminRoute = ({ auth, children }) => {
  if (!auth) return <Navigate to="/login" replace />;
  if (auth.role !== 'OPERATOR') return <Navigate to="/" replace />;
  return children;
};

function AppContent() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  // On mount, check if there's auth in local storage
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  // Sync auth state to local storage when changed
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setAuth(null);
      navigate("/login");
    } catch (e) {
      console.error(e);
      setAuth(null);
      navigate("/login");
    }
  };

  return (
    <div className="app-frame">
      <header className="top-nav">
         <div className="brand-title">Smart Bus</div>
         <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/">Home</Link>
            <Link to="/bookings">Bookings</Link>
            {auth?.role === 'OPERATOR' && <Link to="/admin">Admin</Link>}
            
            {auth ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hi, {auth.name}</span>
                <button onClick={handleLogout} className="primary-btn" style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.75rem', width: 'auto' }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                <Link to="/login">Login</Link>
                <Link to="/signup" style={{ background: 'var(--text-main)', color: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '50px' }}>Sign Up</Link>
              </div>
            )}
         </nav>
      </header>
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={
            <>
              <SearchHero auth={auth} />
              <UpcomingTrips auth={auth} />
            </>
          } />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute auth={auth}>
                <AdminDashBoard />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<Signup setAuth={setAuth} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
