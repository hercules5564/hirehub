const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompany, updateCompany, deleteCompany, getMyCompanies, uploadLogo } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { companyValidation } = require('../utils/validators');
const validate = require('../middleware/validate');
const { uploadImage } = require('../middleware/upload');

router.get('/my/companies', protect, authorize('recruiter'), getMyCompanies);
router.get('/', getCompanies);
router.get('/:id', getCompany);
router.post('/', protect, authorize('recruiter'), companyValidation, validate, createCompany);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateCompany);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteCompany);
router.put('/:id/logo', protect, authorize('recruiter'), uploadImage.single('logo'), uploadLogo);

module.exports = router;
