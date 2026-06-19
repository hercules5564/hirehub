const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication, saveJob, getSavedJobs, updateAutoApply, runAutoApply } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('candidate'), applyForJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/saved', protect, getSavedJobs);

// AI auto-apply (candidate)
router.put('/auto-apply', protect, authorize('candidate'), updateAutoApply);
router.post('/auto-apply/run', protect, authorize('candidate'), runAutoApply);
router.post('/save/:jobId', protect, saveJob);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('candidate'), withdrawApplication);

module.exports = router;
