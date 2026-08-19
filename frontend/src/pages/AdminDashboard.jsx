import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramMaterials from '../components/ProgramMaterials';
import ProgramFeedback from '../components/ProgramFeedback';



function AdminDashboard({ user }) {
  const [programs, setPrograms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', area: '', trainer_id: '', target_audience: '', schedule_date: '', venue: '', description: ''
  });

  useEffect(() => {
    fetchPrograms();
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/trainers');
      setTrainers(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, trainer_id: res.data[0].id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/programs');
      setPrograms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Format datetime-local (YYYY-MM-DDTHH:mm) to MySQL DATETIME (YYYY-MM-DD HH:mm:ss)
      const formattedDate = formData.schedule_date.replace('T', ' ') + ':00';
      await axios.post('http://localhost:5000/api/programs', { ...formData, schedule_date: formattedDate, trainer_id: formData.trainer_id || user.id });
      setShowModal(false);
      fetchPrograms();
    } catch (error) {
      console.error('Error creating program:', error.response?.data || error.message);
      alert('Error creating program: ' + (error.response?.data?.message || error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await axios.delete(`http://localhost:5000/api/programs/${id}`);
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('Error deleting program');
      }
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Program</button>
      </div>

      <div className="dashboard-grid">
        {programs.map(p => (
          <div key={p.id} className="glass-card program-card">
            <h3>{p.title}</h3>
            <div className="program-meta">
              <span><strong>Area:</strong> {p.area}</span>
              <span><strong>Trainer:</strong> {p.trainer_name}</span>
              <span><strong>Date:</strong> {new Date(p.schedule_date).toLocaleString()}</span>
              <span><strong>Venue:</strong> {p.venue}</span>
            </div>
            <p style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>{p.description}</p>
            <ProgramMaterials programId={p.id} userRole="admin" />
            <ProgramFeedback programId={p.id} />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button 
                className="btn btn-secondary" 
                style={{ background: 'var(--accent-color)', borderColor: 'var(--accent-color)', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} 
                onClick={() => handleDelete(p.id)}
              >
                Delete Program
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Training Program</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-input" required onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Area</label>
                <input type="text" className="form-input" required onChange={e => setFormData({...formData, area: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Trainer</label>
                <select className="form-input" required onChange={e => setFormData({...formData, trainer_id: e.target.value})} value={formData.trainer_id}>
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <input type="text" className="form-input" required onChange={e => setFormData({...formData, target_audience: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <input type="datetime-local" className="form-input" required onChange={e => setFormData({...formData, schedule_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Venue</label>
                <input type="text" className="form-input" required onChange={e => setFormData({...formData, venue: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="3" required onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Save Program</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
