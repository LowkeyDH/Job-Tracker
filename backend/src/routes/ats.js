const express = require('express');
const router = express.Router();
const atsController = require('../controllers/atsController');

router.post('/', atsController.analyzeATS);

module.exports = router;
