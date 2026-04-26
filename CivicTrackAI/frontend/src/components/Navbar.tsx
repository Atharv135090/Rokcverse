import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();

    const navItems = [
        { path: '/', label: 'CivicTrack AI', isBrand: true },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/map', label: 'Map View', icon: MapIcon },
    ];

    if (isAdmin) {
        navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
    }

    const authItems = user ? [
        { path: '/profile', label: user.name, icon: Shield, isUser: true },
        { onClick: logout, label: 'Logout', icon: LogOut, isUser: false }
    ] : [
        { path: '/login', label: 'Login', icon: LogIn, isUser: false },
        { path: '/register', label: 'Register', icon: UserPlus, isUser: false },
    ];

    return (
        <nav className="sticky top-0 z-[100] px-3 md:px-6 py-2 md:py-4">
            <div className="max-w-7xl mx-auto glass rounded-full px-4 md:px-8 py-2 md:py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10">
                <div className="flex items-center gap-4 md:gap-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`flex items-center gap-2 transition-all hover:scale-105 ${
                                item.isBrand 
                                ? 'text-xl md:text-2xl font-black tracking-tighter neon-text whitespace-nowrap' 
                                : `text-xs md:text-sm font-bold ${location.pathname === item.path ? 'text-[var(--color-glow)]' : 'text-white/60 hover:text-white'}`
                            }`}
                        >
                            {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                            <span className={item.isBrand ? 'block' : 'hidden sm:block'}>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    {authItems.map((item: any, idx) => (
                        item.path ? (
                            <Link 
                                key={idx} 
                                to={item.path} 
                                className="px-3 md:px-5 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 rounded-full text-[10px] md:text-sm font-bold border border-white/10 transition-all flex items-center gap-2"
                            >
                                <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--color-glow)] shrink-0" />
                                <span className="hidden xs:block">{item.label}</span>
                            </Link>
                        ) : (
                            <button 
                                key={idx} 
                                onClick={item.onClick}
                                className={`flex items-center gap-2 text-[10px] md:text-sm font-bold transition-all px-3 md:px-4 py-1.5 md:py-2 rounded-full ${item.isUser ? 'bg-[var(--color-glow)]/10 text-[var(--color-glow)]' : 'text-white/60 hover:text-danger'}`}
                            >
                                <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                                <span className="hidden xs:block">{item.label}</span>
                            </button>
                        )
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
