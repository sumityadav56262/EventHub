import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar,
    Users,
    TrendingUp,
    Clock,
    MapPin,
    ArrowRight
} from 'lucide-react';

const ClubHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEvents: 0,
        upcomingEvents: 0,
        totalAttendees: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/events/club/${user?.id}`);
                const events = response.data;
                setRecentEvents(events.slice(0, 3));

                const now = new Date();
                const upcoming = events.filter(e => new Date(e.start_time) > now);

                setStats({
                    totalEvents: events.length,
                    upcomingEvents: upcoming.length,
                    totalAttendees: events.reduce((sum, e) => sum + (e.attendees_count || 0), 0)
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
                // Mock data
                setRecentEvents([
                    { id: 1, title: 'Hackathon 2024', start_time: '2024-12-01 10:00:00', venue: 'Auditorium' },
                    { id: 2, title: 'Tech Talk', start_time: '2024-12-05 14:00:00', venue: 'Hall A' },
                ]);
                setStats({ totalEvents: 5, upcomingEvents: 2, totalAttendees: 150 });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Club'}!</h1>
                <p className="text-indigo-100">Manage your events and track attendance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Calendar className="text-primary" size={20} />
                    </div>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="text-blue-500" size={20} />
                    </div>
                    <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="text-green-500" size={20} />
                    </div>
                    <p className="text-2xl font-bold">{stats.totalAttendees}</p>
                    <p className="text-xs text-muted-foreground">Attendees</p>
                </div>
            </div>

            {/* Recent Events */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Recent Events</h2>
                    <Link to="/club/events" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentEvents.length === 0 ? (
                        <div className="bg-card border border-border rounded-lg p-8 text-center">
                            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No events yet</p>
                            <Link
                                to="/club/create-event"
                                className="inline-block mt-3 text-sm text-primary hover:underline"
                            >
                                Create your first event
                            </Link>
                        </div>
                    ) : (
                        recentEvents.map((event) => (
                            <Link
                                key={event.id}
                                to={`/club/events/${event.id}`}
                                className="block bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <h3 className="font-semibold mb-2">{event.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(event.start_time)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {formatTime(event.start_time)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {event.venue}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <Link
                    to="/club/create-event"
                    className="bg-primary text-primary-foreground rounded-lg p-4 text-center hover:opacity-90 transition-opacity"
                >
                    <Calendar className="mx-auto mb-2" size={24} />
                    <p className="text-sm font-medium">Create Event</p>
                </Link>
                <Link
                    to="/club/qr-generator"
                    className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                    <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
                    <p className="text-sm font-medium">QR Generator</p>
                </Link>
            </div>
        </div>
    );
};

export default ClubHome;
