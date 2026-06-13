const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication, saveJob, getSavedJobs } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('candidate'), applyForJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/saved', protect, getSavedJobs);
router.post('/save/:jobId', protect, saveJob);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('candidate'), withdrawApplication);

module.exports = router;
