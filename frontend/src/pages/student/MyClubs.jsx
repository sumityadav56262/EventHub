import { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { getClubEvents } from '../../api/events';
import { getEventAttendance } from '../../api/attendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import toast from 'react-hot-toast';

const MyClubs = () => {
    const { subscriptions, fetchSubscriptions } = useStudent();
    const [loading, setLoading] = useState(true);
    const [clubsWithEvents, setClubsWithEvents] = useState([]);
    const [expandedClubId, setExpandedClubId] = useState(null);

    useEffect(() => {
        loadMyClubs();
    }, []);

    const loadMyClubs = async () => {
        setLoading(true);
        await fetchSubscriptions();
        setLoading(false);
    };

    const loadClubEvents = async (clubId) => {
        try {
            const events = await getClubEvents(clubId);

            // Load attendance status for each event
            const eventsWithAttendance = await Promise.all(
                events.map(async (event) => {
                    try {
                        const attendance = await getEventAttendance(event.id);
                        return { ...event, attendance };
                    } catch {
                        return { ...event, attendance: null };
                    }
                })
            );

            setClubsWithEvents(prev => ({
                ...prev,
                [clubId]: eventsWithAttendance
            }));
        } catch (error) {
            toast.error('Failed to load club events');
            console.error(error);
        }
    };

    const toggleClub = async (clubId) => {
        if (expandedClubId === clubId) {
            setExpandedClubId(null);
        } else {
            setExpandedClubId(clubId);
            if (!clubsWithEvents[clubId]) {
                await loadClubEvents(clubId);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAttendanceStatus = (event) => {
        if (!event.attendance) return 'unknown';
        return event.attendance.status === 'present' ? 'present' : 'absent';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-pulse text-primary text-xl">Loading your clubs...</div>
                </div>
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    My Clubs
                </h1>
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">You haven't subscribed to any clubs yet.</p>
                    <p className="text-muted-foreground mt-2">Visit the "All Clubs" page to subscribe!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Clubs
                </h1>
                <p className="text-muted-foreground mt-2">View events and attendance from your subscribed clubs</p>
            </div>

            <div className="space-y-4">
                {subscriptions.map((subscription) => {
                    const club = subscription.club;
                    const isExpanded = expandedClubId === club.id;
                    const events = clubsWithEvents[club.id] || [];

                    return (
                        <Card key={club.id} className="overflow-hidden">
                            <CardHeader
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => toggleClub(club.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{club.club_name}</CardTitle>
                                        <CardDescription className="mt-2">
                                            <Badge variant="outline">{club.club_code}</Badge>
                                        </CardDescription>
                                    </div>
                                    <span className="text-2xl transition-transform duration-200" style={{
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ▼
                                    </span>
                                </div>
                            </CardHeader>

                            {isExpanded && (
                                <CardContent className="pt-4 border-t">
                                    {events.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">
                                            No events for this club yet.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {events.map((event) => {
                                                const status = getAttendanceStatus(event);
                                                return (
                                                    <div
                                                        key={event.id}
                                                        className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">{event.title}</h3>
                                                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                                    <p className="flex items-center gap-2">
                                                                        <span>📅</span>
                                                                        {formatDate(event.start_time)}
                                                                    </p>
                                                                    <p className="flex items-center gap-2">
                                                                        <span>📍</span>
                                                                        {event.venue}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {status === 'present' && (
                                                                    <Badge variant="success">Present</Badge>
                                                                )}
                                                                {status === 'absent' && (
                                                                    <Badge variant="destructive">Absent</Badge>
                                                                )}
                                                                {status === 'unknown' && (
                                                                    <Badge variant="outline">Not Marked</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MyClubs;
