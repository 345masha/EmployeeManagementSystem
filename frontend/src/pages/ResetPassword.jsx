import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, newPassword });
      alert(res.data.message);
      navigate('/login');
    } catch (error) {
      alert('Reset failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="auth-container glass-card">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        Remember your password? <Link to="/login" style={{color: 'var(--amex-light-blue)'}}>Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
