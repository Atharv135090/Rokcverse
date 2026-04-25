import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MapPin, Clock, AlertTriangle, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-hot-toast';

const IssueDetail = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleFormalSubmit = async () => {
    try {
      await axios.put(`http://localhost:8080/api/issues/${id}/status?status=FORMALLY_REPORTED`);
      setIssue({ ...issue, status: 'FORMALLY_REPORTED' });
      toast.success("Formal report successfully submitted to municipal authorities.");
    } catch (err) {
      toast.error("Failed to submit formal report.");
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/api/issues/${id}`)
      .then(res => {
        setIssue(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
       <div className="w-12 h-12 border-4 border-[var(--color-glow)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!issue) return (
    <div className="flex-1 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
       <h2 className="text-2xl font-bold mb-4">Issue Not Found</h2>
       <Link to="/dashboard" className="px-8 py-3 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-2xl font-black shadow-xl">Back to Dashboard</Link>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 min-h-screen text-white p-6 md:p-12 overflow-y-auto relative"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-white/50 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-xs uppercase tracking-[0.2em]">Back to Reports</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Visual Content */}
          <div className="space-y-8">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 aspect-video glass"
            >
              <img 
                src={issue.imageUrl} 
                className="w-full h-full object-cover" 
                alt="Incident" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80';
                }}
              />
              <div className="absolute top-6 left-6">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--color-darkbg)]/80 backdrop-blur-md border shadow-2xl ${
                   issue.priority === 'HIGH' ? 'text-[var(--color-danger)] border-[var(--color-danger)] neon-badge-pulse-high' : 'text-amber-400 border-amber-400 neon-badge-pulse-medium'
                 }`}>
                   {issue.priority} Priority
                 </span>
              </div>
            </motion.div>

            {/* Map Snippet */}
            <div className="h-72 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
               <MapContainer 
                 center={[issue.latitude, issue.longitude]} 
                 zoom={13} 
                 style={{ height: '100%', width: '100%', background: '#0b0f1a' }}
                 zoomControl={false}
                 scrollWheelZoom={false}
                 dragging={false}
               >
                 <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                 <Marker position={[issue.latitude, issue.longitude]} icon={L.divIcon({
                    className: 'custom-pin',
                    html: `<div class="w-5 h-5 bg-[var(--color-glow)] rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>`
                 })} />
               </MapContainer>
               <div className="absolute inset-0 bg-[var(--color-darkbg)]/40 pointer-events-none" />
            </div>
          </div>

          {/* Right: Data Analysis */}
          <div className="space-y-8 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[var(--color-glow)] w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-glow)]">Verified AI Detection</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase glitch-text">
                  {issue.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/40">
                  <div className="flex items-center gap-2 text-xs font-black uppercase">
                    <MapPin className="w-4 h-4 text-[var(--color-glow)]" /> 
                    <span>{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase">
                    <Clock className="w-4 h-4 text-[var(--color-glow)]" /> 
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
             </div>

             <div className="p-8 glass-card border border-white/20 relative">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-glow)] mb-4 italic">&gt; NEURAL_ANALYSIS_LOG</h3>
               <p className="text-white/80 text-xl font-medium leading-relaxed italic">
                 "{issue.description}"
               </p>
             </div>

             <div className="grid grid-cols-2 gap-4 uppercase font-black">
               <div className="p-6 glass border border-white/10 rounded-3xl">
                 <p className="text-[9px] text-white/30 mb-2 tracking-[0.2em]">CURRENT_STATE</p>
                 <div className="flex items-center gap-2 text-[10px] text-[var(--color-glow)]">
                   <div className="w-2 h-2 rounded-full bg-[var(--color-glow)] animate-pulse"></div>
                   {issue.status}
                 </div>
               </div>
               <div className="p-6 glass border border-white/10 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-white/30 tracking-[0.2em]">Relay Stat</p>
                    <p className="text-[10px] text-white/80">Assessed</p>
                  </div>
                  <Share2 className="w-5 h-5 text-white/20" />
               </div>
             </div>

             <button 
               onClick={handleFormalSubmit}
               className="w-full py-5 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-3xl font-black text-lg shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-[1.02] active:scale-95 transition-all"
             >
                Submit Formal Report
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IssueDetail;
