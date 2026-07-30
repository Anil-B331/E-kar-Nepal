import React from 'react';
import QRCode from 'react-qr-code';
import { X } from 'lucide-react';

const DigitalStampModal = ({ isOpen, onClose, qrData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 relative animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Digital Stamp</h3>
                    <p className="text-sm text-gray-500 mt-1">Official Payment Verification</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-gray-100 flex justify-center shadow-inner">
                    {qrData ? (
                        <QRCode value={qrData} size={200} className="w-full max-w-[200px]" />
                    ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400">
                            Loading...
                        </div>
                    )}
                </div>
                <div className="mt-6 text-center text-xs text-gray-400">
                    Show this QR code to the designated official for quick verification.
                </div>
                {qrData && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-1">Encrypted String (For Testing):</p>
                        <div className="flex items-center gap-2">
                            <input 
                                id="qrDataInput"
                                type="text" 
                                readOnly 
                                value={qrData} 
                                className="w-full text-xs bg-gray-50 border border-gray-200 rounded p-2 text-gray-600 font-mono outline-none"
                            />
                            <button 
                                onClick={() => {
                                    if (navigator.clipboard && window.isSecureContext) {
                                        navigator.clipboard.writeText(qrData);
                                        alert('Copied to clipboard!');
                                    } else {
                                        // Fallback for non-HTTPS mobile testing
                                        const input = document.getElementById('qrDataInput');
                                        input.select();
                                        input.setSelectionRange(0, 99999); // For mobile devices
                                        try {
                                            document.execCommand('copy');
                                            alert('Copied to clipboard (fallback)!');
                                        } catch (err) {
                                            alert('Unable to copy automatically. Please copy manually.');
                                        }
                                    }
                                }}
                                className="shrink-0 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded text-xs font-semibold transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalStampModal;
