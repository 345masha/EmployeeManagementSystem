const pool = require('../config/db');

exports.uploadMaterial = async (req, res) => {
    try {
        const { id } = req.params; // program_id
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileName = file.originalname;
        const filePath = file.filename; // Multer saves it with a unique name

        const [result] = await pool.query(
            'INSERT INTO program_materials (program_id, file_name, file_path) VALUES (?, ?, ?)',
            [id, fileName, filePath]
        );

        res.status(201).json({ id: result.insertId, program_id: id, file_name: fileName, file_path: filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMaterialsByProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const [materials] = await pool.query('SELECT * FROM program_materials WHERE program_id = ? ORDER BY created_at DESC', [id]);
        res.json(materials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
