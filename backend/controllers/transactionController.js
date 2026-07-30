const db = require('../db');

const getHistory = async (req, res) => {
    const citizenship = req.user.citizenship;
    
    try {
        const [rows] = await db.execute(
            'SELECT * FROM transactions WHERE citizenship_number = ? ORDER BY timestamp DESC',
            [citizenship]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
};

const getReceipt = async (req, res) => {
    const { txnId } = req.params;
    const citizenship = req.user.citizenship;
    
    try {
        // Find the transaction
        const [txnRows] = await db.execute(
            'SELECT * FROM transactions WHERE transaction_uuid = ? AND citizenship_number = ?',
            [txnId, citizenship]
        );

        if (txnRows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }

        const txn = txnRows[0];

        // Fetch user info
        const [userRows] = await db.execute(
            'SELECT full_name, email, province, district, municipality, ward_number FROM gov_citizens WHERE citizenship_number = ?',
            [citizenship]
        );
        const citizenData = userRows[0];
        const user = {
            first_name: citizenData.full_name,
            last_name: '',
            province: citizenData.province || 'Lumbini', // fallback just in case
            district: citizenData.district || 'Nawalparasi',
            municipality: citizenData.municipality || 'Ramgram',
            ward_number: citizenData.ward_number || '15',
            citizenship_number: citizenship
        };

        // Fetch asset info (try land first, then vehicle)
        let asset = null;
        const [landRows] = await db.execute(
            'SELECT kitta_number, area_sqm as area, type FROM gov_lands WHERE asset_id = ?',
            [txn.asset_id]
        );
        
        if (landRows.length > 0) {
            asset = { ...landRows[0], assetType: 'Land' };
        } else {
            const [vehicleRows] = await db.execute(
                'SELECT plate_number, engine_cc as area, type FROM gov_vehicles WHERE asset_id = ?',
                [txn.asset_id]
            );
            if (vehicleRows.length > 0) {
                asset = { ...vehicleRows[0], assetType: 'Vehicle' };
            }
        }

        if (!asset) {
            return res.status(404).json({ error: 'Asset details not found' });
        }

        res.json({
            transaction: txn,
            citizen: user,
            asset: asset
        });
    } catch (err) {
        console.error('Error fetching receipt:', err);
        res.status(500).json({ error: 'Failed to fetch receipt data' });
    }
};

module.exports = { getHistory, getReceipt };
