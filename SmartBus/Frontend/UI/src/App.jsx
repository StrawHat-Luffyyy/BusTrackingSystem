import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashBoard from './pages/AdminDashBoard';
import MyBookings from './pages/MyBookings';
import SearchHero from './components/SearchHero';

function App() {
  return (
    <Router>
      <div className="app-frame">
        <header className="top-nav">
          <div className="brand-title">Smart Bus</div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/bookings">Bookings</Link>
          </nav>
        </header>
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<SearchHero />} />
            <Route path="/admin" element={<AdminDashBoard />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;
