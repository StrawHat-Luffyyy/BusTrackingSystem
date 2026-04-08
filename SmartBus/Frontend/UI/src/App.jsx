import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import AdminDashBoard from './pages/AdminDashBoard';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchHero from './components/SearchHero';
import UpcomingTrips from './components/UpcomingTrips';
import { useAuth } from "./context/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";

function AppContent() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.error(e);
      await logout();
      navigate("/login");
    }
  };

  if (loading) return null;

  return (
    <div className="app-frame">
      <header className="top-nav">
         <div className="brand-title">Smart Bus</div>
         <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/">Home</Link>
            <Link to="/bookings">Bookings</Link>
            {user?.role === 'ADMIN' && <Link to="/admin/dashboard">Admin</Link>}
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hi, {user.name}</span>
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <>
              <SearchHero auth={user} />
              <UpcomingTrips auth={user} />
            </>
          } />
          <Route 
            path="/admin/dashboard" 
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminDashBoard />
                </RequireAdmin>
              </RequireAuth>
            } 
          />
          <Route path="/bookings" element={
            <RequireAuth>
              <MyBookings />
            </RequireAuth>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
