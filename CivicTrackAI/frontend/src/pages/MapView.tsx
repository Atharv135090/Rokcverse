import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { LocateFixed, AlertTriangle, Navigation2 } from 'lucide-react';

const createPulseMarker = (color: string) => {
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

  useEffect(() => {
    // 1. Fetch Issues
    axios.get('http://localhost:8080/api/issues')
      .then(res => {
        setIssues(res.data);
        if (res.data.length > 0) {
           setSelectedIssue(res.data[0]);
        }
      })
      .catch(err => console.error(err));

    // 2. Fetch User GeoLocation Immediately
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
            (err) => console.log("Location access denied or failed, defaulting to Pune")
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
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "anticipate" }}
      className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-[rgba(11,15,26,0.6)]"
    >
      {/* Side Info Panel */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-full md:w-96 h-full backdrop-blur-lg bg-white/5 border-r border-white/10 z-20 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.3)]"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white tracking-tight mb-4">Strategic Zones</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567 },
              { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
              { id: 'satara', name: 'Satara', lat: 17.6805, lng: 74.0183 }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setCenter([loc.lat, loc.lng])}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-all rounded-full text-xs font-bold text-white/80 border border-white/10 shadow-sm whitespace-nowrap"
              >
                {loc.name}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">Active Reports</h2>
          <p className="text-xs text-white/50 font-medium">Click an item to locate on map</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {issues.length === 0 && (
             <div className="text-center p-8 text-white/40 text-sm font-medium">No active reports found.</div>
          )}
          {issues.map(issue => (
            <div 
              key={issue.id}
              onClick={() => {
                setSelectedIssue(issue);
                setCenter([issue.latitude, issue.longitude]);
              }}
              className={`p-4 rounded-2xl cursor-pointer transition-all border shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                selectedIssue?.id === issue.id 
                ? 'bg-[var(--color-glow)]/20 text-white border-[var(--color-glow)]/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-bold uppercase ${selectedIssue?.id === issue.id ? 'text-white/90' : 'text-white/50'}`}>ID #{issue.id}</span>
                <div className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: getPriorityColor(issue.priority) }}></div>
              </div>
              <h4 className="text-sm font-bold truncate mb-1 uppercase tracking-tight">{issue.title}</h4>
              <p className={`text-[10px] line-clamp-1 ${selectedIssue?.id === issue.id ? 'text-white/80' : 'text-white/60'}`}>{issue.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Map View */}
      <div className="flex-1 relative">
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
                  <div className="w-64 p-1 bg-[var(--color-darkbg)] border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)]">
                    <img 
                      src={issue.imageUrl} 
                      className="w-full h-32 object-cover rounded-xl mb-3" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80';
                      }}
                    />
                    <div className="px-2 pb-2">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                        <span className="text-[10px] font-bold uppercase text-white/60 tracking-tighter">{issue.priority} Priority</span>
                      </div>
                      <h4 className="font-bold text-white mb-1">{issue.title}</h4>
                      <p className="text-[10px] text-white/70 italic mb-4 leading-relaxed">{issue.description}</p>
                      <button 
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`;
                          window.open(url, '_blank');
                        }}
                        className="w-full py-2 bg-[var(--color-glow)] text-[var(--color-darkbg)] rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[var(--color-glow)]/80 transition-all shadow-md shadow-[var(--color-glow)]/20"
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

        {/* Tactical Radar Overlay */}
        <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden opacity-30">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-radar rounded-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(249,250,251,0.1)_100%)]" />
        </div>

        <div className="absolute top-6 right-6 z-[1000]">
          <button 
            onClick={() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude])
                    );
                }
            }}
            className="w-12 h-12 bg-white/10 text-[var(--color-glow)] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
          >
            <LocateFixed className="w-6 h-6" />
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
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
};

export default MapView;
