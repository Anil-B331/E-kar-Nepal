const db = require('./db');

async function migrate() {
    try {
        console.log("Migrating gov_citizens table...");
        
        // Add columns if they don't exist
        try {
            await db.execute('ALTER TABLE gov_citizens ADD COLUMN province VARCHAR(50)');
            await db.execute('ALTER TABLE gov_citizens ADD COLUMN district VARCHAR(50)');
            await db.execute('ALTER TABLE gov_citizens ADD COLUMN municipality VARCHAR(100)');
            await db.execute('ALTER TABLE gov_citizens ADD COLUMN ward_number VARCHAR(10)');
            console.log("Columns added successfully.");
        } catch(e) {
            console.log("Columns might already exist. Proceeding to update...");
        }

        // Update Ram Bahadur Thapa
        await db.execute(`
            UPDATE gov_citizens 
            SET province = 'लुम्बिनी', district = 'नवलपरासी (बर्दघाट सुस्ता पश्चिम)', municipality = 'रामग्राम नगरपालिका', ward_number = '15'
            WHERE citizenship_number = '27-01-72-04532'
        `);

        // Update Hari Prasad Sharma
        await db.execute(`
            UPDATE gov_citizens 
            SET province = 'बागमती', district = 'काठमाडौं', municipality = 'काठमाडौं महानगरपालिका', ward_number = '10'
            WHERE citizenship_number = '12-34-56-78901'
        `);

        // Update Gyanu Baniya
        await db.execute(`
            UPDATE gov_citizens 
            SET province = 'लुम्बिनी', district = 'नवलपरासी (बर्दघाट सुस्ता पश्चिम)', municipality = 'रामग्राम नगरपालिका', ward_number = '15'
            WHERE citizenship_number = '03-02-03-23455'
        `);

        // Update gyanendra rajbhar
        await db.execute(`
            UPDATE gov_citizens 
            SET province = 'मधेश', district = 'पर्सा', municipality = 'वीरगञ्ज महानगरपालिका', ward_number = '2'
            WHERE citizenship_number = '03-02-03-23456'
        `);

        console.log("Migration complete!");
        process.exit(0);
    } catch(err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}
migrate();
