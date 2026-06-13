const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    default: '',
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'applied',
  },
  interviewDate: {
    type: Date,
  },
  interviewNotes: {
    type: String,
    default: '',
  },
  recruiterNotes: {
    type: String,
    default: '',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
