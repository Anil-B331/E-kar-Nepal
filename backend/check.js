const db = require('./db');

async function check() {
    try {
        const [rows] = await db.execute('DESCRIBE gov_vehicles');
        console.log("gov_vehicles:", rows);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
check();
