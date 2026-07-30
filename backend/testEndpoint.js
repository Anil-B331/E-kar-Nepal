const db = require('./db');

async function test() {
    try {
        const [txns] = await db.execute('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 1');
        if (txns.length === 0) {
            console.log("No transactions found.");
            process.exit(0);
        }
        const txn = txns[0];
        console.log("Transaction:", txn);
        
        const citizenship = txn.citizenship_number;
        const txnId = txn.transaction_uuid;
        
        console.log(`Testing query for txnId=${txnId}, citizenship=${citizenship}`);

        // 1. Fetch transaction
        const [txnRows] = await db.execute(
            'SELECT * FROM transactions WHERE transaction_uuid = ? AND citizenship_number = ?',
            [txnId, citizenship]
        );
        console.log("txnRows length:", txnRows.length);

        // 2. Fetch citizen
        const [userRows] = await db.execute(
            'SELECT full_name, email FROM gov_citizens WHERE citizenship_number = ?',
            [citizenship]
        );
        console.log("userRows length:", userRows.length);

        // 3. Fetch land
        const [landRows] = await db.execute(
            'SELECT kitta_number, area_sqm as area, type FROM gov_lands WHERE asset_id = ?',
            [txn.asset_id]
        );
        console.log("landRows length:", landRows.length);

        // 4. Fetch vehicle
        const [vehicleRows] = await db.execute(
            'SELECT plate_number, engine_cc as area, type FROM gov_vehicles WHERE asset_id = ?',
            [txn.asset_id]
        );
        console.log("vehicleRows length:", vehicleRows.length);
        
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
test();
