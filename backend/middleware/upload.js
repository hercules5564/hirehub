const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Resume upload storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hirehub/resumes',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
    transformation: [],
  },
});

// Image upload storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hirehub/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

module.exports = { uploadResume, uploadImage };
