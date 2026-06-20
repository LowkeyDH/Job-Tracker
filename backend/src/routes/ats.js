const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const atsController = require('../controllers/atsController');

router.use(auth);
router.post('/', atsController.analyzeATS);

module.exports = router;
