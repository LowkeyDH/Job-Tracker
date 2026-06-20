const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const careerController = require('../controllers/careerController');

router.use(auth);
router.post('/', careerController.analyzeCareer);

module.exports = router;
