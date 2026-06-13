const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Company.deleteMany(), Job.deleteMany(), Application.deleteMany()]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@hirehub.com', password: 'admin123', role: 'admin', isVerified: true },
      { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', role: 'recruiter', isVerified: true, phone: '+91-9876543210', location: 'Mumbai, India' },
      { name: 'Rahul Patel', email: 'rahul@example.com', password: 'password123', role: 'recruiter', isVerified: true, phone: '+91-9876543211', location: 'Bangalore, India' },
      { name: 'Ananya Singh', email: 'ananya@example.com', password: 'password123', role: 'candidate', isVerified: true, skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'CSS'], location: 'Delhi, India', bio: 'Full-stack developer with 3 years of experience' },
      { name: 'Vikram Kumar', email: 'vikram@example.com', password: 'password123', role: 'candidate', isVerified: true, skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'], location: 'Hyderabad, India', bio: 'Backend developer passionate about scalable systems' },
      { name: 'Sneha Reddy', email: 'sneha@example.com', password: 'password123', role: 'candidate', isVerified: true, skills: ['Java', 'Spring Boot', 'MySQL', 'Microservices'], location: 'Chennai, India', bio: 'Java developer with enterprise experience' },
    ]);

    console.log(`Created ${users.length} users`);

    // Create companies
    const companies = await Company.create([
      { companyName: 'TechCorp India', location: 'Bangalore, India', description: 'Leading technology company building next-gen solutions for enterprise clients.', industry: 'Technology', companySize: '201-500', founded: 2015, recruiterId: users[1]._id, website: 'https://techcorp.in', isVerified: true },
      { companyName: 'DataFlow Analytics', location: 'Mumbai, India', description: 'AI and Data Analytics company transforming businesses with data-driven insights.', industry: 'Analytics', companySize: '51-200', founded: 2018, recruiterId: users[1]._id, website: 'https://dataflow.io', isVerified: true },
      { companyName: 'CloudNine Solutions', location: 'Hyderabad, India', description: 'Cloud infrastructure and DevOps company providing cutting-edge cloud solutions.', industry: 'Cloud Computing', companySize: '51-200', founded: 2019, recruiterId: users[2]._id, website: 'https://cloudnine.dev', isVerified: true },
      { companyName: 'InnovateTech', location: 'Pune, India', description: 'Product-first startup building innovative SaaS tools for modern teams.', industry: 'SaaS', companySize: '11-50', founded: 2021, recruiterId: users[2]._id, isVerified: true },
    ]);

    console.log(`Created ${companies.length} companies`);

    // Create jobs
    const jobs = await Job.create([
      { title: 'Senior React Developer', companyId: companies[0]._id, recruiterId: users[1]._id, location: 'Bangalore, India', salary: { min: 1500000, max: 2500000, currency: 'INR' }, experienceRequired: { min: 3, max: 6 }, skillsRequired: ['React', 'Redux', 'TypeScript', 'Node.js', 'CSS'], jobType: 'full-time', description: 'We are looking for an experienced React developer to build modern web applications. You will work with a team of talented engineers to deliver high-quality products.', requirements: 'Strong experience with React.js, Redux, and modern JavaScript. Experience with TypeScript is a plus.', benefits: 'Health insurance, flexible hours, remote-friendly, annual bonus', openings: 3 },
      { title: 'Full Stack Developer', companyId: companies[0]._id, recruiterId: users[1]._id, location: 'Bangalore, India', salary: { min: 1200000, max: 2000000, currency: 'INR' }, experienceRequired: { min: 2, max: 5 }, skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express.js'], jobType: 'full-time', description: 'Join our team as a Full Stack Developer working on exciting projects using the MERN stack.', requirements: 'Proficiency in MERN stack. Understanding of RESTful APIs and database design.', benefits: 'Stock options, health insurance, learning budget', openings: 2 },
      { title: 'Python Backend Engineer', companyId: companies[1]._id, recruiterId: users[1]._id, location: 'Mumbai, India', salary: { min: 1800000, max: 3000000, currency: 'INR' }, experienceRequired: { min: 4, max: 8 }, skillsRequired: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'], jobType: 'full-time', description: 'Build robust backend systems powering our analytics platform.', requirements: 'Deep experience with Python and Django. Strong understanding of database optimization.', benefits: 'Remote-first, health insurance, conference budget', openings: 2 },
      { title: 'DevOps Engineer', companyId: companies[2]._id, recruiterId: users[2]._id, location: 'Hyderabad, India', salary: { min: 1600000, max: 2800000, currency: 'INR' }, experienceRequired: { min: 3, max: 7 }, skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'], jobType: 'full-time', description: 'Manage and optimize cloud infrastructure for enterprise clients.', openings: 2 },
      { title: 'UI/UX Design Intern', companyId: companies[3]._id, recruiterId: users[2]._id, location: 'Pune, India', salary: { min: 200000, max: 400000, currency: 'INR' }, experienceRequired: { min: 0, max: 1 }, skillsRequired: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'], jobType: 'internship', description: 'Learn and grow as a UI/UX designer working on real SaaS products.', openings: 3 },
      { title: 'Remote Frontend Developer', companyId: companies[3]._id, recruiterId: users[2]._id, location: 'Remote', salary: { min: 1000000, max: 1800000, currency: 'INR' }, experienceRequired: { min: 2, max: 4 }, skillsRequired: ['React', 'Vue.js', 'CSS', 'JavaScript', 'Tailwind'], jobType: 'remote', description: 'Work remotely on building beautiful and performant frontend applications.', openings: 2 },
      { title: 'Java Microservices Developer', companyId: companies[0]._id, recruiterId: users[1]._id, location: 'Chennai, India', salary: { min: 1400000, max: 2200000, currency: 'INR' }, experienceRequired: { min: 3, max: 6 }, skillsRequired: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'MySQL'], jobType: 'full-time', description: 'Build scalable microservices for our enterprise platform.', openings: 2 },
      { title: 'Data Analyst - Part Time', companyId: companies[1]._id, recruiterId: users[1]._id, location: 'Mumbai, India', salary: { min: 500000, max: 800000, currency: 'INR' }, experienceRequired: { min: 1, max: 3 }, skillsRequired: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI'], jobType: 'part-time', description: 'Analyze data and generate insights for business stakeholders.', openings: 1 },
    ]);

    console.log(`Created ${jobs.length} jobs`);

    // Create sample applications
    await Application.create([
      { jobId: jobs[0]._id, candidateId: users[3]._id, status: 'shortlisted', coverLetter: 'I am excited about this opportunity...' },
      { jobId: jobs[1]._id, candidateId: users[3]._id, status: 'applied' },
      { jobId: jobs[2]._id, candidateId: users[4]._id, status: 'interview', interviewDate: new Date('2026-06-20') },
      { jobId: jobs[6]._id, candidateId: users[5]._id, status: 'applied' },
    ]);

    console.log('Created sample applications');
    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin:     admin@hirehub.com / admin123');
    console.log('Recruiter: priya@example.com / password123');
    console.log('Candidate: ananya@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
