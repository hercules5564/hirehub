const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'bio', 'skills', 'education', 'experience', 'location', 'website', 'linkedin', 'github'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile image
// @route   PUT /api/users/profile-image
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    // Delete old image from Cloudinary if exists
    if (req.user.profileImage) {
      const publicId = req.user.profileImage.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: req.file.path },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   PUT /api/users/resume
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl: req.file.path },
      { new: true }
    );

    res.status(200).json({ success: true, user, resumeUrl: req.file.path });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public user profile
// @route   GET /api/users/:id
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-email -phone -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Increment profile views
    await User.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/users/account
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.cookie('token', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true });
    res.status(200).json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
