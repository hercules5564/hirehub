const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, totalCompanies] = await Promise.all([
      User.countDocuments(), Job.countDocuments(), Application.countDocuments(), Company.countDocuments(),
    ]);
    const candidates = await User.countDocuments({ role: 'candidate' });
    const recruiters = await User.countDocuments({ role: 'recruiter' });
    const activeJobs = await Job.countDocuments({ status: 'active' });

    const recentUsers = await User.find().sort('-createdAt').limit(10).select('name email role createdAt isActive isVerified');
    const recentJobs = await Job.find().sort('-createdAt').limit(10).populate('companyId', 'companyName').select('title location jobType status createdAt');

    res.status(200).json({
      success: true, stats: { totalUsers, candidates, recruiters, totalJobs, activeJobs, totalApplications, totalCompanies },
      recentUsers, recentJobs,
    });
  } catch (error) { next(error); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    res.status(200).json({ success: true, users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { isActive, role, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, role, isVerified }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

exports.moderateJob = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, job });
  } catch (error) { next(error); }
};
