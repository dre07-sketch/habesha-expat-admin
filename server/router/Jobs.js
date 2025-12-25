const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');
const { logAction } = require('../utils/auditLogger');


router.post('/jobs-post', async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            type,
            salary,
            industry,
            description,
            responsibilities,
            requirements,
            benefits,
            url // <-- NEW FIELD
        } = req.body;

        // Convert newline strings or arrays into JS arrays
        const respData = Array.isArray(responsibilities)
            ? responsibilities
            : responsibilities.split('\n');

        const reqData = Array.isArray(requirements)
            ? requirements
            : requirements.split('\n');

        const benData = Array.isArray(benefits)
            ? benefits
            : benefits.split('\n');

        const sql = `
            INSERT INTO jobs
                (title, company, location, type, salary, industry, description, responsibilities, requirements, benefits, url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8::text[], $9::text[], $10::text[], $11, 'visible')
            RETURNING id;
        `;

        const result = await query(sql, [
            title,
            company,
            location,
            type,
            salary,
            industry,
            description,
            respData,
            reqData,
            benData,
            url  // <-- NEW PARAMETER
        ]);

        await logAction(req, 'CREATE', 'JOB', result.rows[0].id, `Posted Job: ${title}`);

        res.status(201).json({
            success: true,
            message: 'Job posted',
            id: result.rows[0].id
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});



router.get('/jobs-get', async (req, res) => {
    try {
        const sql = `
             SELECT id, title, company, location, type, salary, industry, 
            description, responsibilities, requirements, benefits, status, 
            posted_date as "postedDate", url 
            FROM jobs 
            ORDER BY posted_date DESC
        `;
        const { rows } = await query(sql);

        // No need to parse JSON/arrays for TEXT[] columns
        const formattedRows = rows.map(job => ({
            ...job,
            // responsibilities, requirements, benefits are already arrays
        }));

        res.json(formattedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.delete('/jobs-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await query(`DELETE FROM jobs WHERE id = $1`, [id]);

        await logAction(req, 'DELETE', 'JOB', id, 'Deleted Job listing');

        res.json({ success: true, message: 'Job listing deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/jobs/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;   // visible | hidden

        // Optional validation
        if (!['visible', 'hidden'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const sql = `
            UPDATE jobs 
            SET status = $1 
            WHERE id = $2
        `;

        await query(sql, [status, id]);

        await logAction(req, 'UPDATE', 'JOB', id, `Updated Job status to ${status}`);

        res.json({
            success: true,
            message: `Job is now ${status}`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/jobs/:id/applicants', async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT 
                id,
                name,
                email,
                phone,
                linkedin_url AS linkedin,
                resume_url AS "resumeUrl",
                cover_letter AS "coverLetter",
                status,
                applied_date AS "appliedDate"
            FROM job_applicants
            WHERE job_id = $1
            ORDER BY applied_date DESC
        `;

        const { rows } = await query(sql, [id]);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;