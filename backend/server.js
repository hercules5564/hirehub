const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'HireHub API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HireHub API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
