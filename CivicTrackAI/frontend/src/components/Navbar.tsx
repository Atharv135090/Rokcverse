import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map as MapIcon, PlusCircle, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', label: 'CivicTrack AI', isBrand: true },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/map', label: 'Map View', icon: MapIcon },
    ];

    const authItems = user ? [
        { path: '/profile', label: user.name, icon: Shield, isUser: true },
        { onClick: logout, label: 'Logout', icon: LogOut }
    ] : [
        { path: '/login', label: 'Login', icon: LogIn },
        { path: '/register', label: 'Register', icon: UserPlus },
    ];

    return (
        <nav className="sticky top-0 z-[100] px-6 py-4">
            <div className="max-w-7xl mx-auto glass rounded-full px-8 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10">
                <div className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path!} 
                            className={`flex items-center gap-2 transition-all hover:scale-105 ${
                                item.isBrand 
                                ? 'text-2xl font-black tracking-tighter neon-text' 
                                : `text-sm font-bold ${location.pathname === item.path ? 'text-[var(--color-glow)]' : 'text-white/60 hover:text-white'}`
                            }`}
                        >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    {authItems.map((item, idx) => (
                        item.path ? (
                            <Link 
                                key={idx} 
                                to={item.path} 
                                className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold border border-white/10 transition-all flex items-center gap-2"
                            >
                                <item.icon className="w-4 h-4 text-[var(--color-glow)]" />
                                {item.label}
                            </Link>
                        ) : (
                            <button 
                                key={idx} 
                                onClick={item.onClick}
                                className={`flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-full ${item.isUser ? 'bg-[var(--color-glow)]/10 text-[var(--color-glow)]' : 'text-white/60 hover:text-danger'}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        )
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
