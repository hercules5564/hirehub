const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const User = require('../models/User');
const SavedJob = require('../models/SavedJob');
const EmailService = require('../services/emailService');

// @desc    Apply for a job
// @route   POST /api/applications
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId).populate('companyId', 'companyName');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'active') return res.status(400).json({ success: false, message: 'Job is no longer active' });
    const existing = await Application.findOne({ jobId, candidateId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied for this job' });

    const application = await Application.create({
      jobId, candidateId: req.user._id, resumeUrl: req.user.resumeUrl || '', coverLetter,
    });
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    // Notify recruiter
    await Notification.create({
      userId: job.recruiterId, type: 'new_applicant',
      title: 'New Application', message: `${req.user.name} applied for ${job.title}`,
      link: `/recruiter/jobs/${jobId}/applicants`,
    });

    res.status(201).json({ success: true, application });
  } catch (error) { next(error); }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/my
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({ path: 'jobId', select: 'title location jobType salary companyId status', populate: { path: 'companyId', select: 'companyName logo' } })
      .sort('-appliedAt');
    res.status(200).json({ success: true, applications });
  } catch (error) { next(error); }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
exports.getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email phone skills experience education resumeUrl profileImage location')
      .sort('-appliedAt');
    res.status(200).json({ success: true, applications, total: applications.length });
  } catch (error) { next(error); }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, interviewDate, recruiterNotes } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId', 'title recruiterId');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    if (recruiterNotes) application.recruiterNotes = recruiterNotes;
    await application.save();

    // Notify candidate
    await Notification.create({
      userId: application.candidateId, type: 'application_update',
      title: 'Application Update', message: `Your application for ${application.jobId.title} has been ${status}`,
      link: '/applications',
    });

    // Send email notification
    const candidate = await User.findById(application.candidateId);
    if (candidate) EmailService.sendApplicationStatusEmail(candidate, application.jobId.title, status).catch(console.error);

    res.status(200).json({ success: true, application });
  } catch (error) { next(error); }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.candidateId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    application.status = 'withdrawn';
    await application.save();
    res.status(200).json({ success: true, application });
  } catch (error) { next(error); }
};

// @desc    Save/bookmark job
// @route   POST /api/applications/save/:jobId
exports.saveJob = async (req, res, next) => {
  try {
    const existing = await SavedJob.findOne({ userId: req.user._id, jobId: req.params.jobId });
    if (existing) {
      await SavedJob.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, saved: false, message: 'Job unsaved' });
    }
    await SavedJob.create({ userId: req.user._id, jobId: req.params.jobId });
    res.status(201).json({ success: true, saved: true, message: 'Job saved' });
  } catch (error) { next(error); }
};

// @desc    Get saved jobs
// @route   GET /api/applications/saved
exports.getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'companyName logo location' } })
      .sort('-createdAt');
    res.status(200).json({ success: true, savedJobs: saved });
  } catch (error) { next(error); }
};
