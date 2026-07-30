const mysql = require('mysql2/promise');

async function setup() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            port: 3306
        });

        console.log('Connected to MySQL. Creating database and tables...');

        await connection.query(`CREATE DATABASE IF NOT EXISTS records_government;`);
        await connection.query(`USE records_government;`);

        // Create Gov_Citizens
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gov_citizens (
                citizenship_number VARCHAR(50) PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                province VARCHAR(50),
                district VARCHAR(50),
                municipality VARCHAR(100),
                ward_number VARCHAR(10)
            );
        `);

        // Create Gov_Vehicles
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gov_vehicles (
                asset_id VARCHAR(50) PRIMARY KEY,
                owner_citizenship VARCHAR(50) NOT NULL,
                plate_number VARCHAR(50) NOT NULL,
                bluebook_number VARCHAR(50),
                type VARCHAR(20) DEFAULT 'Vehicle',
                tax_due INT NOT NULL,
                status VARCHAR(20) DEFAULT 'UNPAID',
                valid_until VARCHAR(20),
                FOREIGN KEY (owner_citizenship) REFERENCES gov_citizens(citizenship_number)
            );
        `);

        // Create Gov_Lands
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gov_lands (
                asset_id VARCHAR(50) PRIMARY KEY,
                owner_citizenship VARCHAR(50) NOT NULL,
                kitta_number VARCHAR(50) NOT NULL,
                lalpurja_number VARCHAR(50),
                type VARCHAR(20) DEFAULT 'Land',
                tax_due INT NOT NULL,
                status VARCHAR(20) DEFAULT 'UNPAID',
                valid_until VARCHAR(20),
                FOREIGN KEY (owner_citizenship) REFERENCES gov_citizens(citizenship_number)
            );
        `);

        // Create App_Users (our webapp users)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                citizenship_number VARCHAR(50) NOT NULL,
                FOREIGN KEY (citizenship_number) REFERENCES gov_citizens(citizenship_number)
            );
        `);

        // Insert Dummy Government Data
        console.log('Inserting dummy data...');
        
        await connection.query(`INSERT IGNORE INTO gov_citizens (citizenship_number, full_name, email, province, district, municipality, ward_number) VALUES 
            ('27-01-72-04532', 'Ram Bahadur Thapa', 'ram@example.com', 'लुम्बिनी', 'नवलपरासी (बर्दघाट सुस्ता पश्चिम)', 'रामग्राम नगरपालिका', '15'),
            ('12-34-56-78901', 'Hari Prasad Sharma', 'hari@example.com', 'बागमती', 'काठमाडौं', 'काठमाडौं महानगरपालिका', '10'),
            ('03-02-03-23455', 'Gyanu Baniya', 'gyanubaniya6611@gmail.com', 'लुम्बिनी', 'नवलपरासी (बर्दघाट सुस्ता पश्चिम)', 'रामग्राम नगरपालिका', '15')
        `);

        await connection.query(`INSERT IGNORE INTO gov_vehicles (asset_id, owner_citizenship, plate_number, bluebook_number, tax_due, status) VALUES 
            ('V-9876', '27-01-72-04532', 'Ba 3 Cha 9876', 'BB-9876', 22500, 'UNPAID'),
            ('V-5555', '12-34-56-78901', 'Ba 2 Kha 1234', 'BB-1234', 15000, 'UNPAID')
        `);

        await connection.query(`INSERT IGNORE INTO gov_lands (asset_id, owner_citizenship, kitta_number, lalpurja_number, tax_due, status) VALUES 
            ('L-405', '27-01-72-04532', '405', 'LP-405', 4200, 'UNPAID'),
            ('L-101', '12-34-56-78901', '101', 'LP-101', 5000, 'UNPAID')
        `);

        console.log('Database setup complete.');
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setup();
