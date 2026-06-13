const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
  },
  logo: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    required: [true, 'Please provide company location'],
  },
  description: {
    type: String,
    required: [true, 'Please provide company description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  industry: {
    type: String,
    default: '',
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', ''],
    default: '',
  },
  founded: {
    type: Number,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

companySchema.pre('save', function (next) {
  if (this.isModified('companyName')) {
    this.slug = this.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);
