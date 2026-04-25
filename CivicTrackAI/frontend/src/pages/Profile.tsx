import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Shield, Activity, RefreshCw, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);

    const fetchUserIssues = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await axios.get(`https://rokcverse-production.up.railway.app/api/issues/user/${user.id}`);
            setIssues(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserIssues();
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!newName.trim() || newName === user?.name) {
            setIsEditing(false);
            return;
        }
        setSaving(true);
        try {
            await updateUser(newName);
            toast.success("Identity Matrix Updated");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to sync identity");
            setNewName(user?.name || '');
        }
        setSaving(false);
    };

    const handleDeleteIssue = async (id: number) => {
        try {
            await axios.delete(`https://rokcverse-production.up.railway.app/api/issues/${id}`);
            toast.success("Anomaly Expunged");
            setIssues(issues.filter(issue => issue.id !== id));
        } catch (error) {
            toast.error("Failed to expunge record");
        }
    };

    const activeCount = issues.filter(i => i.status === 'OPEN').length;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 py-6 md:py-10 px-4 md:px-6 max-w-7xl mx-auto w-full pb-24"
        >
            {/* Left Sidebar - Identity Matrix */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                <motion.div 
                    className="glass p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-[var(--color-glow)]/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-glow)] to-transparent opacity-50" />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-glow)]" />
                        <h2 className="text-[10px] md:text-xs font-black text-white/50 tracking-[0.2em] uppercase">Citizen ID</h2>
                    </div>

                    <div className="flex flex-col items-center md:items-start mb-6">
                        {isEditing ? (
                            <div className="flex flex-col w-full gap-3">
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-black/50 border border-[var(--color-glow)]/50 rounded-xl px-4 py-3 font-bold text-white focus:outline-none w-full text-center md:text-left"
                                />
                                <button 
                                    onClick={handleUpdateProfile} 
                                    disabled={saving}
                                    className="bg-[var(--color-glow)] text-black px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg w-full flex justify-center items-center"
                                >
                                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sync Identity"}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full relative py-2">
                                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-1 text-center md:text-left">{user?.name}</h1>
                                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--color-glow)] text-center md:text-left">{user?.role === 'ADMIN' ? 'Grid Administrator' : 'Operative Level 1'}</p>
                                
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="absolute -top-1 -right-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
                                >
                                    <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/40 border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl overflow-hidden">
                            <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase block mb-1">Encrypted Link</span>
                            <span className="text-[10px] md:text-xs text-white/70 font-mono tracking-tight truncate block">{user?.email}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Diagnostics */}
                <div className="glass p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                        <h2 className="text-[10px] md:text-[xs] font-black text-white/50 tracking-[0.2em] uppercase">Metrics</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl text-center min-h-[90px] flex flex-col justify-center">
                            <span className="block text-2xl md:text-3xl font-black text-white/90">{issues.length}</span>
                            <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 mt-1 block">Submissions</span>
                        </div>
                        <div className="bg-[var(--color-glow)]/10 border border-[var(--color-glow)]/20 p-4 rounded-2xl text-center min-h-[90px] flex flex-col justify-center">
                            <span className="block text-2xl md:text-3xl font-black text-[var(--color-glow)]">{activeCount}</span>
                            <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[var(--color-glow)]/60 mt-1 block">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Main Panel - Smart Grid */}
            <div className="flex-1 flex flex-col">
                <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter flex items-center gap-2 uppercase">
                            <Zap className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-glow)]" /> 
                            Tactical Grid
                        </h2>
                    </div>
                </div>

                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <RefreshCw className="w-8 h-8 animate-spin text-[var(--color-glow)]" />
                        </div>
                    ) : issues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border border-white/5">
                            <Shield className="w-12 h-12 text-white/10 mb-4" />
                            <h3 className="text-lg font-black mb-1 tracking-tighter text-white/60 uppercase">No Trace Detected</h3>
                            <p className="text-white/30 text-xs italic">Upload civic anomalies to populate your sector array.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {issues.map(issue => (
                                    <motion.div 
                                        layout
                                        key={issue.id} 
                                        className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-[var(--color-glow)]/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col"
                                    >
                                        <div className="relative h-40 w-full bg-white/5 overflow-hidden">
                                            <img 
                                                src={issue.imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"} 
                                                alt={issue.title} 
                                                className="w-full h-full object-cover transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 left-2 flex gap-2 flex-wrap max-w-[90%]">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md backdrop-blur-md border ${
                                                    issue.priority === 'HIGH' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 
                                                    issue.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' :
                                                    'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
                                                }`}>
                                                    {issue.priority}
                                                </span>
                                                {issue.category && (
                                                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md backdrop-blur-md border bg-[#0b0f1a]/80 text-[var(--color-glow)] border-[var(--color-glow)]/50">
                                                        {issue.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-white text-sm leading-tight mb-1 uppercase tracking-tight truncate">{issue.title || "Unclassified Issue"}</h4>
                                                <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed mb-3 italic">
                                                    {issue.description || "No supplemental details provided."}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteIssue(issue.id)}
                                                className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Expunge
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
