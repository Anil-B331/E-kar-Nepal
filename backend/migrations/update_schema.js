const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Just in case it's needed

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'records_government',
            port: 3306
        });
        
        console.log('Connected to MySQL. Starting migration...');

        // 1. Alter gov_vehicles
        console.log('Updating gov_vehicles...');
        try {
            await connection.query(`ALTER TABLE gov_vehicles ADD COLUMN engine_cc INT DEFAULT 150`);
            await connection.query(`ALTER TABLE gov_vehicles ADD COLUMN vehicle_category VARCHAR(20) DEFAULT '2W'`);
        } catch (e) {
            console.log('Columns might already exist in gov_vehicles, skipping...');
        }

        // Seed some specific CCs for existing dummy data
        await connection.query(`UPDATE gov_vehicles SET engine_cc = 200, vehicle_category = '2W' WHERE plate_number = 'Ba 3 Cha 9876'`);
        await connection.query(`UPDATE gov_vehicles SET engine_cc = 1200, vehicle_category = '4W' WHERE plate_number = 'Bagmati 15 Ba 1234'`);

        // 2. Alter gov_lands
        console.log('Updating gov_lands...');
        try {
            await connection.query(`ALTER TABLE gov_lands ADD COLUMN area_sqm INT DEFAULT 1000`);
            await connection.query(`ALTER TABLE gov_lands ADD COLUMN land_category VARCHAR(50) DEFAULT 'Residential'`);
        } catch (e) {
            console.log('Columns might already exist in gov_lands, skipping...');
        }
        
        await connection.query(`UPDATE gov_lands SET area_sqm = 508, land_category = 'Residential' WHERE kitta_number = '405'`);
        await connection.query(`UPDATE gov_lands SET area_sqm = 10000, land_category = 'Agricultural' WHERE kitta_number = '406'`);

        // 3. Create transactions table
        console.log('Creating transactions table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transaction_uuid VARCHAR(100) NOT NULL,
                asset_id VARCHAR(50) NOT NULL,
                citizenship_number VARCHAR(50) NOT NULL,
                amount INT NOT NULL,
                status VARCHAR(20) DEFAULT 'SUCCESS',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrate();
