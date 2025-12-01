import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/club/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/club/create-event', label: 'Create Event', icon: <Calendar size={20} /> },
        { path: '/club/events', label: 'All Events', icon: <Users size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-600">
                                Event Hub
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Club Portal</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            © 2024 Event Hub
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-700 hover:text-gray-900"
                    >
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Welcome back, <span className="text-indigo-600">{user?.name || 'Club'}</span>
                        </h1>
                        <p className="text-sm text-gray-500">Manage your events and attendees</p>
                    </div>
                </div>

                {/* Right Section - User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user?.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-gray-900">{user?.name || 'Club'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'club@example.com'}</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'Club'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email || 'club@example.com'}</p>
                                </div>
                                <Link
                                    to="/club/settings"
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <Settings size={16} />
                                    <span className="text-sm">Settings</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowDropdown(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                                >
                                    <LogOut size={16} />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

const ClubDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ClubDashboardLayout;
