import { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { getClubEvents } from '../../api/events';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import toast from 'react-hot-toast';

const MyClubs = () => {
    const { subscriptions, fetchSubscriptions } = useStudent();
    const [loading, setLoading] = useState(true);
    const [clubEvents, setClubEvents] = useState({});

    useEffect(() => {
        loadMyClubs();
    }, []);

    const loadMyClubs = async () => {
        setLoading(true);
        await fetchSubscriptions();
        setLoading(false);
    };

    useEffect(() => {
        // Load events for each subscribed club
        subscriptions.forEach(async (sub) => {
            try {
                const events = await getClubEvents(sub.club.id);
                setClubEvents(prev => ({
                    ...prev,
                    [sub.club.id]: events
                }));
            } catch (error) {
                console.error('Failed to load club events:', error);
            }
        });
    }, [subscriptions]);

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
            <div className="p-4 md:p-6">
                <h1 className="text-3xl font-bold text-foreground mb-6">
                    My Clubs
                </h1>
                <Card className="border-border">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground text-lg">You haven't subscribed to any clubs yet.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    My Clubs
                </h1>
                <p className="text-muted-foreground mt-1">Events from your subscribed clubs</p>
            </div>

            <div className="space-y-6">
                {subscriptions.map((subscription) => {
                    const club = subscription.club;
                    const events = clubEvents[club.id] || [];

                    return (
                        <div key={club.id} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-foreground">{club.club_name}</h2>
                                <Badge variant="outline">{club.club_code}</Badge>
                            </div>

                            {events.length === 0 ? (
                                <Card className="border-border">
                                    <CardContent className="py-8 text-center">
                                        <p className="text-muted-foreground">
                                            No events for this club yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {events.map((event) => (
                                        <Card key={event.id} className="border-border hover:bg-secondary/50 transition-colors">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg text-foreground">
                                                    {event.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2 pt-0">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>📅</span>
                                                    <span>{formatDate(event.start_time)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>📍</span>
                                                    <span>{event.venue}</span>
                                                </div>
                                                {event.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyClubs;
