import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      login(username);
      toast.success(`Welcome back, ${username}!`);
      navigate('/dashboard');
    } else {
      toast.error("Please enter credentials");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex items-center justify-center p-6 relative overflow-hidden"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md glass-card p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-glow)]/10 rounded-2xl flex items-center justify-center mb-4 border border-[var(--color-glow)]/20 shadow-xl">
             <Shield className="w-8 h-8 text-[var(--color-glow)]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Authentication</h1>
          <p className="text-white/40 text-sm font-medium italic">Protocol Secure - Access Authorized Personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Identifier</label>
            <div className="relative group">
               <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[var(--color-glow)] transition-colors" />
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-glow)]/20 focus:bg-white/10 transition-all font-bold text-white placeholder-white/10"
                 placeholder="Admin or Citizen"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Access Code</label>
            <div className="relative group">
               <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[var(--color-glow)] transition-colors" />
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-glow)]/20 focus:bg-white/10 transition-all font-bold text-white placeholder-white/20"
                 placeholder="••••••••"
               />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            Establish Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
           <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] italic">Note: Unauthorized access will be logged</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
