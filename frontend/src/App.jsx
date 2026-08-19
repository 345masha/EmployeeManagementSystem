import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import TraineeDashboard from './pages/TraineeDashboard';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="brand">Amex Training</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span style={{color: 'var(--amex-light-blue)'}}>Hello, {user.name} ({user.role})</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {user?.role === 'admin' && <Route path="/dashboard" element={<AdminDashboard user={user} />} />}
          {user?.role === 'trainer' && <Route path="/dashboard" element={<TrainerDashboard user={user} />} />}
          {user?.role === 'trainee' && <Route path="/dashboard" element={<TraineeDashboard user={user} />} />}
        </Routes>
      </main>
    </div>
  );
}

export default App;
