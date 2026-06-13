const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, deleteUser, moderateJob } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/jobs/:id/moderate', moderateJob);

module.exports = router;
