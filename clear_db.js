const pool = require('./backend/config/db');

async function clearDB() {
    try {
        console.log('Clearing database...');
        // Disable foreign key checks to allow truncating
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        
        await pool.query('TRUNCATE TABLE feedback');
        await pool.query('TRUNCATE TABLE training_programs');
        await pool.query('DELETE FROM users WHERE role != "admin"');
        
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('All login and registered details have been successfully deleted!');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing database:', err);
        process.exit(1);
    }
}

clearDB();
