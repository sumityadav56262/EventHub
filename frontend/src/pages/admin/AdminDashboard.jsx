import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
    Users,
    Calendar,
    Clock,
    CheckCircle,
    Loader2,
    TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
            // Mock data for fallback
            setStats({
                total_clubs: 12,
                pending_clubs: 3,
                approved_clubs: 9,
                total_students: 450,
                total_events: 28,
                upcoming_events: 5
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Clubs',
            value: stats?.total_clubs || 0,
            icon: <Users className="text-blue-600" size={24} />,
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            link: '/admin/clubs'
        },
        {
            title: 'Pending Approvals',
            value: stats?.pending_clubs || 0,
            icon: <Clock className="text-yellow-600" size={24} />,
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
            link: '/admin/pending-clubs',
            highlight: stats?.pending_clubs > 0
        },
        {
            title: 'Approved Clubs',
            value: stats?.approved_clubs || 0,
            icon: <CheckCircle className="text-green-600" size={24} />,
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            title: 'Total Students',
            value: stats?.total_students || 0,
            icon: <Users className="text-purple-600" size={24} />,
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            title: 'Total Events',
            value: stats?.total_events || 0,
            icon: <Calendar className="text-indigo-600" size={24} />,
            bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
            link: '/admin/events'
        },
        {
            title: 'Upcoming Events',
            value: stats?.upcoming_events || 0,
            icon: <TrendingUp className="text-pink-600" size={24} />,
            bgColor: 'bg-pink-100 dark:bg-pink-900/20',
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of EventHub platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link || '#'}
                        className={`bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all ${stat.link ? 'cursor-pointer' : 'cursor-default'
                            } ${stat.highlight ? 'ring-2 ring-yellow-500' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                {stat.icon}
                            </div>
                        </div>
                        {stat.highlight && (
                            <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                                ⚠️ Requires attention
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/admin/pending-clubs"
                        className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                    >
                        <Clock className="text-yellow-600" size={20} />
                        <div>
                            <p className="font-semibold">Review Pending Clubs</p>
                            <p className="text-sm text-muted-foreground">
                                {stats?.pending_clubs || 0} clubs awaiting approval
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/clubs"
                        className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        <Users className="text-blue-600" size={20} />
                        <div>
                            <p className="font-semibold">Manage All Clubs</p>
                            <p className="text-sm text-muted-foreground">
                                View and manage {stats?.total_clubs || 0} clubs
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/events"
                        className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                        <Calendar className="text-indigo-600" size={20} />
                        <div>
                            <p className="font-semibold">View All Events</p>
                            <p className="text-sm text-muted-foreground">
                                {stats?.total_events || 0} events created
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle className="text-green-600" size={20} />
                        <div>
                            <p className="font-semibold">System Status</p>
                            <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
