import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { useState } from 'react';
import BottomNav from './BottomNav';

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { path: '/student/dashboard', label: 'Home', icon: '🏠' },
        { path: '/student/my-clubs', label: 'My Clubs', icon: '⭐' },
        { path: '/student/qr-scanner', label: 'QR Scanner', icon: '📷' },
        { path: '/student/profile', label: 'Profile', icon: '👤' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-secondary text-foreground"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar - Desktop only */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-2xl font-bold text-primary">
                            Event Hub
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Student Portal</p>
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
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="lg:ml-0 ml-12">
                    <h1 className="text-xl font-semibold">Welcome, {user?.name || 'Student'}!</h1>
                    <p className="text-sm text-muted-foreground">Manage your events and clubs</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <span className="hidden md:inline">{user?.name || 'Student'}</span>
                        <span className="text-xs">▼</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                            <Link
                                to="/student/profile"
                                className="block px-4 py-2 hover:bg-secondary transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-destructive"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-background pb-20 lg:pb-0">
                    <Outlet />
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

export default DashboardLayout;
