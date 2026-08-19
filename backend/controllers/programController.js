const pool = require('../config/db');

exports.getAllPrograms = async (req, res) => {
    try {
        const [programs] = await pool.query(`
            SELECT p.*, u.name as trainer_name 
            FROM training_programs p 
            JOIN users u ON p.trainer_id = u.id
            ORDER BY p.schedule_date DESC
        `);
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createProgram = async (req, res) => {
    try {
        const { title, area, trainer_id, target_audience, schedule_date, venue, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO training_programs (title, area, trainer_id, target_audience, schedule_date, venue, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, area, trainer_id, target_audience, schedule_date, venue, description]
        );
        res.status(201).json({ message: 'Program created successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProgramById = async (req, res) => {
    try {
        const [programs] = await pool.query(`
            SELECT p.*, u.name as trainer_name 
            FROM training_programs p 
            JOIN users u ON p.trainer_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (programs.length === 0) {
            return res.status(404).json({ message: 'Program not found' });
        }
        res.json(programs[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteProgram = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        
        // Fetch the program to move
        const [programs] = await connection.query('SELECT * FROM training_programs WHERE id = ?', [id]);
        if (programs.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Program not found' });
        }
        
        const program = programs[0];
        
        // Insert into deleted_programs
        await connection.query(
            'INSERT INTO deleted_programs (id, title, area, trainer_id, target_audience, schedule_date, venue, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [program.id, program.title, program.area, program.trainer_id, program.target_audience, program.schedule_date, program.venue, program.description]
        );
        
        // Delete from training_programs
        const [result] = await connection.query('DELETE FROM training_programs WHERE id = ?', [id]);
        
        await connection.commit();
        res.json({ message: 'Program deleted successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        connection.release();
    }
};
