const db = require('./db');

async function check() {
    const [citizens] = await db.execute('SELECT * FROM gov_citizens');
    console.log("Citizens:", citizens);
    process.exit(0);
}
check();
