import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">Event Hub</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">Welcome, {user.name} ({user.role})</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-red-600 hover:text-red-500"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Login</Link>
                                    <Link to="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
