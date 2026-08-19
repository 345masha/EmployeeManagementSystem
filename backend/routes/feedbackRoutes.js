const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.submitFeedback);
router.get('/program/:programId', feedbackController.getFeedbackByProgram);

module.exports = router;
