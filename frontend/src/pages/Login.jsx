import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="auth-container glass-card">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Login</button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        <Link to="/reset-password" style={{color: 'var(--amex-light-blue)'}}>Forgot Password?</Link>
      </p>
      <p style={{marginTop: '0.5rem', textAlign: 'center'}}>
        Don't have an account? <Link to="/register" style={{color: 'var(--amex-light-blue)'}}>Register</Link>
      </p>
    </div>
  );
}

export default Login;
