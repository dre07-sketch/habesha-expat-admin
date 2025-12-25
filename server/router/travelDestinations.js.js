const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, DB_TYPE } = require('../connection/db');
const { logAction } = require('../utils/auditLogger');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.post('/travel-destinations-post', upload.any(), async (req, res) => {
  try {
    /* =========================
       SAFE BODY ACCESS
    ========================== */
    const body = req.body || {};

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
    } = body;

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
       Files handling
    ========================== */
    const heroFile = req.files?.find(f => f.fieldname === 'hero_image');
    const galleryFiles = req.files?.filter(f => f.fieldname === 'gallery') || [];

    const hero_image = heroFile ? `/upload/${heroFile.filename}` : null;
    const gallery = galleryFiles.map(f => `/upload/${f.filename}`);

    /* =========================
       JSON fields parsing
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
      hero_image,
      location || null,
      duration || null,
      group_size || null,
      languages || null,
      JSON.stringify(parsedHighlights),
      JSON.stringify(parsedItinerary),
      gallery,
      status || 'active'
    ];

    const result = await query(sql, values);

    await logAction(req, 'CREATE', 'TRAVEL', result.rows[0].id, `Created Travel Destination: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Travel destination created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create travel destination error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


router.get('/travel-destinations-get', async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM travel_destinations
      ORDER BY created_at DESC;
    `;

    const result = await query(sql);

    const BASE_URL = `${req.protocol}://${req.get('host')}`;

    const data = result.rows.map(row => ({
      ...row,

      // ✅ jsonb fields (already objects)
      highlights: row.highlights || [],
      itinerary: row.itinerary || [],

      // ✅ hero image (convert to full URL)
      hero_image: row.hero_image
        ? `${BASE_URL}${row.hero_image}`
        : null,

      // ✅ gallery text[] → full URLs
      gallery: Array.isArray(row.gallery)
        ? row.gallery.map(img => `${BASE_URL}${img}`)
        : [],

      // created_at & status included automatically
    }));

    res.status(200).json({
      success: true,
      message: 'Travel destinations fetched successfully',
      data
    });

  } catch (error) {
    console.error('Fetch travel destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});




router.put('/travel-destinations-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['visible', 'hidden'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const sql = `
      UPDATE travel_destinations
      SET status = $1
      WHERE id = $2
      RETURNING id, status;
    `;

    const result = await query(sql, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await logAction(req, 'UPDATE', 'TRAVEL', id, "Updated travel destination status to " + status);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


module.exports = router;





