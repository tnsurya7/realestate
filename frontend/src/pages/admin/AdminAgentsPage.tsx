import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import { EmptyState } from '../../components/UI';
import { motion } from 'framer-motion';

const MOCK_AGENTS: User[] = [
    { id: 1, name: 'Ravi Kumar', email: 'ravi@crm.com', role: 'AGENT' },
    { id: 2, name: 'Priya Sharma', email: 'priya@crm.com', role: 'AGENT' },
    { id: 3, name: 'Arun Patel', email: 'arun@crm.com', role: 'AGENT' },
];

const AdminAgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAgents().then(setAgents).catch(() => setAgents(MOCK_AGENTS)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
                <p className="text-gray-500 text-sm mt-0.5">{agents.length} registered agents</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card p-5 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                <div className="flex-1"><div className="h-4 bg-gray-200 rounded mb-2" /><div className="h-3 bg-gray-200 rounded w-2/3" /></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : agents.length === 0 ? (
                <EmptyState icon="👤" title="No agents yet" description="Register agents via the API endpoint." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card p-5 hover:shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                                    {agent.name[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{agent.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{agent.email}</p>
                                    <div className="mt-2">
                                        <span className="badge badge-agent">AGENT</span>
                                        {agent.accountLocked && <span className="badge bg-red-100 text-red-700 ml-2">Locked</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 text-sm text-gray-500">
                                <span className="text-xs">ID: #{agent.id}</span>
                                {agent.createdAt && <span className="text-xs ml-auto">Joined {new Date(agent.createdAt).toLocaleDateString()}</span>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminAgentsPage;
