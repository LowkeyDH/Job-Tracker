const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/:id/analysis', resumeController.getAnalysis);

module.exports = router;
