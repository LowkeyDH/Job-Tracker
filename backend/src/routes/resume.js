const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

const upload = multer({ dest: 'uploads/' });

router.use(auth);

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/:id/analysis', resumeController.getAnalysis);

module.exports = router;
