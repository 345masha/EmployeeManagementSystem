import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramMaterials from '../components/ProgramMaterials';


function TraineeDashboard({ user }) {
  const [programs, setPrograms] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(null); // stores program_id
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/programs');
      setPrograms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback', {
        program_id: feedbackModal,
        user_id: user.id,
        rating: feedback.rating,
        comments: feedback.comments
      });
      alert('Feedback submitted!');
      setFeedbackModal(null);
      setFeedback({ rating: 5, comments: '' });
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  return (
    <div>
      <h2>Upcoming Training Programs</h2>
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
            <p style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem'}}>{p.description}</p>
            <ProgramMaterials programId={p.id} userRole="trainee" />
            <button className="btn btn-secondary btn-block" onClick={() => setFeedbackModal(p.id)} style={{marginTop: '1rem'}}>Provide Feedback</button>
          </div>
        ))}
      </div>

      {feedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Provide Feedback</h3>
              <button className="close-btn" onClick={() => setFeedbackModal(null)}>&times;</button>
            </div>
            <form onSubmit={submitFeedback}>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input type="number" min="1" max="5" className="form-input" value={feedback.rating} onChange={e => setFeedback({ ...feedback, rating: parseInt(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea className="form-input" rows="4" value={feedback.comments} onChange={e => setFeedback({ ...feedback, comments: e.target.value })} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Submit Feedback</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraineeDashboard;
