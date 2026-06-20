const express = require('express');
const router = express.Router();
const { searchJobs } = require('../controllers/jobSearchController');

router.get('/', searchJobs);

module.exports = router;
