const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');


// --- 1. Top Summary Stats ---
router.get('/summary-stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM businesses) AS total_b2b_requests,
                (SELECT COUNT(*) FROM jobs) AS jobs_posted,
                (SELECT COUNT(*) FROM podcasts) AS total_podcasts,
                (SELECT COUNT(*) FROM videos) AS total_videos,
                (SELECT COUNT(*) FROM articles) AS total_articles,
                (SELECT COUNT(*) FROM events) AS total_events
        `);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 2. Monthly Growth Trends ---
router.get('/growth-trends', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                to_char(created_at, 'Mon') AS month,
                COUNT(DISTINCT user_id) AS users,
                COUNT(DISTINCT article_id) AS articles,
                COUNT(DISTINCT business_id) AS businesses
            FROM growth_data
            GROUP BY month
            ORDER BY date_part('month', created_at)
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 3. Membership Distribution ---
router.get('/membership', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                membership_type,
                COUNT(*) AS total
            FROM users
            GROUP BY membership_type
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 4. Content Engagement ---
router.get('/content-engagement', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 'Articles' AS label, COUNT(*) AS views FROM articles
            UNION ALL
            SELECT 'Videos', COUNT(*) FROM videos
            UNION ALL
            SELECT 'Podcasts', COUNT(*) FROM podcasts
            UNION ALL
            SELECT 'Events', COUNT(*) FROM events
            UNION ALL
            SELECT 'Directory', COUNT(*) FROM businesses
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 5. Business Directory Analytics ---
router.get('/business-analytics', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM businesses) AS total_businesses,
                (SELECT COUNT(*) FROM reviews) AS total_reviews,
                (SELECT COUNT(*) FROM businesses WHERE created_at >= NOW() - INTERVAL '7 days') AS new_listings
        `);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 6. Popular Business Categories ---
router.get('/popular-categories', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT category_name AS label,
                   COUNT(*) AS count,
                   ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM businesses), 1) AS pct
            FROM businesses
            GROUP BY category_name
            ORDER BY count DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 7. Top Active Regions ---
router.get('/top-regions', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT country AS name,
                   COUNT(*) AS value,
                   ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users)), 1) AS growth
            FROM users
            GROUP BY country
            ORDER BY value DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
/// this is an api

module.exports = router;


