const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['candidate', 'recruiter']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('companyId').notEmpty().withMessage('Company is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('jobType').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
];

const companyValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  jobValidation,
  companyValidation,
};
