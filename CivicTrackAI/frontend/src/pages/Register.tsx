import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, login } = useAuth() as any;
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (username.length < 3) throw new Error("Username too short");
      if (password.length < 4) throw new Error("Password too short");
      
      register(username, password);
      login(username, password);
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
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
          <div className="w-16 h-16 bg-[var(--color-success)]/10 rounded-2xl flex items-center justify-center mb-4 border border-[var(--color-success)]/20 shadow-xl">
             <UserPlus className="w-8 h-8 text-[var(--color-success)]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Initialize User</h1>
          <p className="text-white/40 text-sm font-medium italic text-center">Create your citizen profile to start reporting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Identifier</label>
            <div className="relative group">
               <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[var(--color-success)] transition-colors" />
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-success)]/20 focus:bg-white/10 transition-all font-bold text-white placeholder-white/10"
                 placeholder="Enter username"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Access Code</label>
            <div className="relative group">
               <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[var(--color-success)] transition-colors" />
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-success)]/20 focus:bg-white/10 transition-all font-bold text-white placeholder-white/20"
                 placeholder="••••••••"
               />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-[var(--color-success)] text-[var(--color-darkbg)] rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            Create Record <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
           <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
             Already have a profile? <Link to="/login" className="text-[var(--color-glow)] hover:underline">Log In</Link>
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
