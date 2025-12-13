const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

// ------------------------
//  DASHBOARD SUMMARY
// ------------------------
router.get('/summary', async (req, res) => {
    try {
        const sql = `
      SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM articles WHERE status = 'published') AS articles,
        (SELECT COUNT(*) FROM videos WHERE status = 'visible') AS videos,
        (SELECT COUNT(*) FROM podcasts WHERE status = 'visible') AS podcasts,
        (SELECT COUNT(*) FROM events WHERE status <> 'hidden') AS events,
        (SELECT COUNT(*) FROM businesses WHERE status <> 'hidden') AS businesses,
        (SELECT COUNT(*) FROM jobs WHERE status = 'visible') AS jobs,
        (SELECT COUNT(*) FROM subscribers WHERE status = 'active') AS subscribers
    `;

        const { rows } = await query(sql);
        const data = rows[0];

        res.json({
            success: true,
            data: {
                users: parseInt(data.users || '0', 10),
                articles: parseInt(data.articles || '0', 10),
                videos: parseInt(data.videos || '0', 10),
                podcasts: parseInt(data.podcasts || '0', 10),
                events: parseInt(data.events || '0', 10),
                businesses: parseInt(data.businesses || '0', 10),
                jobs: parseInt(data.jobs || '0', 10),
                subscribers: parseInt(data.subscribers || '0', 10)
            }
        });
    } catch (err) {
        console.error("❌ Error summary:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------
//  MONTHLY GROWTH
// ------------------------
router.get('/growth', async (req, res) => {
    const months = parseInt(req.query.months || '7', 10);

    try {
        const sql = `
      WITH months AS (
        SELECT 
          to_char(date_trunc('month', (CURRENT_DATE - (n || ' months')::interval)), 'Mon') AS month_label,
          date_trunc('month', (CURRENT_DATE - (n || ' months')::interval)) AS month_start
        FROM generate_series($1-1, 0, -1) AS n
      ),

      users_by_month AS (
        SELECT date_trunc('month', created_at) AS m, COUNT(*) AS cnt
        FROM users
        GROUP BY 1
      ),

      articles_by_month AS (
        SELECT date_trunc('month', created_at) AS m, COUNT(*) AS cnt
        FROM articles
        WHERE status = 'published'
        GROUP BY 1
      ),

      businesses_by_month AS (
        SELECT date_trunc('month', created_at) AS m, COUNT(*) AS cnt
        FROM businesses
        GROUP BY 1
      ),

      videos_by_month AS (
        SELECT date_trunc('month', upload_date) AS m, COUNT(*) AS cnt
        FROM videos
        WHERE status = 'visible'
        GROUP BY 1
      ),

      podcasts_by_month AS (
        SELECT date_trunc('month', created_at) AS m, COUNT(*) AS cnt
        FROM podcasts
        WHERE status = 'visible'
        GROUP BY 1
      )

      SELECT 
        months.month_label AS name,
        COALESCE(u.cnt, 0) AS users,
        COALESCE(a.cnt, 0) AS articles,
        COALESCE(b.cnt, 0) AS businesses,
        COALESCE(v.cnt, 0) AS videos,
        COALESCE(p.cnt, 0) AS podcasts
      FROM months
      LEFT JOIN users_by_month u ON u.m = months.month_start
      LEFT JOIN articles_by_month a ON a.m = months.month_start
      LEFT JOIN businesses_by_month b ON b.m = months.month_start
      LEFT JOIN videos_by_month v ON v.m = months.month_start
      LEFT JOIN podcasts_by_month p ON p.m = months.month_start
      ORDER BY months.month_start;
    `;

        const { rows } = await query(sql, [months]);
        res.json({ success: true, data: rows });

    } catch (err) {
        console.error("❌ Error growth:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});



// ------------------------
//  MEMBERSHIP DISTRIBUTION
// ------------------------
router.get('/membership', async (req, res) => {
    try {
        // Get membership counts
        const members = await query(`
      SELECT
        COUNT(*) FILTER (WHERE role ILIKE 'premium') AS premium,
        COUNT(*) FILTER (WHERE role ILIKE 'member' OR role IS NULL) AS free,
        COUNT(*) AS total
      FROM users
    `);

        // Get subscriber counts by plan
        const subs = await query(`
      SELECT plan, COUNT(*) AS count
      FROM subscribers
      GROUP BY plan
    `);

        // Calculate percentages
        const freeCount = members.rows[0].free;
        const premiumCount = members.rows[0].premium;
        const totalCount = members.rows[0].total;
        
        const freePercentage = totalCount > 0 ? Math.round((freeCount / totalCount) * 100) : 0;
        const premiumPercentage = totalCount > 0 ? Math.round((premiumCount / totalCount) * 100) : 0;

        // Define metrics objects
        const freeMetrics = {
            avg_activity: "3.2/week",
            retention: 42,
            conversion: 5.8
        };

        const premiumMetrics = {
            avg_activity: "8.7/week",
            retention: 87,
            revenue: "$24.8K"
        };

        const insights = {
            conversion_rate: 5.8,
            avg_premium_tenure: 14.2,
            churn_rate: 3.2
        };

        const trends = {
            free: "+8%",
            premium: "+15%",
            conversion_rate: "+1.2%",
            avg_premium_tenure: "+2.4",
            churn_rate: "-0.8%"
        };

        res.json({
            success: true,
            data: {
                free: freeCount,
                premium: premiumCount,
                total: totalCount,
                free_percentage: freePercentage,
                premium_percentage: premiumPercentage,
                subscribers_by_plan: subs.rows,
                free_metrics: freeMetrics,  // Fixed: use the defined variable
                premium_metrics: premiumMetrics,  // Fixed: use the defined variable
                insights,
                trends
            }
        });
    } catch (err) {
        console.error("❌ Error membership:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------
//  CONTENT ENGAGEMENT
// ------------------------
router.get('/engagement', async (req, res) => {
    try {
        const articles = await query(`
      SELECT a.id, a.title, a.views, a.image_url,
        COALESCE(c.comment_count, 0) AS comments,
        COALESCE(l.like_count, 0) AS likes
      FROM articles a
      LEFT JOIN (
        SELECT article_id, COUNT(*) AS comment_count 
        FROM comments 
        WHERE article_id IS NOT NULL
        GROUP BY article_id
      ) c ON c.article_id = a.id
      LEFT JOIN (
        SELECT article_id, COUNT(*) AS like_count 
        FROM likes 
        WHERE article_id IS NOT NULL
        GROUP BY article_id
      ) l ON l.article_id = a.id
      WHERE a.status = 'published'
      ORDER BY views DESC
      LIMIT 5
    `);

        const videos = await query(`
      SELECT id, title, views, thumbnail_url
      FROM videos
      WHERE status = 'visible'
      ORDER BY views DESC
      LIMIT 5
    `);

        const totals = await query(`
      SELECT 
        (SELECT COUNT(*) FROM likes) AS total_likes,
        (SELECT COUNT(*) FROM comments) AS total_comments
    `);

        res.json({
            success: true,
            data: {
                topArticles: articles.rows,
                topVideos: videos.rows,
                totals: totals.rows[0]
            }
        });
    } catch (err) {
        console.error("❌ Error engagement:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------
//  BUSINESS ANALYTICS
// ------------------------
router.get('/business', async (req, res) => {
    try {
        const total = await query(`SELECT COUNT(*) AS total FROM businesses WHERE status <> 'hidden'`);

        const categories = await query(`
      SELECT category, COUNT(*) AS count
      FROM businesses
      GROUP BY category
      ORDER BY count DESC
      LIMIT 8
    `);

        const reviews = await query(`
      SELECT 
        COUNT(*) AS total_reviews,
        AVG(rating)::numeric(3,2) AS avg_rating
      FROM business_reviews
    `);

        res.json({
            success: true,
            data: {
                total_businesses: total.rows[0].total,
                categories: categories.rows,
                reviews: reviews.rows[0]
            }
        });
    } catch (err) {
        console.error("❌ Error business analytics:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------
//  RECENT ARTICLES
// ------------------------
router.get('/articles/recent', async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit || '6'), 50);

    try {
        const sql = `
      SELECT a.id, a.title, a.slug, a.excerpt, a.image_url, a.views,
        a.category, a.author_name, a.created_at,
        COALESCE(c.comment_count, 0) AS comments
      FROM articles a
      LEFT JOIN (
        SELECT article_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY article_id
      ) c ON c.article_id = a.id
      WHERE a.status = 'published'
      ORDER BY a.publish_date DESC NULLS LAST, a.created_at DESC
      LIMIT $1
    `;
        const { rows } = await query(sql, [limit]);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("❌ Error recent articles:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------
//  TOP USER LOCATIONS
// ------------------------
router.get('/locations/top', async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit || '5'), 20);

    try {
        const sql = `
      SELECT COALESCE(location, 'Unknown') AS location,
             COUNT(*) AS count
      FROM users
      GROUP BY COALESCE(location, 'Unknown')
      ORDER BY count DESC
      LIMIT $1
    `;

        const { rows } = await query(sql, [limit]);
        res.json({ success: true, data: rows });

    } catch (err) {
        console.error("❌ Error locations:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------
module.exports = router;
