import React, { useState, useEffect } from 'react';
import { fetchAdminStats } from '../utils/api';
import { BarChart3, TrendingUp, CheckCircle2, History } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching admin stats', error);
            setError('Failed to load admin stats. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading admin dashboard...</div>;
    if (error || !stats) return <div className="p-12 text-center text-red-500">{error || 'Failed to load stats.'}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin & Revenue Dashboard</h2>
                <p className="text-gray-500 mt-2 text-lg">Nationwide tax collection overview and recent transactions.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-sm p-6 border border-gray-300 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 border border-blue-200 bg-blue-50 text-[#003893] rounded-sm">
                            <TrendingUp size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 uppercase tracking-wide">Total Revenue Collected</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-[#003893] relative z-10">Rs. {parseInt(stats.totalRevenue).toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-sm p-6 border border-gray-300 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 border border-red-200 bg-red-50 text-[#DC143C] rounded-sm">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 uppercase tracking-wide">Total Transactions</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-[#DC143C] relative z-10">{stats.totalTxns}</p>
                </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-300 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-300 flex items-center gap-2">
                    <History className="text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-800">Recent Transactions Feed</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Txn ID</th>
                                <th className="px-6 py-4 font-semibold">Citizen Details</th>
                                <th className="px-6 py-4 font-semibold">Asset Details</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentTransactions.map(txn => (
                                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{txn.transaction_uuid}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#003893]">{txn.citizen_name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-400">{txn.citizenship_number}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-700">
                                            {txn.plate_number ? `Vehicle: ${txn.plate_number}` : (txn.kitta_number ? `Land: Kitta ${txn.kitta_number}` : txn.asset_id)}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">{txn.asset_id}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">Rs. {txn.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(txn.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 border text-xs font-bold uppercase tracking-wider ${txn.status === 'SUCCESS' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                                            <CheckCircle2 size={12} /> {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
