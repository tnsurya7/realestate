import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Spinner } from '../../components/UI';

const FEATURES = [
    { icon: '👥', title: 'All Leads', desc: 'Complete lead database with customer info, status, and assigned agents.' },
    { icon: '🏠', title: 'Properties', desc: 'Full property listing with pricing, status, and type breakdown.' },
    { icon: '📊', title: 'Analytics Summary', desc: 'Charts and metrics for leads by status, agent, and property.' },
    { icon: '👤', title: 'Agent Performance', desc: 'Individual agent lead counts and conversion statistics.' },
];

const AdminReportsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const blob = await adminService.downloadReport();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `crm-report-${new Date().toISOString().split('T')[0]}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('📥 Report downloaded successfully!');
        } catch {
            toast.error('Failed to generate report. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-500 text-sm mt-0.5">Generate and download CRM reports</p>
            </div>

            {/* Hero Download Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold mb-2">CRM Lead Report</h2>
                <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm">
                    Download a comprehensive PDF report containing all leads, agents, and property data from your CRM database.
                </p>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDownload}
                    disabled={loading}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg inline-flex items-center gap-2 disabled:opacity-70"
                >
                    {loading ? (
                        <><Spinner size="w-4 h-4" /><span>Generating Report...</span></>
                    ) : (
                        <><span>📥</span><span>Download PDF Report</span></>
                    )}
                </motion.button>
            </motion.div>

            {/* Report Contents */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">What's included in the report?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="card p-5 flex items-start gap-4"
                        >
                            <div className="text-3xl">{f.icon}</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Report Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 mb-1">PDF</p>
                        <p className="text-xs text-gray-500">Format</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 mb-1">Live</p>
                        <p className="text-xs text-gray-500">Data</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 mb-1">EN</p>
                        <p className="text-xs text-gray-500">Language</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 mb-1">FREE</p>
                        <p className="text-xs text-gray-500">Cost</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminReportsPage;
