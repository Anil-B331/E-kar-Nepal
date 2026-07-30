const db = require('../db');
const { calculateVehicleTax, calculateLandTax } = require('../utils/taxCalculator');

const getAssets = async (req, res) => {
    const citizenship = req.user.citizenship;
    
    try {
        const [vehicles] = await db.execute('SELECT * FROM gov_vehicles WHERE owner_citizenship = ?', [citizenship]);
        const [lands] = await db.execute('SELECT * FROM gov_lands WHERE owner_citizenship = ?', [citizenship]);

        const mappedVehicles = vehicles.map(v => {
            const calculatedTax = v.status === 'UNPAID' ? calculateVehicleTax(v.engine_cc, v.vehicle_category) : 0;
            return {
                assetId: v.asset_id,
                ownerId: v.owner_citizenship,
                plate: v.plate_number,
                type: v.type,
                engineCc: v.engine_cc,
                category: v.vehicle_category,
                taxDue: calculatedTax,
                status: v.status,
                validUntil: v.valid_until
            };
        });

        const mappedLands = lands.map(l => {
            const calculatedTax = l.status === 'UNPAID' ? calculateLandTax(l.area_sqm, l.land_category) : 0;
            return {
                assetId: l.asset_id,
                ownerId: l.owner_citizenship,
                kittaNo: l.kitta_number,
                type: l.type,
                areaSqm: l.area_sqm,
                category: l.land_category,
                taxDue: calculatedTax,
                status: l.status,
                validUntil: l.valid_until
            };
        });

        res.json({ vehicles: mappedVehicles, lands: mappedLands });
    } catch (err) {
        console.error('Error fetching assets:', err);
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
};

module.exports = { getAssets };
