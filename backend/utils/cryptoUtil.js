const crypto = require('crypto');

const JWT_SECRET = process.env.QR_JWT_SECRET || '12345678901234567890123456789012'; // 32 chars

function generateEsewaSignature(totalAmount, transactionUuid, productCode, secretKey) {
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    return crypto.createHmac('sha256', secretKey).update(message).digest('base64');
}

function encryptQRData(payloadObj) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(JWT_SECRET), iv);
    let encrypted = cipher.update(JSON.stringify(payloadObj), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`; // Send this to frontend
}

function decryptQRData(encryptedString) {
    try {
        const [ivHex, encryptedHex, authTagHex] = encryptedString.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(JWT_SECRET), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    } catch (e) {
        return null;
    }
}

module.exports = {
    generateEsewaSignature,
    encryptQRData,
    decryptQRData
};
