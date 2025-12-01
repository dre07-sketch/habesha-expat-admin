require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { DB_TYPE } = require('../server/connection/db');
const ArticleRoutes = require('./route/Article');
const B2BRoutes = require('./route/B2B');
const JobRoutes = require('./route/Jobs');
const NewsletterRoutes = require('./route/Newsletter');
const EventRoutes = require('./route/Event');
const AdRoutes = require('./route/Ad');
const CategoryRoutes = require('./route/Category');
const subscriberRoutes = require('./route/subscribers');
const systemStatusRoutes = require('./route/system-status');
const PodcastRoutes = require('./route/Podcast');
const VideoRoutes = require('./route/Video');
const LoginRoutes = require('./auth/login');
const DashboardRoutes = require('./route/Dashboard');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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