import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const LoginView = () => {
    const navigate = useNavigate();
    const { isNepali } = useLanguage();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(credentials.email, credentials.password);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            toast.success(isNepali ? 'लगइन सफल भयो' : 'Login successful');
            navigate('/');
        } catch (error) {
            toast.error(error.message || (isNepali ? 'लगइन असफल भयो' : 'Login failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 sm:mt-20 px-4 mb-24">
            <div className="bg-white p-6 sm:p-8 rounded shadow-sm border border-gray-200">
                <div className="text-center mb-8 border-b border-gray-100 pb-6">
                    <img src="/newlogo.png" alt="Government Logo" className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#003893]">
                        {isNepali ? 'नागरिक पोर्टल लगइन' : 'Citizen Portal Login'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isNepali ? 'ई-कर नेपाल कर व्यवस्थापन प्रणाली' : 'E-Kar Nepal Tax Management System'}
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            {isNepali ? 'नागरिकता नं. वा ईमेल ठेगाना' : 'Citizenship No. or Email Address'}
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 focus:border-[#003893] focus:ring-1 focus:ring-[#003893] outline-none transition-colors rounded-sm"
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            {isNepali ? 'पासवर्ड' : 'Password'}
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 focus:border-[#003893] focus:ring-1 focus:ring-[#003893] outline-none transition-colors rounded-sm"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#003893] hover:bg-blue-800 text-white font-bold py-3 rounded-sm transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? (isNepali ? 'लगइन गर्दै...' : 'Authenticating...') : (isNepali ? 'सुरक्षित लगइन' : 'Secure Login')}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 text-center">
                    {isNepali ? 'पोर्टलमा नयाँ हुनुहुन्छ?' : 'New to the portal?'} <button onClick={() => navigate('/signup')} className="text-[#003893] hover:underline font-bold">{isNepali ? 'नयाँ खाता दर्ता गर्नुहोस्' : 'Register a new account'}</button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
