import React, { useState, useEffect } from 'react';
import { fetchTransactionHistory, fetchTransactionReceipt } from '../utils/api';
import { Clock, CheckCircle2, XCircle, Download, FileText, Loader2 } from 'lucide-react';
import TaxReceipt from './TaxReceipt';

const PaymentHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [receiptData, setReceiptData] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await fetchTransactionHistory();
            setHistory(data);
        } catch (error) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (txnId, assetId) => {
        if (assetId && assetId.startsWith('V-')) {
            alert('Vehicle tax receipt format will be added soon! Please provide the sample image for it next time.');
            return;
        }
        
        try {
            setReceiptLoading(txnId);
            const data = await fetchTransactionReceipt(txnId);
            setReceiptData(data);
        } catch (error) {
            console.error('Failed to fetch receipt', error);
            alert('Failed to generate receipt. Please try again.');
        } finally {
            setReceiptLoading(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-gray-500">Loading history...</div>;

    if (history.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center text-gray-500">
                <Clock size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="font-medium">No payment history found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto w-full">
                <table className="min-w-[800px] w-full text-left text-sm text-gray-500 whitespace-nowrap">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Asset ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((txn) => (
                            <tr key={txn.transaction_uuid} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 font-mono">
                                    {txn.transaction_uuid}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 font-mono">
                                    {txn.asset_id}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(txn.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    Rs. {parseFloat(txn.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1 ${
                                        txn.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                        txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {txn.status === 'SUCCESS' ? <CheckCircle2 size={12}/> : 
                                         txn.status === 'PENDING' ? <Clock size={12}/> : <XCircle size={12}/>}
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {txn.status === 'SUCCESS' && (
                                        <button 
                                            disabled={receiptLoading === txn.transaction_uuid}
                                            onClick={() => handleDownloadReceipt(txn.transaction_uuid, txn.asset_id)}
                                            className="text-[#003893] hover:text-blue-800 font-bold inline-flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {receiptLoading === txn.transaction_uuid ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
                                            Receipt
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hidden Receipt Component that is displayed in fullscreen during print */}
            {receiptData && (
                <TaxReceipt 
                    data={receiptData} 
                    onClose={() => setReceiptData(null)} 
                />
            )}
        </div>
    );
};

export default PaymentHistory;
