const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

// @desc    Get all jobs with filters, search, pagination
// @route   GET /api/jobs
exports.getJobs = async (req, res, next) => {
  try {
    const {
      search, location, jobType, salaryMin, salaryMax,
      experienceMin, experienceMax, skills, status,
      page = 1, limit = 12, sort = '-postedDate',
    } = req.query;

    const query = { status: status || 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Salary filter
    if (salaryMin || salaryMax) {
      query['salary.min'] = {};
      if (salaryMin) query['salary.min'].$gte = parseInt(salaryMin);
      if (salaryMax) query['salary.max'] = { $lte: parseInt(salaryMax) };
    }

    // Experience filter
    if (experienceMin !== undefined || experienceMax !== undefined) {
      if (experienceMin !== undefined) {
        query['experienceRequired.min'] = { $gte: parseInt(experienceMin) };
      }
      if (experienceMax !== undefined) {
        query['experienceRequired.max'] = { $lte: parseInt(experienceMax) };
      }
    }

    // Skills filter
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      query.skillsRequired = { $in: skillArray.map((s) => new RegExp(s, 'i')) };
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId', 'companyName logo location')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'companyName logo location website description industry companySize')
      .populate('recruiterId', 'name profileImage');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/jobs
exports.createJob = async (req, res, next) => {
  try {
    // Verify company belongs to recruiter
    const company = await Company.findOne({ _id: req.body.companyId, recruiterId: req.user._id });
    if (!company) {
      return res.status(403).json({ success: false, message: 'You can only post jobs for your own company' });
    }

    req.body.recruiterId = req.user._id;
    const job = await Job.create(req.body);

    const populatedJob = await Job.findById(job._id).populate('companyId', 'companyName logo location');

    res.status(201).json({ success: true, job: populatedJob });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('companyId', 'companyName logo location');

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter/my-jobs
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate('companyId', 'companyName logo location')
      .sort('-createdAt');

    // Get application counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationsCount = await Application.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicationsCount };
      })
    );

    res.status(200).json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured / latest jobs
// @route   GET /api/jobs/featured
exports.getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('companyId', 'companyName logo location')
      .sort('-applicationsCount -postedDate')
      .limit(8);

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};
