import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Trash2, Lock, Unlock, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'users' | 'activity'>('users');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, activitiesRes] = await Promise.all([
                axios.get(`${API_URL}/admin/users`),
                axios.get(`${API_URL}/admin/activities`)
            ]);
            setUsers(usersRes.data);
            setActivities(activitiesRes.data);
        } catch (error) {
            toast.error("Failed to fetch administrative data");
        }
        setLoading(false);
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`${API_URL}/admin/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
                toast.success("User deleted successfully");
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleToggleBlock = async (id: number, currentStatus: boolean) => {
        try {
            await axios.put(`${API_URL}/admin/users/${id}/block`, { isBlocked: !currentStatus });
            setUsers(users.map(u => u.id === id ? { ...u, blocked: !currentStatus } : u));
            toast.success(currentStatus ? "User unblocked" : "User blocked");
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="w-10 h-10 animate-spin text-[var(--color-glow)]" />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter uppercase flex items-center gap-4">
                        <Shield className="w-8 h-8 md:w-12 md:h-12 text-[var(--color-glow)]" />
                        Admin Command Center
                    </h1>
                    <p className="text-white/40 text-sm md:text-lg font-medium italic">High-level sector oversight and operative management</p>
                </div>
                
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 glass">
                    <button 
                        onClick={() => setTab('users')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'users' ? 'bg-[var(--color-glow)] text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        <Users className="w-4 h-4 inline-block mr-2" /> Operatives
                    </button>
                    <button 
                        onClick={() => setTab('activity')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'activity' ? 'bg-[var(--color-glow)] text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        <Activity className="w-4 h-4 inline-block mr-2" /> Signal Logs
                    </button>
                </div>
            </div>

            {tab === 'users' ? (
                <div className="glass overflow-hidden rounded-[2rem] border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    <th className="p-6">Operative</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Joined</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <p className="font-bold text-white uppercase tracking-tight">{u.name}</p>
                                            <p className="text-[10px] text-white/40 font-mono">{u.email}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${u.blocked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                                                {u.blocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-[10px] text-white/40 font-mono">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 text-right flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleBlock(u.id, u.blocked)}
                                                className={`p-2 rounded-lg border transition-all ${u.blocked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20'}`}
                                                title={u.blocked ? "Unblock User" : "Block User"}
                                            >
                                                {u.blocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {activities.map((a, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[var(--color-glow)]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[var(--color-glow)] transition-colors">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{a.email}</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black italic">Successful Link Established from {a.location || 'Unknown Node'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-mono text-white/40">{new Date(a.timestamp).toLocaleDateString()}</p>
                                <p className="text-[10px] font-mono text-white/20">{new Date(a.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default AdminPanel;
