import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../utils/api';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RegistrationView = () => {
    const { isNepali } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        citizenship: '',
        vehiclePlate: '',
        kittaNo: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.vehiclePlate && !formData.kittaNo) {
            setError(isNepali ? 'तपाईंले प्रमाणीकरणको लागि कम्तिमा एउटा सवारी साधन नम्बर वा जग्गा कित्ता नम्बर प्रदान गर्नुपर्छ।' : 'You must provide either a Vehicle Plate or Land Kitta Number for verification.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await signup(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-4 sm:mt-12 px-4 mb-20 animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-[#DC143C]/5 border-0 text-center relative overflow-hidden group">
                {/* Decorative blob */}
                <div className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 rounded-full bg-gradient-to-br from-[#DC143C]/10 to-[#003893]/10 blur-2xl group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>

                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-[#DC143C]/10 to-[#DC143C]/5 text-[#DC143C] rounded-2xl mb-6 relative z-10 shadow-sm border border-[#DC143C]/10">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 relative z-10">
                    {isNepali ? 'नागरिक दर्ता' : 'Citizen Registration'}
                </h2>
                <p className="text-gray-500 mb-8 relative z-10">
                    {isNepali ? 'सरकारी अभिलेखहरू विरुद्ध तपाईंको पहिचान प्रमाणित गर्नुहोस्।' : 'Verify your identity against government records.'}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 text-left">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNepali ? 'पूरा नाम *' : 'Full Name *'}
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNepali ? 'ईमेल ठेगाना *' : 'Email Address *'}
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNepali ? 'पासवर्ड *' : 'Password *'}
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNepali ? 'नागरिकता नम्बर *' : 'Citizenship Number *'}
                        </label>
                        <input
                            type="text"
                            name="citizenship"
                            required
                            placeholder="e.g. 27-01-72-04532"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
                            value={formData.citizenship}
                            onChange={handleChange}
                        />
                    </div>
                    <hr className="my-4" />
                    <p className="text-sm font-medium text-gray-800 mb-2">
                        {isNepali ? 'प्रमाणीकरण विवरण (कम्तिमा एउटा प्रविष्ट गर्नुहोस्)' : 'Verification Details (Enter at least one)'}
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNepali ? 'सवारी साधन नम्बर' : 'Vehicle Plate (Gaadi Number)'}
                        </label>
                        <input
                            type="text"
                            name="vehiclePlate"
                            placeholder="e.g. Ba 3 Cha 9876"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
                            value={formData.vehiclePlate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNepali ? 'जग्गा कित्ता नम्बर' : 'Land Kitta Number'}
                        </label>
                        <input
                            type="text"
                            name="kittaNo"
                            placeholder="e.g. 405"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
                            value={formData.kittaNo}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? (isNepali ? 'प्रमाणित गर्दै...' : 'Verifying & Registering...') : (isNepali ? 'दर्ता गर्नुहोस्' : 'Register')}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-500">
                    {isNepali ? 'पहिले नै खाता छ?' : 'Already have an account?'} <Link to="/login" className="text-green-600 hover:underline font-medium">{isNepali ? 'लगइन गर्नुहोस्' : 'Log in'}</Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationView;
