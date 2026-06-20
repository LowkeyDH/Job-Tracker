const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobController = require('../controllers/jobController');

router.use(auth);

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
