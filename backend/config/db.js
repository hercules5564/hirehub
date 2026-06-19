const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('your_')) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        // Seed demo accounts ONCE if this DB is empty. Idempotent: seedDemoData
        // returns early when users already exist, so real data is never wiped.
        await seedDemoData();
        return;
      } catch (err) {
        console.warn(`⚠️  Could not connect to ${process.env.MONGO_URI}: ${err.message}`);
        console.log('⏳ Falling back to in-memory MongoDB...');
      }
    }

    // Fallback: use mongodb-memory-server for development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ MongoDB In-Memory Server Connected (dev mode)');
    console.log('⚠️  Data will be lost on restart. Set MONGO_URI in .env for persistence.');

    // Auto-seed with sample data
    await seedDemoData();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

async function seedDemoData() {
  try {
    const User = require('../models/User');
    const Company = require('../models/Company');
    const Job = require('../models/Job');

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) return;

    console.log('🌱 Seeding demo data...');

    const users = await User.create([
      { name: 'Admin User', email: 'admin@hirehub.com', password: 'admin123', role: 'admin', isVerified: true },
      { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', role: 'recruiter', isVerified: true, location: 'Mumbai, India' },
      { name: 'Rahul Patel', email: 'rahul@example.com', password: 'password123', role: 'recruiter', isVerified: true, location: 'Bangalore, India' },
      { name: 'Ananya Singh', email: 'ananya@example.com', password: 'password123', role: 'candidate', isVerified: true, skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'], location: 'Delhi, India', bio: 'Full-stack developer with 3 years experience' },
      { name: 'Vikram Kumar', email: 'vikram@example.com', password: 'password123', role: 'candidate', isVerified: true, skills: ['Python', 'Django', 'PostgreSQL', 'AWS'], location: 'Hyderabad, India' },
    ]);

    const companies = await Company.create([
      { companyName: 'TechCorp India', location: 'Bangalore, India', description: 'Leading technology company building next-gen solutions.', industry: 'Technology', companySize: '201-500', recruiterId: users[1]._id, isVerified: true },
      { companyName: 'DataFlow Analytics', location: 'Mumbai, India', description: 'AI and Data Analytics company transforming businesses.', industry: 'Analytics', companySize: '51-200', recruiterId: users[1]._id, isVerified: true },
      { companyName: 'CloudNine Solutions', location: 'Hyderabad, India', description: 'Cloud infrastructure and DevOps solutions.', industry: 'Cloud', companySize: '51-200', recruiterId: users[2]._id, isVerified: true },
      { companyName: 'InnovateTech', location: 'Pune, India', description: 'Product-first startup building SaaS tools.', industry: 'SaaS', companySize: '11-50', recruiterId: users[2]._id, isVerified: true },
    ]);

    await Job.create([
      { title: 'Senior React Developer', companyId: companies[0]._id, recruiterId: users[1]._id, location: 'Bangalore, India', salary: { min: 1500000, max: 2500000 }, experienceRequired: { min: 3, max: 6 }, skillsRequired: ['React', 'Redux', 'TypeScript', 'Node.js'], jobType: 'full-time', description: 'We are looking for an experienced React developer to build modern web applications with our talented team.', requirements: 'Strong experience with React.js and modern JavaScript.', benefits: 'Health insurance, flexible hours, remote-friendly', openings: 3 },
      { title: 'Full Stack Developer', companyId: companies[0]._id, recruiterId: users[1]._id, location: 'Bangalore, India', salary: { min: 1200000, max: 2000000 }, experienceRequired: { min: 2, max: 5 }, skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express.js'], jobType: 'full-time', description: 'Join our team as a Full Stack Developer working on exciting MERN stack projects.', openings: 2 },
      { title: 'Python Backend Engineer', companyId: companies[1]._id, recruiterId: users[1]._id, location: 'Mumbai, India', salary: { min: 1800000, max: 3000000 }, experienceRequired: { min: 4, max: 8 }, skillsRequired: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'], jobType: 'full-time', description: 'Build robust backend systems powering our analytics platform.', openings: 2 },
      { title: 'DevOps Engineer', companyId: companies[2]._id, recruiterId: users[2]._id, location: 'Hyderabad, India', salary: { min: 1600000, max: 2800000 }, experienceRequired: { min: 3, max: 7 }, skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'], jobType: 'full-time', description: 'Manage and optimize cloud infrastructure for enterprise clients.', openings: 2 },
      { title: 'UI/UX Design Intern', companyId: companies[3]._id, recruiterId: users[2]._id, location: 'Pune, India', salary: { min: 200000, max: 400000 }, experienceRequired: { min: 0, max: 1 }, skillsRequired: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'], jobType: 'internship', description: 'Learn and grow as a UI/UX designer working on real SaaS products.', openings: 3 },
      { title: 'Remote Frontend Developer', companyId: companies[3]._id, recruiterId: users[2]._id, location: 'Remote', salary: { min: 1000000, max: 1800000 }, experienceRequired: { min: 2, max: 4 }, skillsRequired: ['React', 'Vue.js', 'CSS', 'Tailwind'], jobType: 'remote', description: 'Work remotely building beautiful frontend applications.', openings: 2 },
      { title: 'Java Microservices Developer', companyId: companies[0]._id, recruiterId: users[1]._id, location: 'Chennai, India', salary: { min: 1400000, max: 2200000 }, experienceRequired: { min: 3, max: 6 }, skillsRequired: ['Java', 'Spring Boot', 'Microservices', 'MySQL'], jobType: 'full-time', description: 'Build scalable microservices for our enterprise platform.', openings: 2 },
      { title: 'Data Analyst', companyId: companies[1]._id, recruiterId: users[1]._id, location: 'Mumbai, India', salary: { min: 800000, max: 1400000 }, experienceRequired: { min: 1, max: 3 }, skillsRequired: ['SQL', 'Python', 'Tableau', 'Power BI'], jobType: 'full-time', description: 'Analyze data and generate insights for business stakeholders.', openings: 1 },
    ]);

    console.log('✅ Demo data seeded: 5 users, 4 companies, 8 jobs');
    console.log('   Accounts: admin@hirehub.com/admin123, priya@example.com/password123, ananya@example.com/password123');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

module.exports = connectDB;
