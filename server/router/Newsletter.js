const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');
const { createCoolEmailTemplate } = require('../email/emailTemplate');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/'); // folder where images will be saved
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // unique name
    }
});

const upload = multer({ storage: storage });


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Ensure these are set in your .env file
        pass: process.env.EMAIL_PASS
    }
});


router.post('/send-newsletters', upload.single('imageUrl'), async (req, res) => {
    const { subject, content } = req.body;

    // FIXED: Store a clean URL format
    const imageUrl = req.file ? `/upload/${req.file.filename}` : null;

    try {
        // A. Insert newsletter
        const newsletterResult = await query(
            `INSERT INTO newsletters (subject, content, image_url, status, created_at)
             VALUES ($1, $2, $3, 'sending', NOW())
             RETURNING id`,
            [subject, content, imageUrl]
        );

        const newsletterId = newsletterResult.rows[0].id;

        // B. Fetch subscribers
        const subscriberResult = await query('SELECT * FROM subscribers');
        const subscribersList = subscriberResult.rows;

        // C. Build email HTML with absolute URL for image
        const formattedHtml = createCoolEmailTemplate(
            subject,
            content,
            imageUrl ? `http://localhost:5000${imageUrl}` : null  // FULL URL
        );

        // D. Send emails
        let sentCount = 0;
        let failedCount = 0;
        const failedEmails = [];

        for (const subscriber of subscribersList) {
            try {
                await transporter.sendMail({
                    from: '"Habesh Expat News" <drebowjohnson@gmail.com>',
                    to: subscriber.email,
                    subject: subject,
                    html: formattedHtml
                });
                sentCount++;
            } catch (emailError) {
                console.error(`Failed to send to ${subscriber.email}:`, emailError);
                failedCount++;
                failedEmails.push(subscriber.email);
            }
        }

        // E. Update newsletter metadata
        await query(
            `UPDATE newsletters
             SET status = 'sent',
                 sent_date = NOW(),
                 recipient_count = $1
             WHERE id = $2`,
            [sentCount, newsletterId]
        );

        // F. Respond to frontend
        return res.status(200).json({
            success: true,
            message: `Newsletter sent to ${sentCount} subscribers.`,
            stats: {
                totalSubscribers: subscribersList.length,
                successfullySent: sentCount,
                failed: failedCount,
                successRate: `${Math.round((sentCount / subscribersList.length) * 100)}%`
            },
            failedDeliveries: failedEmails.slice(0, 5)
        });

    } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send newsletter',
            error: error.message
        });
    }
});



router.get('/newsletters-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, subject, recipient_segment as segment, content, 
            image_url as image, status, sent_date as sentDate, 
            recipient_count as recipientCount, open_rate as openRate, 
            click_rate as clickRate 
            FROM newsletters 
            ORDER BY created_at DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;