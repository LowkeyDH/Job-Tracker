const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');

router.post('/', careerController.analyzeCareer);

module.exports = router;
