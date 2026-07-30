const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.QR_JWT_SECRET || '12345678901234567890123456789012';

const signup = async (req, res) => {
    const { name, email, password, citizenship, vehiclePlate, kittaNo } = req.body;

    if (!name || !email || !password || !citizenship) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!vehiclePlate && !kittaNo) {
        return res.status(400).json({ error: 'Please provide at least one asset detail (Vehicle Plate or Kitta No) for verification.' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await db.execute('SELECT * FROM app_users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Verify Citizenship in Government DB
        const [govCitizens] = await db.execute('SELECT * FROM gov_citizens WHERE citizenship_number = ?', [citizenship]);
        if (govCitizens.length === 0) {
            return res.status(400).json({ error: 'Citizenship number not found in government records.' });
        }

        // Verify Assets
        let hasValidAsset = false;

        if (vehiclePlate) {
            const [vehicles] = await db.execute('SELECT * FROM gov_vehicles WHERE plate_number = ? AND owner_citizenship = ?', [vehiclePlate, citizenship]);
            if (vehicles.length > 0) hasValidAsset = true;
        }

        if (kittaNo) {
            const [lands] = await db.execute('SELECT * FROM gov_lands WHERE kitta_number = ? AND owner_citizenship = ?', [kittaNo, citizenship]);
            if (lands.length > 0) hasValidAsset = true;
        }

        if (!hasValidAsset) {
            return res.status(400).json({ error: "You don't have any vehicle or land registered in your name matching these details." });
        }

        // If verification passed, create App User
        const [result] = await db.execute(
            'INSERT INTO app_users (name, email, password_hash, citizenship_number) VALUES (?, ?, ?, ?)',
            [name, email, password, citizenship] // Password as plain text for MVP
        );

        const newUserId = result.insertId;

        const token = jwt.sign({ id: newUserId, name, citizenship }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: newUserId, name, email, citizenship } });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM app_users WHERE email = ? AND password_hash = ?', [email, password]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const token = jwt.sign({ id: user.id, name: user.name, citizenship: user.citizenship_number }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, citizenship: user.citizenship_number } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { signup, login };
