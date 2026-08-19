const pool = require('../config/db');

exports.submitFeedback = async (req, res) => {
    try {
        const { program_id, user_id, rating, comments } = req.body;
        const [result] = await pool.query(
            'INSERT INTO feedback (program_id, user_id, rating, comments) VALUES (?, ?, ?, ?)',
            [program_id, user_id, rating, comments]
        );
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getFeedbackByProgram = async (req, res) => {
    try {
        const [feedback] = await pool.query(`
            SELECT f.*, u.name as user_name, u.role as user_role
            FROM feedback f
            JOIN users u ON f.user_id = u.id
            WHERE f.program_id = ?
            ORDER BY f.created_at DESC
        `, [req.params.programId]);
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
