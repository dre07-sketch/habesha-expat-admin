const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, DB_TYPE } = require('../connection/db');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });



router.post('/articles-post', upload.single('image'), async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, author, publishDate } = req.body;

    // Get image path if uploaded
    const imagePath = req.file ? `/upload/${req.file.filename}` : null;

    const sql = `
      INSERT INTO articles 
        (title, slug, excerpt, content, category, author_name, publish_date, image_url, status)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
      RETURNING id
    `;

    const result = await query(sql, [
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      publishDate,
      imagePath
    ]);

    res.status(201).json({
      success: true,
      message: 'Article saved as draft',
      id: result.rows[0].id,
      imageUrl: imagePath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});





router.get("/articles-get", async (req, res) => {
  try {
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const sql = `
      SELECT 
        id,
        title,
        slug,
        excerpt,
        content,
        image_url,
        category,
        author_name,
        status,
        views,
        publish_date,
        created_at
      FROM articles
      ORDER BY publish_date DESC;
    `;

    const { rows } = await query(sql);

    const formatted = rows.map(article => {
      let finalImage = null;

      if (article.image_url) {
        // 1. Replace Windows backslashes (\) with forward slashes (/)
        // 2. Remove any double leading slashes just in case
        let cleanPath = article.image_url.replace(/\\/g, '/').replace(/^\/+/, '');

        // 3. Fix potential mismatch between 'uploads' (DB) and 'upload' (server folder)
        if (cleanPath.startsWith('uploads/')) {
          cleanPath = cleanPath.replace('uploads/', 'upload/');
        } else if (!cleanPath.startsWith('upload/')) {
          // If it doesn't have a folder prefix, assume it belongs in upload/
          cleanPath = `upload/${cleanPath}`;
        }

        // 4. Construct the full URL
        finalImage = `${baseURL}/${cleanPath}`;
      }

      return {
        ...article,
        image: finalImage
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles." });
  }
});



router.post('/toggle-status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get current article
    const articleQuery = `
            SELECT status 
            FROM articles
            WHERE id = $1
        `;
    const articleResult = await query(articleQuery, [id]);

    if (articleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const currentStatus = articleResult.rows[0].status;

    // 2. Determine new status (using 'draft' for consistency)
    let newStatus = currentStatus === 'published' ? 'draft' : 'published';

    // 3. Update status (cast parameter to text to avoid type ambiguity)
    const updateQuery = `
            UPDATE articles
            SET status = $1::text
            WHERE id = $2
            RETURNING *;
        `;
    const updateResult = await query(updateQuery, [newStatus, id]);

    // Format the returned article with the correct image URL so the frontend doesn't crash
    const rawArticle = updateResult.rows[0];
    let finalImage = null;
    const baseURL = `${req.protocol}://${req.get("host")}`;

    if (rawArticle.image_url) {
      let cleanPath = rawArticle.image_url.replace(/\\/g, '/').replace(/^\/+/, '');
      if (cleanPath.startsWith('uploads/')) {
        cleanPath = cleanPath.replace('uploads/', 'upload/');
      } else if (!cleanPath.startsWith('upload/')) {
        cleanPath = `upload/${cleanPath}`;
      }
      finalImage = `${baseURL}/${cleanPath}`;
    }

    const formattedArticle = {
      ...rawArticle,
      image: finalImage
    };

    res.json({
      message: `Article status updated successfully`,
      article: formattedArticle
    });

  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


router.get('/articles-catagories', async (req, res) => {
  try {
    const sql = "SELECT name FROM categories WHERE type = $1";
    const params = ['articles'];

    const result = await query(sql, params);

    // Handle result (supporting both pg native object or direct array)
    const rows = result.rows || result;

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('Error fetching article categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

module.exports = router;