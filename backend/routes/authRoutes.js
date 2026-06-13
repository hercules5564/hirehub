const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../utils/validators');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
