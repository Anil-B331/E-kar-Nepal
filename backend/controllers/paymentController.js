const { generateEsewaSignature } = require('../utils/cryptoUtil');
const db = require('../db');

const initiatePayment = async (req, res) => {
    const { assetId, amount } = req.body;
    
    const transactionUuid = `TXN-${Date.now()}`;
    const productCode = 'EPAYTEST';
    const secretKey = '8gBm/:&EnhH.1/q';

    try {
        const signature = generateEsewaSignature(amount, transactionUuid, productCode, secretKey);

        res.json({
            amount: amount,
            tax_amount: 0,
            total_amount: amount,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: `http://localhost:5000/api/payment/success?assetId=${assetId}&txn=${transactionUuid}`,
            failure_url: `http://localhost:5173/?status=failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

const handleSuccess = async (req, res) => {
    const { data } = req.query; // eSewa sends base64 encoded data
    const assetId = req.query.assetId;
    const txn = req.query.txn; // Passed in success_url

    try {
        if (!assetId) throw new Error('Asset ID missing');

        let amountPaid = 0;
        let ownerCitizenship = '';

        // Check if vehicle
        const [vehicle] = await db.execute('SELECT * FROM gov_vehicles WHERE asset_id = ?', [assetId]);
        if (vehicle.length > 0) {
            // Need a way to pass amount or recalculate it. We assume we fetch what they owed. 
            // In a real system, amount would be passed and verified.
            amountPaid = 5000; // Mock fixed amount for now, or decode from `data` eSewa gives us
            ownerCitizenship = vehicle[0].owner_citizenship;
            await db.execute('UPDATE gov_vehicles SET status = ?, tax_due = 0 WHERE asset_id = ?', ['PAID', assetId]);
        } else {
            const [land] = await db.execute('SELECT * FROM gov_lands WHERE asset_id = ?', [assetId]);
            if (land.length > 0) {
                amountPaid = 5000; 
                ownerCitizenship = land[0].owner_citizenship;
                await db.execute('UPDATE gov_lands SET status = ?, tax_due = 0 WHERE asset_id = ?', ['PAID', assetId]);
            }
        }

        // Insert into transactions
        await db.execute(
            'INSERT INTO transactions (transaction_uuid, asset_id, citizenship_number, amount, status) VALUES (?, ?, ?, ?, ?)',
            [txn || `TXN-${Date.now()}`, assetId, ownerCitizenship, amountPaid, 'SUCCESS']
        );

        // Redirect back to frontend citizen dashboard
        res.redirect('http://192.168.18.6:5173/?status=success');
    } catch (err) {
        console.error('Payment Success Handling Error:', err);
        res.redirect('http://192.168.18.6:5173/?status=failure');
    }
};

module.exports = { initiatePayment, handleSuccess };
