const { query } = require('./connection/db');

async function checkStatus() {
    try {
        const result = await query('SELECT * FROM system_status');
        console.log(JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStatus();
