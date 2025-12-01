import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, QrCode, User } from 'lucide-react';

const ClubBottomNav = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/club/home',
            label: 'Home',
            icon: <Home size={24} />
        },
        {
            path: '/club/events',
            label: 'Events',
            icon: <Calendar size={24} />
        },
        {
            path: '/club/qr-generator',
            label: 'QR Code',
            icon: <QrCode size={24} />
        },
        {
            path: '/club/profile',
            label: 'Profile',
            icon: <User size={24} />
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 lg:hidden bottom-nav-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive(item.path)
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <span className="text-2xl mb-1">{item.icon}</span>
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default ClubBottomNav;
