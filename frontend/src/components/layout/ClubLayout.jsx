import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import ClubBottomNav from '../club/ClubBottomNav';
import {
    Home,
    Calendar,
    QrCode,
    User,
    ChevronDown,
    LogOut,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/club/home', label: 'Home', icon: <Home size={24} /> },
        { path: '/club/events', label: 'Events', icon: <Calendar size={24} /> },
        { path: '/club/qr-generator', label: 'QR Generator', icon: <QrCode size={24} /> },
        { path: '/club/profile', label: 'Profile', icon: <User size={24} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Sidebar - Desktop only */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-2xl font-bold text-primary">
                            Event Hub
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Club Portal</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-secondary'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-card border-b border-border px-4 lg:px-6 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Left Section - Logo (visible on mobile) */}
                <div className="lg:hidden">
                    <h1 className="text-xl font-bold">
                        <span className="text-primary">Event</span>Hub
                    </h1>
                    <p className="text-xs text-muted-foreground">Club Portal</p>
                </div>

                {/* Desktop - Page Title */}
                <div className="hidden lg:block">
                    <h1 className="text-xl font-semibold">
                        Welcome back, <span className="text-primary">{user?.name || 'Club'}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">Manage your events and attendees</p>
                </div>

                {/* Right Section - User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold">{user?.name || 'Club'}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {user?.email || 'club@example.com'}
                            </p>
                        </div>
                        <ChevronDown size={16} className="text-muted-foreground" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="text-sm font-semibold">{user?.name || 'Club'}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email || 'club@example.com'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate('/club/profile');
                                        setShowDropdown(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors text-sm"
                                >
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowDropdown(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-destructive/10 transition-colors text-destructive text-sm"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

const ClubLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                <Navbar />
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                    <Outlet />
                </main>
                <ClubBottomNav />
            </div>
        </div>
    );
};

export default ClubLayout;

