const { query } = require('./connection/db');

async function cleanup() {
    try {
        // Delete the duplicate high-ID entries
        await query('DELETE FROM system_status WHERE id >= 1000');
        console.log('Successfully removed duplicate system status entries.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanup();
