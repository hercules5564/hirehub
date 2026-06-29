const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, deleteUser, moderateJob, getJobs, deleteJob, getCompanies, deleteCompany } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getJobs);
router.put('/jobs/:id/moderate', moderateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/companies', getCompanies);
router.delete('/companies/:id', deleteCompany);

module.exports = router;
