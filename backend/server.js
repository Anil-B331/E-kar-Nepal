require('dotenv').config();
const express = require('express');
const cors = require('cors');

const citizenController = require('./controllers/citizenController');
const paymentController = require('./controllers/paymentController');
const verifyController = require('./controllers/verifyController');
const transactionController = require('./controllers/transactionController');
const adminController = require('./controllers/adminController');

const authController = require('./controllers/authController');
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Endpoints
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);

// Citizen Endpoints
app.get('/api/citizen/assets', verifyToken, citizenController.getAssets);
app.get('/api/transactions/history', verifyToken, transactionController.getHistory);
app.get('/api/transactions/receipt/:txnId', verifyToken, transactionController.getReceipt);

// Admin Endpoints
app.get('/api/admin/stats', adminController.getStats);

// Payment Endpoints
app.post('/api/payment/initiate', paymentController.initiatePayment);
app.get('/api/payment/success', paymentController.handleSuccess);

// Verification Endpoints
app.post('/api/verify/generate-qr', verifyController.generateQR);
app.post('/api/verify/scan-qr', verifyController.scanQR);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
