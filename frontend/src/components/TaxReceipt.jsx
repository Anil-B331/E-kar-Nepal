import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const TaxReceipt = ({ data, onClose }) => {
    if (!data) return null;

    const { transaction, citizen, asset } = data;
    const dateStr = new Date(transaction.timestamp).toLocaleDateString();

    const receiptContent = (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto" id="printable-receipt-container">
            {/* Screen-only overlay controls */}
            <div className="print:hidden fixed top-4 right-4 flex gap-4">
                <button onClick={() => window.print()} className="bg-[#003893] text-white px-4 py-2 rounded shadow font-bold hover:bg-blue-800">Print</button>
                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow font-bold hover:bg-gray-300">Close</button>
            </div>

            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 10mm; }
                    /* Hide everything in the body EXCEPT our receipt container */
                    body > *:not(#printable-receipt-container) { 
                        display: none !important; 
                    }
                    body {
                        background: white;
                    }
                    #printable-receipt-container { 
                        position: relative !important; 
                        display: block !important;
                        overflow: visible !important;
                    }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white text-black font-serif" id="receipt-content">
                {/* Header */}
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold">{citizen.municipality}</h1>
                    <h2 className="text-lg sm:text-xl font-bold mt-1">नगर कार्यपालिकाको कार्यालय</h2>
                    <p className="text-xs sm:text-sm mt-1">{citizen.district}, {citizen.province}, नेपाल</p>
                    <h3 className="text-sm sm:text-lg font-bold mt-3 border-2 border-black inline-block px-3 sm:px-4 py-1 rounded-full">
                        {asset.assetType === 'Land' ? 'सम्पत्ति तथा भूमीकर रसिद' : 'सवारी साधन कर रसिद'} (सेवाग्राही प्रति)
                    </h3>
                    <p className="text-[10px] sm:text-xs mt-2">मान्य अवधि: {asset.valid_until || '२०८१ आषाढ मसान्तसम्म'}</p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 text-xs sm:text-sm">
                    <div className="flex justify-between sm:block"><span className="font-bold">विद्युतीय कारोबार संकेत नं (Txn ID):</span> <span className="sm:hidden">&nbsp;</span>{transaction.transaction_uuid}</div>
                    <div className="flex justify-between sm:text-right"><span className="font-bold">रसिद नं (Receipt No):</span> <span className="sm:hidden">&nbsp;</span>REC-{transaction.id}</div>
                    
                    <div className="flex justify-between sm:block"><span className="font-bold">मिति (Date):</span> <span className="sm:hidden">&nbsp;</span>{dateStr}</div>
                    <div className="flex justify-between sm:text-right"><span className="font-bold">आ.व. (Fiscal Year):</span> <span className="sm:hidden">&nbsp;</span>2080/2081</div>
                    
                    <div className="flex justify-between sm:block"><span className="font-bold">करदाताको नाम थर (Taxpayer Name):</span> <span className="sm:hidden">&nbsp;</span>{citizen.first_name} {citizen.last_name}</div>
                    <div className="flex justify-between sm:text-right"><span className="font-bold">प्रदेश (Province):</span> <span className="sm:hidden">&nbsp;</span>{citizen.province}</div>
                    
                    <div className="flex justify-between sm:block"><span className="font-bold">न.पा./गा.पा (Municipality):</span> <span className="sm:hidden">&nbsp;</span>{citizen.municipality}</div>
                    <div className="flex justify-between sm:text-right"><span className="font-bold">वडा नं (Ward No):</span> <span className="sm:hidden">&nbsp;</span>{citizen.ward_number}</div>
                    
                    <div className="flex justify-between sm:block"><span className="font-bold">करदाता संकेत (Taxpayer ID):</span> <span className="sm:hidden">&nbsp;</span>{citizen.citizenship_number}</div>
                    <div className="flex justify-between sm:text-right"><span className="font-bold">जिल्ला (District):</span> <span className="sm:hidden">&nbsp;</span>{citizen.district}</div>
                </div>

                {/* Asset Details Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="min-w-[600px] w-full border-collapse border border-black text-xs sm:text-sm text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black py-2 px-1">सम्पत्तिको प्रकार (Asset Type)</th>
                                <th className="border border-black py-2 px-1">परिचय नम्बर (Identifier)</th>
                                <th className="border border-black py-2 px-1">क्षेत्रफल / क्षमता (Size/CC)</th>
                                <th className="border border-black py-2 px-1">प्रकार (Category)</th>
                                <th className="border border-black py-2 px-1">कर योग्य मूल्य (Taxable Value)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black py-3 px-2 font-bold">{asset.assetType === 'Land' ? 'जग्गा (Land)' : 'सवारी साधन (Vehicle)'}</td>
                                <td className="border border-black py-3 px-2 font-mono">{asset.kitta_number || asset.plate_number}</td>
                                <td className="border border-black py-3 px-2 font-mono">{asset.area} {asset.assetType === 'Land' ? 'sqm' : 'cc'}</td>
                                <td className="border border-black py-3 px-2">{asset.type}</td>
                                <td className="border border-black py-3 px-2 font-bold">रु. {transaction.amount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Summary Table */}
                <div className="flex flex-col sm:flex-row justify-between items-start mt-8 gap-8 sm:gap-0">
                    <table className="w-full sm:w-1/2 border-collapse border border-black text-xs sm:text-sm">
                        <tbody>
                            <tr>
                                <td className="border border-black py-2 px-2 sm:px-3 font-bold bg-gray-100">कर निर्धारण (Tax Assessed):</td>
                                <td className="border border-black py-2 px-2 sm:px-3 text-right">रु. {transaction.amount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="border border-black py-2 px-2 sm:px-3 font-bold bg-gray-100">अन्य सेवा शुल्क (Other Fees):</td>
                                <td className="border border-black py-2 px-2 sm:px-3 text-right">रु. 0</td>
                            </tr>
                            <tr>
                                <td className="border border-black py-2 px-2 sm:px-3 font-bold bg-gray-100 text-sm sm:text-lg">जम्मा (Total):</td>
                                <td className="border border-black py-2 px-2 sm:px-3 text-right font-bold text-sm sm:text-lg">रु. {transaction.amount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="border border-black py-2 px-2 sm:px-3 font-bold bg-gray-50 italic">
                                    अक्षरेपी (In Words): 
                                    <span className="ml-1 sm:ml-2 font-normal">रु {transaction.amount} मात्र (Rupees {transaction.amount} Only)</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="text-center w-full sm:w-auto mt-2 sm:mt-6 sm:mr-12">
                        <img src="/sign_mine.jpeg" alt="Signature" className="h-12 sm:h-16 mx-auto mb-1" />
                        <div className="w-32 border-b border-black mb-2 mx-auto"></div>
                        <p className="text-xs sm:text-sm font-bold">बुझ्नेको दस्तखत</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">(Signature of Receiver)</p>
                        <p className="text-[10px] sm:text-xs mt-2 font-bold text-[#003893]">E-Kar Nepal System Generated</p>
                    </div>
                </div>

            </div>
        </div>
    );

    return ReactDOM.createPortal(receiptContent, document.body);
};

export default TaxReceipt;
