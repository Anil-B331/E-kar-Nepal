const mysql = require('mysql2/promise');

async function dumpSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'records_government',
        port: 3306
    });

    const tables = ['gov_citizens', 'gov_vehicles', 'gov_lands', 'app_users'];
    
    for (const table of tables) {
        console.log(`\n--- ${table} Schema ---`);
        const [rows] = await connection.query(`DESCRIBE ${table}`);
        console.log(rows);
    }
    await connection.end();
}

dumpSchema().catch(console.error);
