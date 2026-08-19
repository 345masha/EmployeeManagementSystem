const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to prevent name collisions
    }
});

const upload = multer({ storage: storage });

// Routes for materials belonging to a specific program
router.post('/programs/:id/materials', upload.single('material'), materialController.uploadMaterial);
router.get('/programs/:id/materials', materialController.getMaterialsByProgram);

module.exports = router;
