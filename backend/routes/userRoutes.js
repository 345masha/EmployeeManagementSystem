const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/trainers', async (req, res) => {
    try {
        const [trainers] = await pool.query('SELECT id, name, email FROM users WHERE role = "trainer"');
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
