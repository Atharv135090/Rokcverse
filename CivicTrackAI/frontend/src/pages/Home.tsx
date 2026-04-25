import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, BarChart3, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col pt-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/20 mb-8 mx-auto shadow-xl">
             <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Next-Gen Civic Infrastructure</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-white">
            Transforming City <br /> 
            <span className="neon-text italic">Response Systems</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-white/50 text-xl font-medium leading-relaxed mb-12">
            CivicTrack AI uses neural detection to bridge the gap between citizens and authorities in real-time.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => navigate('/report')}
              className="px-10 py-5 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-3xl font-black text-lg hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(34,211,238,0.4)] flex items-center gap-3"
            >
              Report Issue <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-10 py-5 glass border-white/20 text-white rounded-3xl font-black text-lg hover:bg-white/10 transition-all"
            >
              Live Feed
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">
        {[
          { icon: Shield, title: 'AI Detection', desc: 'Automatic severity analysis using neural core processing.' },
          { icon: MapPin, title: 'Geo-Spatial Intel', desc: 'Precise location tracking for faster municipal dispatch.' },
          { icon: BarChart3, title: 'Real-time Pulse', desc: 'Live data visualization of city health and responses.' }
        ].map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * idx }}
            className="glass-card p-10 flex flex-col items-start gap-4"
          >
            <div className="w-14 h-14 bg-[var(--color-glow)]/10 rounded-2xl flex items-center justify-center border border-[var(--color-glow)]/20 shadow-xl">
              <f.icon className="w-7 h-7 text-[var(--color-glow)]" />
            </div>
            <h3 className="text-2xl font-bold mt-2">{f.title}</h3>
            <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
