import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClubDetails, getClubEvents, subscribeToClub } from '../../api/clubs';
import { useStudent } from '../../context/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const { isSubscribed, fetchSubscriptions } = useStudent();
    const [club, setClub] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;

    useEffect(() => {
        loadClubData();
    }, [clubId]);

    const loadClubData = async () => {
        try {
            setLoading(true);
            const [clubData, eventsData] = await Promise.all([
                getClubDetails(clubId),
                getClubEvents(clubId),
                fetchSubscriptions()
            ]);
            setClub(clubData);
            setEvents(eventsData);
        } catch (error) {
            console.error('Failed to load club data:', error);
            toast.error('Failed to load club details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            setSubscribing(true);
            await subscribeToClub(clubId);
            const wasSubscribed = isSubscribed(parseInt(clubId));
            toast.success(wasSubscribed ? 'Unsubscribed successfully!' : 'Subscribed successfully!');
            await fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to update subscription');
            console.error(error);
        } finally {
            setSubscribing(false);
        }
    };

    // Pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-primary text-xl">Loading club...</div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">Club not found</p>
                <Button onClick={() => navigate('/student/dashboard')} className="mt-4">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const subscribed = isSubscribed(parseInt(clubId));

    return (
        <div className="p-6 space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate('/student/dashboard')}
                className="gap-2"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </Button>

            {/* Club Header */}
            <Card className="shadow-xl border-2">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {club.club_name}
                            </CardTitle>
                            <Badge variant="outline" className="mt-3 font-mono text-base">
                                {club.club_code}
                            </Badge>
                        </div>
                        <Button
                            onClick={handleSubscribe}
                            disabled={subscribing}
                            className={`${subscribed
                                    ? 'bg-destructive hover:bg-destructive/90'
                                    : 'gradient-primary hover:opacity-90'
                                } transition-all duration-200`}
                        >
                            {subscribing ? 'Processing...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={20} />
                        <span className="font-semibold">Faculty In-charge:</span>
                        <span>{club.faculty_incharge}</span>
                    </div>
                    {club.club_email && (
                        <div className="text-muted-foreground">
                            <span className="font-semibold">Email:</span> {club.club_email}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Events Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Events ({events.length})</h2>
                {currentEvents.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No events available for this club.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {currentEvents.map((event) => (
                                <Card
                                    key={event.id}
                                    className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary"
                                    onClick={() => navigate(`/student/events/${event.id}`)}
                                >
                                    <CardHeader>
                                        <CardTitle className="group-hover:text-primary transition-colors">
                                            {event.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {event.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin size={16} />
                                            <span>{event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar size={16} />
                                            <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClubDetailPage;
