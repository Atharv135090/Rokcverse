import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { LocateFixed, AlertTriangle, Navigation2, ChevronUp, ChevronDown } from 'lucide-react';
import { API_URL } from '../api/config';

const createPulseMarker = (color: string) => {
// ... existing createPulseMarker ...
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color};" class="svj-pulse w-3 h-3 rounded-full border-2 border-white shadow-lg"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const LocationMarker = () => {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 14, { animate: true, duration: 2 });
    });
  }, [map]);
  return null;
};

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

const MapView = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [center, setCenter] = useState<[number, number]>([18.5204, 73.8567]); // Default to Pune
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/issues`)
      .then(res => {
        setIssues(res.data);
        if (res.data.length > 0) {
           setSelectedIssue(res.data[0]);
        }
      })
      .catch(err => console.error(err));

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
            (_err) => console.log("Location access denied")
        );
    }
  }, []);

  const getPriorityColor = (p: string) => {
    switch(p?.toUpperCase()) {
      case 'HIGH': return '#EF4444';
      case 'MEDIUM': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-[#0b0f1a]"
    >
      {/* Side Info Panel */}
      <motion.div 
        animate={{ height: showSidebar ? '40%' : '60px' }}
        className={`w-full md:w-96 md:h-full backdrop-blur-lg bg-white/5 border-b md:border-b-0 md:border-r border-white/10 z-20 flex flex-col shadow-2xl transition-all duration-300 shrink-0 overflow-hidden`}
      >
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Tactical Grid</h2>
          </div>
          <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden p-2 text-white/40">
            {showSidebar ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col ${showSidebar ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity`}>
            <div className="p-4 border-b border-white/5 overflow-x-auto no-scrollbar flex gap-2">
                {[
                    { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567 },
                    { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
                    { id: 'satara', name: 'Satara', lat: 17.6805, lng: 74.0183 }
                ].map(loc => (
                    <button
                        key={loc.id}
                        onClick={() => setCenter([loc.lat, loc.lng])}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-all rounded-full text-[10px] font-bold text-white/50 border border-white/10 whitespace-nowrap"
                    >
                        {loc.name}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                {issues.map(issue => (
                    <div 
                        key={issue.id}
                        onClick={() => {
                            setSelectedIssue(issue);
                            setCenter([issue.latitude, issue.longitude]);
                        }}
                        className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all border shadow-sm ${
                            selectedIssue?.id === issue.id 
                            ? 'bg-[var(--color-glow)]/20 text-white border-[var(--color-glow)]/50' 
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-white/60'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1 text-[9px] font-black uppercase tracking-widest">
                            <span>SEC-{issue.id}</span>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getPriorityColor(issue.priority), boxShadow: `0 0 8px ${getPriorityColor(issue.priority)}` }}></div>
                        </div>
                        <h4 className="text-xs md:text-sm font-bold truncate mb-0.5 uppercase tracking-tight">{issue.title}</h4>
                        <p className={`text-[9px] md:text-[10px] line-clamp-1 italic ${selectedIssue?.id === issue.id ? 'text-white/60' : 'text-white/40'}`}>{issue.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>

      {/* Map View */}
      <div className="flex-1 relative h-full min-h-[500px] md:min-h-0">
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: '100%', width: '100%', background: '#0b0f1a' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <ChangeView center={center} />
          <LocationMarker />

          {issues.map(issue => (
            issue.latitude && issue.longitude ? (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={createPulseMarker(getPriorityColor(issue.priority))}
              >
                <Popup className="premium-popup">
                  <div className="w-64 p-1 bg-[#0b0f1a] border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={issue.imageUrl} 
                      className="w-full h-32 object-cover rounded-xl mb-3" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80';
                      }}
                    />
                    <div className="px-2 pb-2">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[10px] font-bold uppercase text-white/40 tracking-tighter">{issue.priority} Priority</span>
                      </div>
                      <h4 className="font-bold text-white mb-1">{issue.title}</h4>
                      <p className="text-[10px] text-white/60 italic mb-4 leading-relaxed line-clamp-3">{issue.description}</p>
                      <button 
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`;
                          window.open(url, '_blank');
                        }}
                        className="w-full py-2 bg-[var(--color-glow)] text-black rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[var(--color-glow)]/80 transition-all shadow-xl shadow-[var(--color-glow)]/20"
                      >
                        <Navigation2 className="w-3.5 h-3.5" /> Navigate
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>

        <div className="absolute top-4 right-4 z-[1000]">
          <button 
            onClick={() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude])
                    );
                }
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-[#0b0f1a]/80 text-[var(--color-glow)] rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-md transition-all"
          >
            <LocateFixed className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <style>{`
        .premium-popup .leaflet-popup-content-wrapper {
          background: #0b0f1a;
          color: white;
          border-radius: 1.5rem;
          padding: 0;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .premium-popup .leaflet-popup-tip {
          background: #0b0f1a;
        }
        .premium-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};

export default MapView;
