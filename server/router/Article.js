const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, DB_TYPE } = require('../connection/db');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

/* =====================================================
   POST: Create Travel Destination
   - hero_image (single)
   - gallery (multiple)
===================================================== */
router.post(
  '/travel-destinations',
  upload.fields([
    { name: 'hero_image', maxCount: 1 },
    { name: 'gallery', maxCount: 15 }
  ]),
  async (req, res) => {
    try {
      const {
        slug,
        name,
        title,
        description,
        price,
        rating,
        location,
        duration,
        group_size,
        languages,
        highlights,
        itinerary,
        status
      } = req.body;

      /* =========================
         Validation
      ========================== */
      if (!slug || !name) {
        return res.status(400).json({
          success: false,
          message: 'slug and name are required'
        });
      }

      /* =========================
         Files
      ========================== */
      const heroImage =
        req.files?.hero_image?.[0]
          ? `/upload/${req.files.hero_image[0].filename}`
          : null;

      const galleryImages =
        req.files?.gallery
          ? req.files.gallery.map(file => `/upload/${file.filename}`)
          : [];

      /* =========================
         Parse JSON fields
      ========================== */
      const parsedHighlights =
        highlights
          ? (typeof highlights === 'string' ? JSON.parse(highlights) : highlights)
          : [];

      const parsedItinerary =
        itinerary
          ? (typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary)
          : [];

      /* =========================
         SQL Insert
      ========================== */
      const sql = `
        INSERT INTO travel_destinations (
          slug,
          name,
          title,
          description,
          price,
          rating,
          hero_image,
          location,
          duration,
          group_size,
          languages,
          highlights,
          itinerary,
          gallery,
          status
        )
        VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15
        )
        RETURNING *;
      `;

      const values = [
        slug,
        name,
        title || null,
        description || null,
        price || null,
        rating || null,
        heroImage,
        location || null,
        duration || null,
        group_size || null,
        languages || null,
        JSON.stringify(parsedHighlights),
        JSON.stringify(parsedItinerary),
        galleryImages,
        status || 'active'
      ];

      const result = await query(sql, values);

      res.status(201).json({
        success: true,
        message: 'Travel destination created successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Create travel destination error:', error);

      res.status(500).json({
        success: false,
        message: 'Database error',
        error: error.message
      });
    }
  }
);




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

router.get('/articles/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT 
                c.id,
                c.content,
                c.created_at,
                u.name AS user_name
            FROM comments c
            INNER JOIN users u ON u.id = c.user_id
            WHERE c.article_id = $1
            ORDER BY c.created_at DESC
        `;

        const result = await query(sql, [id]);

        return res.json({
            success: true,
            comments: result.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch article comments"
        });
    }
});

router.get('/articles/:id/likes', async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT 
                l.id,
                l.created_at,
                u.name AS user_name
            FROM likes l
            INNER JOIN users u ON u.id = l.user_id
            WHERE l.article_id = $1
            ORDER BY l.created_at DESC
        `;

        const result = await query(sql, [id]);

        return res.json({
            success: true,
            likes: result.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch article likes"
        });
    }
});

router.get('/articles/:id/full', async (req, res) => {
    try {
        const { id } = req.params;

        const articleSql = `
            SELECT id, title, slug, excerpt, content, image_url, 
                   category, author_name, status, views, publish_date 
            FROM articles 
            WHERE id = $1
        `;

        const commentsSql = `
            SELECT 
                c.id,
                c.content,
                c.created_at,
                u.full_name AS user_name
            FROM comments c
            INNER JOIN users u ON u.id = c.user_id
            WHERE c.article_id = $1
            ORDER BY c.created_at DESC
        `;

        const likesSql = `
            SELECT 
                l.id,
                l.created_at,
                u.full_name AS user_name
            FROM likes l
            INNER JOIN users u ON u.id = l.user_id
            WHERE l.article_id = $1
            ORDER BY l.created_at DESC
        `;

        const article = await query(articleSql, [id]);
        const comments = await query(commentsSql, [id]);
        const likes = await query(likesSql, [id]);

        return res.json({
            success: true,
            article: article.rows[0],
            comments: comments.rows,
            likes: likes.rows,
            likesCount: likes.rowCount,
            commentsCount: comments.rowCount
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch article data"
        });
    }
});


module.exports = router;