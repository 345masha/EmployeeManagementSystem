import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('trainee');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="auth-container glass-card">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
            <option value="trainer">Trainer</option>
            <option value="trainee">Trainee</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Register</button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        Already have an account? <Link to="/login" style={{color: 'var(--amex-light-blue)'}}>Login</Link>
      </p>
    </div>
  );
}

export default Register;
