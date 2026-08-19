const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const programRoutes = require('./routes/programRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const materialRoutes = require('./routes/materialRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', materialRoutes); // Note: defined as /programs/:id/materials inside
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;

const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function initializeAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@amex.com';
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
        if (existing.length === 0) {
            const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            
            await pool.query(
                'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['System Administrator', adminEmail, hashedPassword, 'admin']
            );
            console.log(`Default admin account created: ${adminEmail}`);
        } else {
            console.log(`Admin account already exists: ${adminEmail}`);
        }
    } catch (error) {
        console.error('Error initializing admin account:', error);
    }
}

initializeAdmin();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
