import { useStudent } from '../../context/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const StudentDashboardHome = () => {
    const { subscriptions, upcomingEvents, fetchSubscriptions, fetchUpcomingEvents } = useStudent();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchSubscriptions(), fetchUpcomingEvents()]);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-pulse text-primary text-xl">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Subscribed Clubs',
            value: subscriptions.length,
            icon: '🎭',
            link: '/student/my-clubs',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Upcoming Events',
            value: upcomingEvents.length,
            icon: '📅',
            link: '/student/events',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Quick Scan',
            value: 'QR',
            icon: '📷',
            link: '/student/attendance-scan',
            gradient: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">Welcome to your student portal</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Link
                        key={stat.title}
                        to={stat.link}
                        className="group"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`text-4xl bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold group-hover:text-primary transition-colors">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Events */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                    <Link to="/student/events" className="text-primary hover:underline">
                        View All →
                    </Link>
                </div>

                {upcomingEvents.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No upcoming events</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingEvents.slice(0, 4).map((event) => (
                            <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                    <div className="mt-2">
                                        <Badge variant="outline">
                                            {event.club?.club_name || 'Unknown Club'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <span>📅</span>
                                        {new Date(event.start_time).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span>📍</span>
                                        {event.venue}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* My Clubs */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">My Clubs</h2>
                    <Link to="/student/my-clubs" className="text-primary hover:underline">
                        View All →
                    </Link>
                </div>

                {subscriptions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">You haven't subscribed to any clubs yet</p>
                            <Link to="/student/clubs" className="text-primary hover:underline mt-2 inline-block">
                                Browse Clubs →
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {subscriptions.slice(0, 3).map((sub) => (
                            <Card key={sub.club.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{sub.club.club_name}</CardTitle>
                                    <div className="mt-2">
                                        <Badge variant="outline">{sub.club.club_code}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>Faculty: {sub.club.faculty_incharge}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboardHome;
