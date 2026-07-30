const db = require('../db');

const getStats = async (req, res) => {
    try {
        const [revenueResult] = await db.execute("SELECT SUM(amount) as totalRevenue FROM transactions WHERE status = 'SUCCESS'");
        const [txnCountResult] = await db.execute("SELECT COUNT(*) as totalTxns FROM transactions WHERE status = 'SUCCESS'");
        
        const query = `
            SELECT 
                t.*,
                c.full_name as citizen_name,
                v.plate_number,
                l.kitta_number
            FROM transactions t
            LEFT JOIN gov_citizens c ON t.citizenship_number = c.citizenship_number
            LEFT JOIN gov_vehicles v ON t.asset_id = v.asset_id
            LEFT JOIN gov_lands l ON t.asset_id = l.asset_id
            ORDER BY t.timestamp DESC 
            LIMIT 10
        `;
        const [recentTxns] = await db.execute(query);

        res.json({
            totalRevenue: revenueResult[0].totalRevenue || 0,
            totalTxns: txnCountResult[0].totalTxns || 0,
            recentTransactions: recentTxns
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

module.exports = { getStats };
