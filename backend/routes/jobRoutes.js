const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getRecruiterJobs, getFeaturedJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { jobValidation } = require('../utils/validators');
const validate = require('../middleware/validate');

router.get('/featured', getFeaturedJobs);
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);
router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter'), jobValidation, validate, createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
