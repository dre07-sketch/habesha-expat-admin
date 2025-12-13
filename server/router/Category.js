const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

router.post('/categories-post', async (req, res) => {
    try {
        const { name, type } = req.body;

        const sql = `
            INSERT INTO categories (name, type)
            VALUES ($1, $2)
            RETURNING id
        `;

        const result = await query(sql, [name, type]);

        res.status(201).json({
            success: true,
            message: 'Category added',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/categories-get', async (req, res) => {
    try {
        const sql = `SELECT id, name, type FROM categories ORDER BY name ASC`;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Category
router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Note: If other tables reference this category with a foreign key, you need ON DELETE CASCADE
        await query(`DELETE FROM categories WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/category-counts", async (req, res) => {
  try {
    const sql = `
      SELECT
        c.name AS category_name,
        c.type AS category_type,
        
        -- Count from businesses table
        (SELECT COUNT(*) FROM businesses b WHERE b.category = c.name) AS business_count,
        
        -- Count from articles table
        (SELECT COUNT(*) FROM articles a WHERE a.category = c.name) AS article_count,
        
        -- Count from podcasts table
        (SELECT COUNT(*) FROM podcasts p WHERE p.category = c.name) AS podcast_count,
        
        -- Count from videos table
        (SELECT COUNT(*) FROM videos v WHERE v.category = c.name) AS video_count
        
      FROM categories c
      ORDER BY c.name ASC;
    `;

    // Changed from db.query to just query
    const result = await query(sql);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("❌ Error fetching category counts:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/category/:name/insight", async (req, res) => {
  try {
    const { name } = req.params;

    // 1️⃣ Get category details
    const categorySql = `
      SELECT id, name, type, status
      FROM categories 
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1;
    `;
    const categoryResult = await db.query(categorySql, [name]);

    if (categoryResult.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const category = categoryResult.rows[0];
    const table = category.type; // business / article / podcast / video
    const validTables = ["businesses", "articles", "podcasts", "videos"];

    if (!validTables.includes(table + "s")) {
      return res.status(400).json({ error: "Invalid category type" });
    }

    const tableName = table + "s"; // convert type → table

    // 2️⃣ Count total items for this category
    const countSql = `
      SELECT COUNT(*) AS total
      FROM ${tableName}
      WHERE LOWER(category) = LOWER($1);
    `;
    const countResult = await db.query(countSql, [name]);
    const totalItems = parseInt(countResult.rows[0].total);

    // 3️⃣ Monthly views
    const viewsSql = `
      SELECT COALESCE(SUM(monthly_views), 0) AS views
      FROM ${tableName}
      WHERE LOWER(category) = LOWER($1);
    `;
    const viewsResult = await db.query(viewsSql, [name]);
    const monthlyViews = viewsResult.rows[0].views;

    // 4️⃣ Recent items (limit 10)
    const recentSql = `
      SELECT id, title, image, created_at, views
      FROM ${tableName}
      WHERE LOWER(category) = LOWER($1)
      ORDER BY created_at DESC
      LIMIT 10;
    `;
    const recentResult = await db.query(recentSql, [name]);

    // 5️⃣ Build SEO URL
    const seoUrl = `https://habeshasexpat.com/category/${category.name.toLowerCase()}`;

    // 6️⃣ Final response
    res.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        type: category.type,
        status: category.status,
        seo_url: seoUrl
      },
      total_items: totalItems,
      monthly_views: monthlyViews,
      recents: recentResult.rows
    });

  } catch (error) {
    console.error("❌ Category insight error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/categories/usage', async (req, res) => {
  try {
    const sql = `
      WITH valid AS (
        SELECT name FROM categories
      ),

      article_counts AS (
        SELECT a.category AS name, COUNT(*) AS count
        FROM articles a
        INNER JOIN valid v ON v.name = a.category
        GROUP BY a.category
      ),

      podcast_counts AS (
        SELECT p.category AS name, COUNT(*) AS count
        FROM podcasts p
        INNER JOIN valid v ON v.name = p.category
        GROUP BY p.category
      ),

      video_counts AS (
        SELECT v.category AS name, COUNT(*) AS count
        FROM videos v
        INNER JOIN valid c ON c.name = v.category
        GROUP BY v.category
      ),

      business_counts AS (
        SELECT b.category AS name, COUNT(*) AS count
        FROM businesses b
        INNER JOIN valid v ON v.name = b.category
        GROUP BY b.category
      )

      SELECT name, count, 'articles' AS source FROM article_counts
      UNION ALL
      SELECT name, count, 'podcasts' AS source FROM podcast_counts
      UNION ALL
      SELECT name, count, 'videos' AS source FROM video_counts
      UNION ALL
      SELECT name, count, 'businesses' AS source FROM business_counts;
    `;

    const { rows } = await query(sql);

    res.json({
      success: true,
      usedCategories: rows
    });

  } catch (error) {
    console.error('Error checking category usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category usage',
      error: error.message
    });
  }
});



module.exports = router;