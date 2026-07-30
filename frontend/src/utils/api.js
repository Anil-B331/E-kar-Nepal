const API_BASE_URL = 'http://192.168.18.6:5000/api';

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
};

export const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchCitizenAssets = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/citizen/assets`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch assets');
    return response.json();
};

export const fetchTransactionHistory = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/transactions/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
};

export const fetchTransactionReceipt = async (txnId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/transactions/receipt/${txnId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch receipt');
    return response.json();
};

export const fetchAdminStats = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
};

export const initiatePayment = async (assetId, amount) => {
    const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ assetId, amount })
    });
    if (!response.ok) throw new Error('Payment initiation failed');
    return response.json();
};

export const generateQR = async (assetId) => {
    const response = await fetch(`${API_BASE_URL}/verify/generate-qr`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ assetId })
    });
    if (!response.ok) throw new Error('Failed to generate QR');
    return response.json();
};

export const scanQR = async (encryptedString) => {
    const response = await fetch(`${API_BASE_URL}/verify/scan-qr`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader() // Optional depending on if officials need auth
        },
        body: JSON.stringify({ encryptedString })
    });
    if (!response.ok) throw new Error('Failed to verify QR');
    return response.json();
};
