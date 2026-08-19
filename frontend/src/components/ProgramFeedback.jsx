import { useState, useEffect } from 'react';
import axios from 'axios';

function ProgramFeedback({ programId }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [programId]);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/feedback/program/${programId}`);
      setFeedbackList(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch feedback', error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
      <h4>Feedback & Ratings</h4>
      {feedbackList.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbackList.map(f => (
            <li key={f.id} style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--primary-light)' }}>{f.user_name}</strong>
                <span>Rating: {f.rating}/5</span>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#ccc' }}>"{f.comments}"</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '0.85rem', color: '#ccc' }}>No feedback received yet.</p>
      )}
    </div>
  );
}

export default ProgramFeedback;
