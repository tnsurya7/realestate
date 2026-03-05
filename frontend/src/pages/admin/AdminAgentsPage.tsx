import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import { EmptyState, Spinner } from '../../components/UI';
import Modal from '../../components/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';


const AdminAgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<User | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        adminService.getAgents().then(setAgents).catch(() => setAgents([])).finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (editingAgent) {
                // Update existing agent
                const updated = await adminService.updateAgent(editingAgent.id, formData);
                setAgents(prev => prev.map(a => a.id === editingAgent.id ? updated : a));
                toast.success('Agent updated successfully');
            } else {
                // Create new agent
                const newAgent = await adminService.createAgent(formData);
                setAgents(prev => [newAgent, ...prev]);
                toast.success('Agent created successfully');
            }
            setIsModalOpen(false);
            setEditingAgent(null);
            setFormData({ name: '', email: '', password: '' });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed! Try a stronger password like Agent@123');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (agent: User) => {
        setEditingAgent(agent);
        setFormData({ name: agent.name, email: agent.email, password: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
        setFormData({ name: '', email: '', password: '' });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this agent?')) return;
        try {
            await adminService.deleteAgent(id);
            setAgents(agents.filter(a => a.id !== id));
            toast.success('Agent deleted successfully');
        } catch (error) {
            toast.error('Failed to delete agent');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{agents.length} registered agents</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full sm:w-auto">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Agent
                </button>
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
                <EmptyState icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} title="No agents yet" description="Register agents via the API endpoint." />
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
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 text-sm text-gray-500 items-center justify-between">
                                <div>
                                    <span className="text-xs">ID: #{agent.id}</span>
                                    {agent.createdAt && <span className="text-xs ml-2">Joined {new Date(agent.createdAt).toLocaleDateString()}</span>}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(agent)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit Agent">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(agent.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete Agent">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Agent Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAgent ? 'Edit Agent' : 'Create New Agent'}>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4" autoComplete="off">
                    <div>
                        <label className="label">Agent Name</label>
                        <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} autoComplete="new-password" />
                    </div>
                    <div>
                        <label className="label">Email Address</label>
                        <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} autoComplete="new-password" />
                    </div>
                    <div>
                        <label className="label">Password {editingAgent && '(Leave blank to keep current)'}</label>
                        <input type="password" className="input-field" required={!editingAgent} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} autoComplete="new-password" placeholder={editingAgent ? 'Leave blank to keep current' : 'Min 8 chars, uppercase, lowercase, digit, special char'} />
                        <p className="text-xs text-gray-500 mt-1">Must contain: uppercase, lowercase, digit, and special character (@$!%*?&)</p>
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={submitLoading}>
                            {submitLoading ? <><Spinner size="w-4 h-4 mr-2" /> {editingAgent ? 'Updating...' : 'Creating...'}</> : editingAgent ? 'Update Agent' : 'Create Agent'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminAgentsPage;
