import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramMaterials from '../components/ProgramMaterials';
import ProgramFeedback from '../components/ProgramFeedback';



function TrainerDashboard({ user }) {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/programs');
      // Trainer can see all programs or maybe only their own. 
      // For this assignment, seeing all is fine or filtering by trainer_id.
      setPrograms(res.data.filter(p => p.trainer_id === user.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>My Training Sessions (Trainer)</h2>
      <div className="dashboard-grid">
        {programs.length === 0 ? <p>No programs assigned to you yet.</p> : programs.map(p => (
          <div key={p.id} className="glass-card program-card">
            <h3>{p.title}</h3>
            <div className="program-meta">
              <span><strong>Area:</strong> {p.area}</span>
              <span><strong>Audience:</strong> {p.target_audience}</span>
              <span><strong>Date:</strong> {new Date(p.schedule_date).toLocaleString()}</span>
              <span><strong>Venue:</strong> {p.venue}</span>
            </div>
            <p style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>{p.description}</p>
            <ProgramMaterials programId={p.id} userRole="trainer" />
            <ProgramFeedback programId={p.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainerDashboard;
