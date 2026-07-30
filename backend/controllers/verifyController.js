const { encryptQRData, decryptQRData } = require('../utils/cryptoUtil');
const db = require('../db');

const generateQR = async (req, res) => {
    const { assetId } = req.body;

    try {
        let asset = null;
        let isVehicle = true;

        const [vehicles] = await db.execute('SELECT * FROM gov_vehicles WHERE asset_id = ?', [assetId]);
        if (vehicles.length > 0) {
            asset = vehicles[0];
        } else {
            const [lands] = await db.execute('SELECT * FROM gov_lands WHERE asset_id = ?', [assetId]);
            if (lands.length > 0) {
                asset = lands[0];
                isVehicle = false;
            }
        }

        if (!asset || asset.status !== 'PAID') {
            return res.status(400).json({ error: 'Asset not found or tax unpaid' });
        }

        const [citizens] = await db.execute('SELECT full_name FROM gov_citizens WHERE citizenship_number = ?', [asset.owner_citizenship]);
        const ownerName = citizens.length > 0 ? citizens[0].full_name : 'Unknown';

        // Add 1 year to current date for expiry
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        const validUntil = expiry.toISOString().split('T')[0];

        // Update valid_until in DB
        if (isVehicle) {
            await db.execute('UPDATE gov_vehicles SET valid_until = ? WHERE asset_id = ?', [validUntil, assetId]);
        } else {
            await db.execute('UPDATE gov_lands SET valid_until = ? WHERE asset_id = ?', [validUntil, assetId]);
        }

        const qrData = {
            assetId,
            ownerName,
            identifier: isVehicle ? asset.plate_number : asset.kitta_number,
            type: isVehicle ? 'Vehicle' : 'Land',
            validUntil
        };

        const encryptedString = encryptQRData(qrData);
        res.json({ encryptedString });
    } catch (err) {
        console.error('QR Generation Error:', err);
        res.status(500).json({ error: 'Failed to generate QR' });
    }
};

const scanQR = async (req, res) => {
    const { encryptedString } = req.body;

    try {
        const decryptedData = decryptQRData(encryptedString);
        
        // Optionally, we could cross-check DB here to ensure validUntil hasn't been revoked
        
        res.json({
            valid: true,
            data: decryptedData
        });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or forged Digital Stamp' });
    }
};

module.exports = { generateQR, scanQR };
