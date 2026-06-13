const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters'],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide job location'],
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
  },
  experienceRequired: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  skillsRequired: [{
    type: String,
    trim: true,
  }],
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time',
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  requirements: {
    type: String,
    default: '',
    maxlength: [3000, 'Requirements cannot exceed 3000 characters'],
  },
  benefits: {
    type: String,
    default: '',
    maxlength: [2000, 'Benefits cannot exceed 2000 characters'],
  },
  openings: {
    type: Number,
    default: 1,
    min: [1, 'At least 1 opening required'],
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft', 'moderated'],
    default: 'active',
  },
  deadline: {
    type: Date,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Text index for search
jobSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  skillsRequired: 'text',
});

jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiterId: 1 });

module.exports = mongoose.model('Job', jobSchema);
