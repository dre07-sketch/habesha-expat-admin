require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { DB_TYPE } = require('../server/connection/db');
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
const DashboardRoutes = require('./router/dashboard');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-----------login route----------------
app.use('/api/login', LoginRoutes);

//-----------API routes----------------
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/articles', ArticleRoutes);
app.use('/api/b2b', B2BRoutes);
app.use('/api/jobs', JobRoutes);
app.use('/api/newsletters', NewsletterRoutes);
app.use('/api/events', EventRoutes);
app.use('/api/ads', AdRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/system', systemStatusRoutes);
app.use('/api/podcasts', PodcastRoutes);
app.use('/api/videos', VideoRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to ${DB_TYPE === 'mysql' ? 'MySQL' : 'PostgreSQL'} database.`);
});