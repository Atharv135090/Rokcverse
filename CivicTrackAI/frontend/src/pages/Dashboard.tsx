import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Filter, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight, PlusCircle } from 'lucide-react';

const Dashboard = () => {
    const [issues, setIssues] = useState<any[]>([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/issues');
                setIssues(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchIssues();
        const interval = setInterval(fetchIssues, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    const filteredIssues = issues.filter(i => filter === 'ALL' || i.priority === filter);

    const stats = [
        { label: 'Total Reports', value: issues.length, icon: TrendingUp, color: 'text-blue-400' },
        { label: 'High Priority', value: issues.filter(i => i.priority === 'HIGH').length, icon: AlertCircle, color: 'text-red-400' },
        { label: 'Resolved Cases', value: 0, icon: CheckCircle, color: 'text-green-400' },
    ];

    return (
        <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                   <h1 className="text-6xl font-black mb-2 tracking-tighter">Public Dashboard</h1>
                   <p className="text-white/40 text-lg font-medium">Real-time pulse of civic infrastructure detections</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 glass shadow-2xl">
                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setFilter(lvl)}
                            className={`px-6 py-2 rounded-full text-xs font-black transition-all ${
                                filter === lvl ? 'bg-[var(--color-glow)] text-[var(--color-darkbg)] shadow-lg' : 'text-white/40 hover:text-white'
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="glass-card p-8 flex items-center justify-between group"
                    >
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">{s.label}</p>
                            <p className="text-5xl font-black text-white">{s.value}</p>
                        </div>
                        <div className={`p-4 rounded-3xl bg-white/5 border border-white/10 ${s.color} transition-all group-hover:scale-110`}>
                            <s.icon className="w-8 h-8" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Network Insight Box */}
            <div className="mb-12 glass p-1 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-blue-600/10 pointer-events-none group-hover:bg-blue-600/20 transition-all"></div>
                <div className="bg-[#0b0f1a]/80 backdrop-blur-md p-6 rounded-[1.8rem] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border border-white/5">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[var(--color-glow)]/10 rounded-2xl flex items-center justify-center border border-[var(--color-glow)]/20 animate-pulse">
                         <TrendingUp className="w-8 h-8 text-[var(--color-glow)]" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold mb-1">AI Network Insight</h3>
                         <p className="text-white/40 text-sm font-medium">Processing real-time civic nodes. Detecting high-priority congestion in Satara city center.</p>
                      </div>
                   </div>
                   <button onClick={() => navigate('/map')} className="px-8 py-3 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-2xl font-black text-sm whitespace-nowrap hover:scale-105 transition-all shadow-xl shadow-[var(--color-glow)]/20">
                      Explore Live Grid
                   </button>
                </div>
            </div>

            {/* Issue Grid */}
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-4">
               <span className="w-12 h-[1px] bg-white/10"></span> Live Pulse Analytics
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                <AnimatePresence mode="popLayout">
                    {filteredIssues.map((issue) => (
                        <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -10 }}
                            layout
                            className="glass-card group cursor-pointer border border-white/10 flex flex-col h-full overflow-hidden"
                            onClick={() => navigate(`/issues/${issue.id}`)}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img 
                                    src={issue.imageUrl} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt="Issue"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80';
                                    }}
                                />
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-[#0b0f1a]/80 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                                    <Clock className="w-3.5 h-3.5 text-[var(--color-glow)]" />
                                    <span className="text-[10px] font-black uppercase text-white/80">{new Date(issue.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className={`absolute bottom-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-2xl ${
                                    issue.priority === 'HIGH' ? 'bg-red-500/80 border-red-400 neon-badge-pulse-high' : 'bg-amber-500/80 border-amber-400 neon-badge-pulse-medium'
                                }`}>
                                    {issue.priority} Priority
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-2xl font-black mb-3 line-clamp-1 group-hover:text-[var(--color-glow)] transition-colors">{issue.title}</h3>
                                <p className="text-white/40 font-medium line-clamp-2 leading-relaxed mb-6 flex-1 italic">
                                    "{issue.description}"
                                </p>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Filter className="w-3.5 h-3.5 text-white/40" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-white/20 tracking-tighter">Status: Active</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[var(--color-glow)] group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Floating Action Button */}
            <motion.button
               whileHover={{ scale: 1.1, rotate: 90 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => navigate('/report')}
               className="fixed bottom-12 right-12 w-20 h-20 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all z-50 animate-bounce"
            >
               <PlusCircle className="w-10 h-10" />
            </motion.button>
        </div>
    );
};

export default Dashboard;
