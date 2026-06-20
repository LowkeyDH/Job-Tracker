const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchController = require('../controllers/matchController');

router.use(auth);
router.post('/', matchController.matchResume);

module.exports = router;
