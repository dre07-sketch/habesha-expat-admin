const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');
const { createCoolEmailTemplate } = require('../email/emailTemplate');

// Nodemailer transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});


router.post('/api/send-newsletter', async (req, res) => {
  
  const { subject, content, imageUrl } = req.body; 
  
  try {
    
    const newsletterResult = await query(
      `INSERT INTO newsletters (subject, content, image_url, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'sending', NOW(), NOW())
       RETURNING id`,
      [subject, content, imageUrl]
    );
    
    // Get the newsletter ID from the result
    const newsletterId = newsletterResult.insertId;
    
    // B. Get ALL subscribers
    const subscriberResult = await query('SELECT * FROM subscribers');
    const subscribersList = subscriberResult.rows;
    
    // C. Generate the HTML *ONCE* (Efficiency)
    // We pass the subject, content, and imageUrl into our cool template function
    const formattedHtml = createCoolEmailTemplate(subject, content, imageUrl);

    // D. Send emails loop
    let sentCount = 0;
    let failedCount = 0;
    const failedEmails = [];
    
    for (const subscriber of subscribersList) {
      try {
        await transporter.sendMail({
          from: '"Habesh Expat News" <your-email@example.com>',
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
    
    // E. Update database status
    await query(
      `UPDATE newsletters 
       SET status = 'sent', sent_at = NOW(), subscriber_count = $1 
       WHERE id = $2`,
      [sentCount, newsletterId]
    );
    
    // F. Return detailed response
    res.status(200).json({ 
      success: true, 
      message: `Newsletter successfully sent to ${sentCount} subscribers.`,
      stats: {
        totalSubscribers: subscribersList.length,
        successfullySent: sentCount,
        failed: failedCount,
        successRate: `${Math.round((sentCount / subscribersList.length) * 100)}%`
      },
      failedDeliveries: failedCount > 0 ? {
        count: failedCount,
        emails: failedEmails.slice(0, 5),
        note: failedCount > 5 ? `...and ${failedCount - 5} more` : ''
      } : null
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