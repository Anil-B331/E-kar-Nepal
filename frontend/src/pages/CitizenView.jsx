import React, { useState, useEffect } from 'react';
import { fetchCitizenAssets, initiatePayment, generateQR } from '../utils/api';
import DigitalStampModal from '../components/DigitalStampModal';
import PaymentHistory from '../components/PaymentHistory';
import { Car, Map, AlertCircle, CheckCircle2, Wallet, QrCode, FileText } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const CitizenView = () => {
    const [assets, setAssets] = useState({ vehicles: [], lands: [] });
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('assets');
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadAssets();
        
        if (searchParams.get('status') === 'success') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#003893', '#DC143C', '#60BB46']
            });
            toast.success('Payment Successful! Digital Stamp generated.', { duration: 5000 });
            // Clean up url
            navigate('/', { replace: true });
            setActiveTab('history');
        } else if (searchParams.get('status') === 'failure') {
            toast.error('Payment failed. Please try again.', { duration: 5000 });
            navigate('/', { replace: true });
        }
    }, []);

    const loadAssets = async () => {
        try {
            const data = await fetchCitizenAssets();
            setAssets(data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (assetId, amount) => {
        try {
            const formData = await initiatePayment(assetId, amount);
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

            Object.keys(formData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Failed to initiate payment.');
        }
    };

    const handleViewStamp = async (assetId) => {
        try {
            const { encryptedString } = await generateQR(assetId);
            setQrData(encryptedString);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to get digital stamp:', error);
        }
    };

    const AssetCard = ({ asset, type }) => {
        const isPaid = asset.status === 'PAID';
        const Icon = type === 'Vehicle' ? Car : Map;

        return (
            <div className="bg-white rounded-sm p-6 border border-gray-300 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 border ${isPaid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#003893] text-lg uppercase tracking-wide">
                                {type === 'Vehicle' ? asset.plate : `Kitta No: ${asset.kittaNo}`}
                            </h4>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                Asset ID: <span className="font-mono">{asset.assetId}</span>
                                <span className="px-2 py-0.5 border border-gray-200 bg-gray-50 text-xs text-gray-700">{type === 'Vehicle' ? `${asset.engineCc} CC` : `${asset.areaSqm} SQM`}</span>
                            </p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-xs font-bold uppercase tracking-wider ${isPaid ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                        {isPaid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {asset.status}
                    </span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tax Amount Due</p>
                            <p className="text-2xl font-bold text-gray-900">Rs. {asset.taxDue.toLocaleString()}</p>
                        </div>
                        {isPaid && (
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-500">Valid Until</p>
                                <p className="text-sm font-semibold text-gray-900">{asset.validUntil}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                        {!isPaid ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => handlePayment(asset.assetId, asset.taxDue)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#60BB46] hover:bg-[#52a33c] text-white py-2 px-4 rounded-sm font-bold uppercase text-sm border border-transparent transition-colors"
                                >
                                    <Wallet size={16} />
                                    Pay with eSewa
                                </button>
                                <button
                                    onClick={() => {
                                        window.location.href = `http://192.168.18.6:5000/api/payment/success?assetId=${asset.assetId}&txn=DEV-SIM-${Date.now()}`;
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-sm font-bold uppercase text-sm border border-gray-300 transition-colors"
                                >
                                    Simulate Payment
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleViewStamp(asset.assetId)}
                                className="w-full flex items-center justify-center gap-2 bg-[#003893] hover:bg-blue-800 text-white py-2 px-4 rounded-sm font-bold uppercase text-sm transition-colors"
                            >
                                <QrCode size={16} />
                                View Digital Stamp
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading assets...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {searchParams.get('status') === 'success' && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 shadow-sm">
                    <CheckCircle2 className="flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-lg">Payment Successful! 🎉</h4>
                        <p className="text-sm opacity-90">Your tax has been successfully processed. Your digital stamp is ready.</p>
                    </div>
                </div>
            )}
            {searchParams.get('status') === 'failure' && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 shadow-sm">
                    <AlertCircle className="flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-lg">Payment Failed</h4>
                        <p className="text-sm opacity-90">There was an issue processing your payment with eSewa. Please try again.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b-2 border-[#003893] pb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#003893] uppercase tracking-wide">Citizen Dashboard</h2>
                    <p className="text-gray-600 mt-1 text-sm">Asset and Tax Management System</p>
                </div>
                <div className="flex bg-gray-100 rounded-sm p-1 border border-gray-300">
                    <button 
                        onClick={() => setActiveTab('assets')}
                        className={`px-4 py-2 text-sm font-bold rounded-sm uppercase tracking-wide transition-all ${activeTab === 'assets' ? 'bg-[#003893] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                    >
                        My Assets
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-sm font-bold rounded-sm uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-[#003893] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                    >
                        <FileText size={16} /> History
                    </button>
                </div>
            </div>

            {activeTab === 'assets' ? (
                <div className="space-y-10">
                    <section className="animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-2">
                            <span className="p-2 bg-[#003893]/10 text-[#003893] rounded-lg">
                                <Car size={24} />
                            </span>
                            Registered Vehicles
                        </h3>
                        {assets.vehicles.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {assets.vehicles.map(v => (
                                    <AssetCard key={v.assetId} asset={v} type="Vehicle" />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center text-gray-500 hover:shadow-md transition-shadow">
                                <Car size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="font-medium">No registered vehicle found in your name.</p>
                            </div>
                        )}
                    </section>

                    <section className="animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-2">
                            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                <Map size={24} />
                            </span>
                            Registered Land
                        </h3>
                        {assets.lands.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {assets.lands.map(l => (
                                    <AssetCard key={l.assetId} asset={l} type="Land" />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center text-gray-500 hover:shadow-md transition-shadow">
                                <Map size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="font-medium">No registered land found in your name.</p>
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <PaymentHistory />
                </div>
            )}

            <DigitalStampModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                qrData={qrData} 
            />
        </div>
    );
};

export default CitizenView;
