const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfileImage, uploadResume, changePassword, getPublicProfile, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadImage, uploadResume: uploadResumeMiddleware } = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile-image', protect, uploadImage.single('profileImage'), uploadProfileImage);
router.put('/resume', protect, uploadResumeMiddleware.single('resume'), uploadResume);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);
router.get('/:id', getPublicProfile);

module.exports = router;
