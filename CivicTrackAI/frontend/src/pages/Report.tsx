import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Report = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      toast.success("Image selected");
    }
  };

  const trackReport = (issueId: number) => {
    if (user?.id) {
      const myReports = JSON.parse(localStorage.getItem(`my_reports_${user.id}`) || '[]');
      if (!myReports.includes(issueId)) {
        myReports.push(issueId);
        localStorage.setItem(`my_reports_${user.id}`, JSON.stringify(myReports));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      // Get user location for context
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('latitude', position.coords.latitude.toString());
            formData.append('longitude', position.coords.longitude.toString());
            if (user?.id) formData.append('userId', user.id);

            const res = await axios.post('https://rokcverse-production.up.railway.app/api/issues/report', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data && res.data.id) {
               trackReport(res.data.id);
               setAiData(res.data);
            }

            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 6000); // Give user 6 seconds to read AI info
          } catch (err) {
            console.error(err);
            toast.error("An error occurred during submission");
            setLoading(false);
          }
        },
        async (error) => {
          console.error("Location error", error);
          try {
            // Fallback if location fails
            const formData = new FormData();
            formData.append('image', file);
            formData.append('latitude', '19.0760'); // Default fallback
            formData.append('longitude', '72.8777');
            if (user?.id) formData.append('userId', user.id);

            const res = await axios.post('https://rokcverse-production.up.railway.app/api/issues/report', formData);
            if (res.data && res.data.id) {
               trackReport(res.data.id);
               setAiData(res.data);
            }
            
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 6000);
          } catch (err) {
            console.error(err);
            toast.error("An error occurred during submission");
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col items-center py-12 px-6"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-xl w-full p-8 rounded-[2.5rem]"
      >
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-white tracking-tighter">Report an Issue</h2>
          <p className="text-white/40 text-xs md:text-sm font-medium italic">Upload an image and our AI will do the rest.</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="relative mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 w-24 h-24 border-4 border-dashed border-[var(--color-success)]/30 rounded-full"
              />
              <div className="w-24 h-24 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center relative z-10">
                <CheckCircle2 className="w-12 h-12 text-[var(--color-success)]" />
              </div>
            </div>
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-white mb-4 tracking-tighter"
            >
              DATA TRANSMITTED
            </motion.h3>

            {aiData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 p-6 rounded-2xl mb-4 max-w-sm w-full text-left border border-white/10"
              >
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">AI Analysis</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        aiData.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                        {aiData.priority} PRIORITY
                    </span>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2 leading-tight">{aiData.title}</h4>
                 <p className="text-sm font-medium text-white/50 italic line-clamp-3">"{aiData.description}"</p>
              </motion.div>
            )}

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]"
            >
              Redirecting to Grid...
            </motion.p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!preview ? (
              <label className="border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all rounded-3xl md:rounded-[2rem] p-8 md:p-16 flex flex-col items-center justify-center cursor-pointer text-center group relative overflow-hidden">
                <UploadCloud className="w-12 h-12 md:w-16 md:h-16 text-[var(--color-glow)] mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                <span className="font-black text-lg md:text-xl text-white mb-1 md:mb-2 uppercase tracking-widest leading-tight">Initialize Uplink</span>
                <span className="text-[10px] md:text-xs text-white/40 max-w-[200px] font-medium italic">Drag and drop civic evidence to begin neural analysis</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 aspect-video bg-black/40">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-6 right-6 bg-white/10 backdrop-blur-md text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  Clear Asset
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!file || loading}
              className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex justify-center items-center gap-3 ${
                !file || loading ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' : 'bg-[var(--color-glow)] text-[var(--color-darkbg)] shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-95'
              }`}
            >
              {loading ? (
                <><Loader2 className="animate-spin w-6 h-6" /> &gt; INITIALIZING_UPLINK...</>
              ) : (
                'SUBMIT EVIDENCE'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Report;
