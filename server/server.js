require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { DB_TYPE, closePool } = require('./connection/db');
const ArticleRoutes = require('./router/Article');
const B2BRoutes = require('./router/B2B');
const JobRoutes = require('./router/Jobs');
const NewsletterRoutes = require('./router/Newsletter');
const EventRoutes = require('./router/Event');
const AdRoutes = require('./router/Ad');
const CategoryRoutes = require('./router/Category');
const subscriberRoutes = require('./router/subscribers');
const systemStatusRoutes = require('./router/system-status');
const PodcastRoutes = require('./router/Podcast');
const VideoRoutes = require('./router/Video');
const LoginRoutes = require('./auth/login');
const DashboardRoutes = require('./router/Dashboard.js');
const UserRoutes = require('./router/user');
const TravelDestinationsRoutes = require('./router/travelDestinations.js');
const ForgetPassRoutes = require('./auth/forgetpass');

const app = express();

// Security Middleware: Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow loading resources like images cross-origin if needed
}));

// Security Middleware: CORS
const allowedOrigins = [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // React default
    process.env.CLIENT_URL   // Production URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Security Middleware: Rate Limiting
// 1. Global Limiter (Apply to all API routes)
// 1. Global Limiter (Apply to all API routes)
// const globalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 200, // Limit each IP to 200 requests per windowMs
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: { message: "Too many requests from this IP, please try again after 15 minutes" }
// });
// app.use('/api', globalLimiter);

// 2. Strict Login Limiter
// 2. Strict Login Limiter
// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 10, // Limit each IP to 10 login attempts per windowMs
//     message: { message: "Too many login attempts, please try again after 15 minutes" },
//     standardHeaders: true,
//     legacyHeaders: false,
// });



app.use(bodyParser.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-----------login/public routes----------------
// app.use('/api/login', loginLimiter, LoginRoutes);
app.use('/api/login', LoginRoutes);
app.use('/api/forget-password', ForgetPassRoutes);

//-----------Protect all other API routes----------------
const { authenticateToken } = require('./middleware/auth');

app.use('/api/dashboard', authenticateToken, DashboardRoutes);
app.use('/api/articles', authenticateToken, ArticleRoutes);
app.use('/api/b2b', authenticateToken, B2BRoutes);
app.use('/api/jobs', authenticateToken, JobRoutes);
app.use('/api/newsletters', authenticateToken, NewsletterRoutes);
app.use('/api/events', authenticateToken, EventRoutes);
app.use('/api/ads', authenticateToken, AdRoutes);
app.use('/api/categories', authenticateToken, CategoryRoutes);
app.use('/api/subscribers', authenticateToken, subscriberRoutes);
app.use('/api/system', systemStatusRoutes);
app.use('/api/podcasts', authenticateToken, PodcastRoutes);
app.use('/api/videos', authenticateToken, VideoRoutes);
app.use('/api/users', authenticateToken, UserRoutes);
app.use('/api/travel-destinations', authenticateToken, TravelDestinationsRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to ${DB_TYPE === 'mysql' ? 'MySQL' : 'PostgreSQL'} database.`);
});

// Graceful shutdown
const sanitizeShutdown = async () => {
    console.log('Closing server...');
    if (closePool) {
        await closePool();
        console.log('Database pool closed.');
    }
    process.exit(0);
};

process.on('SIGINT', sanitizeShutdown);
process.on('SIGTERM', sanitizeShutdown);