import { useState, useEffect } from 'react';
import axios from 'axios';

function ProgramMaterials({ programId, userRole }) {
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, [programId]);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/programs/${programId}/materials`);
      setMaterials(res.data);
    } catch (error) {
      console.error('Failed to fetch materials', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('material', file);

    try {
      await axios.post(`http://localhost:5000/api/programs/${programId}/materials`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      fetchMaterials();
      alert('Material uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Error uploading material');
    }
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
      <h4>Training Materials</h4>
      
      {materials.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {materials.map(m => (
            <li key={m.id} style={{ marginBottom: '0.5rem' }}>
              <a 
                href={`http://localhost:5000/uploads/${m.file_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--primary-light)', textDecoration: 'none' }}
              >
                📄 {m.file_name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '0.85rem', color: '#ccc' }}>No materials uploaded yet.</p>
      )}

      {userRole === 'trainer' && (
        <form onSubmit={handleUpload} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            style={{ fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
            Upload
          </button>
        </form>
      )}
    </div>
  );
}

export default ProgramMaterials;
