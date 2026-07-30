import React, { useState } from 'react';
import { scanQR } from '../utils/api';
import { ScanLine, CheckCircle2, XCircle, Search, FileCheck2 } from 'lucide-react';

const OfficialView = ({ roleName }) => {
    const [qrInput, setQrInput] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        if (!qrInput.trim()) return;

        setLoading(true);
        setError('');
        setVerificationResult(null);

        try {
            const result = await scanQR(qrInput);
            setVerificationResult(result.data);
            setQrInput(''); // Clear input after successful scan
        } catch (err) {
            setError('Invalid or expired Digital Stamp. Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
                    <ScanLine size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{roleName} Portal</h2>
                <p className="text-gray-500 mt-2 text-lg">Verify Digital Stamps via QR Code Input</p>
            </div>

            {!verificationResult ? (
                <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-xl mx-auto">
                    <form onSubmit={handleScan} className="space-y-6">
                        <div>
                            <label htmlFor="qrData" className="block text-sm font-medium text-gray-700 mb-2">
                                Scanned QR Data (Encrypted String)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="qrData"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                                    placeholder="Paste encrypted string from Citizen's QR..."
                                    value={qrInput}
                                    onChange={(e) => setQrInput(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !qrInput}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Verifying...'
                            ) : (
                                <>
                                    <ScanLine size={18} />
                                    Simulate Scan & Verify
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-bottom-2">
                            <XCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-red-800 font-semibold text-sm">Verification Failed</h4>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 max-w-xl mx-auto shadow-lg shadow-green-500/10 animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-md">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-green-900">Valid Digital Stamp</h3>
                        <p className="text-green-700 mt-1">Asset tax has been cleared.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-gray-700 border-b border-gray-100 pb-4">
                            <FileCheck2 className="text-blue-500" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Asset Type</p>
                                <p className="font-semibold">{verificationResult.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 border-b border-gray-100 pb-4">
                            <div className="w-6" /> {/* Spacer */}
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Identifier / Reg. No.</p>
                                <p className="font-semibold text-lg text-[#003893]">
                                    {verificationResult.identifier}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 border-b border-gray-100 pb-4">
                            <div className="w-6" /> {/* Spacer */}
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Registered Owner</p>
                                <p className="font-semibold text-gray-900">
                                    {verificationResult.ownerName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-6" /> {/* Spacer */}
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Clearance Valid Until</p>
                                <p className="font-bold text-green-600">{verificationResult.validUntil}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => setVerificationResult(null)}
                            className="w-full bg-white border-2 border-green-200 text-green-700 hover:bg-green-100 py-3 px-4 rounded-xl font-medium transition-colors"
                        >
                            Scan Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfficialView;
