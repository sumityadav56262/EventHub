import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/student/events', label: 'Upcoming Events', icon: '📅' },
        { path: '/student/clubs', label: 'All Clubs', icon: '🎭' },
        { path: '/student/my-clubs', label: 'My Clubs', icon: '⭐' },
        { path: '/student/attendance-scan', label: 'Scan QR', icon: '📷' },
        { path: '/student/profile', label: 'Profile', icon: '👤' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Event Hub
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Student Portal</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="lg:ml-0 ml-12">
                    <h1 className="text-xl font-semibold">Welcome back, {user?.name || 'Student'}!</h1>
                    <p className="text-sm text-muted-foreground">Manage your events and clubs</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <span className="hidden md:inline">{user?.name || 'Student'}</span>
                        <span className="text-xs">▼</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-2 z-50">
                            <Link
                                to="/student/profile"
                                className="block px-4 py-2 hover:bg-accent transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-destructive"
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
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
