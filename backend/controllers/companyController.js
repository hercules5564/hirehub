const Company = require('../models/Company');

exports.createCompany = async (req, res, next) => {
  try {
    req.body.recruiterId = req.user._id;
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company });
  } catch (error) { next(error); }
};

exports.getCompanies = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const query = {};
    if (search) query.companyName = { $regex: search, $options: 'i' };
    const total = await Company.countDocuments(query);
    const companies = await Company.find(query).populate('recruiterId', 'name email').sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit));
    res.status(200).json({ success: true, companies, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('recruiterId', 'name email profileImage');
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.status(200).json({ success: true, company });
  } catch (error) { next(error); }
};

exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    if (company.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, company });
  } catch (error) { next(error); }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    if (company.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Company deleted' });
  } catch (error) { next(error); }
};

exports.getMyCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ recruiterId: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, companies });
  } catch (error) { next(error); }
};

exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    if (company.recruiterId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    company.logo = req.file.path;
    await company.save();
    res.status(200).json({ success: true, company });
  } catch (error) { next(error); }
};
