import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventDetails } from '../../api/events';
import { subscribeToClub } from '../../api/clubs';
import { useStudent } from '../../context/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Clock, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { isSubscribed, fetchSubscriptions } = useStudent();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
        loadEventData();
    }, [eventId]);

    const loadEventData = async () => {
        try {
            setLoading(true);
            const eventData = await getEventDetails(eventId);
            setEvent(eventData);
            await fetchSubscriptions();
        } catch (error) {
            console.error('Failed to load event data:', error);
            toast.error('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribeToClub = async () => {
        if (!event?.club_id) return;
        try {
            setSubscribing(true);
            await subscribeToClub(event.club_id);
            const wasSubscribed = isSubscribed(event.club_id);
            toast.success(wasSubscribed ? 'Unsubscribed from club!' : 'Subscribed to club!');
            await fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to update subscription');
            console.error(error);
        } finally {
            setSubscribing(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);

        if (diffHrs > 0) {
            return `${diffHrs}h ${diffMins}m`;
        }
        return `${diffMins}m`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-primary text-xl">Loading event...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">Event not found</p>
                <Button onClick={() => navigate('/student/dashboard')} className="mt-4">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const startDateTime = formatDateTime(event.start_time);
    const endDateTime = formatDateTime(event.end_time);
    const duration = calculateDuration(event.start_time, event.end_time);
    const subscribed = isSubscribed(event.club_id);

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-2"
            >
                <ArrowLeft size={20} />
                Back
            </Button>

            {/* Event Header */}
            <Card className="shadow-2xl border-2">
                <CardHeader className="space-y-4">
                    <div>
                        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            {event.title}
                        </CardTitle>

                        {/* Organizer - Clickable */}
                        <div className="flex items-center gap-2">
                            <Building2 size={20} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Organized by</span>
                            <Link
                                to={`/student/clubs/${event.club_id}`}
                                className="font-semibold text-primary hover:underline transition-colors"
                            >
                                {event.club?.club_name || 'Unknown Club'}
                            </Link>
                        </div>
                    </div>

                    {!subscribed && (
                        <Button
                            onClick={handleSubscribeToClub}
                            disabled={subscribing}
                            className="gradient-primary hover:opacity-90 w-full md:w-auto"
                        >
                            {subscribing ? 'Processing...' : 'Subscribe to Club'}
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Description */}
                    {event.description && (
                        <div>
                            <h3 className="font-semibold text-lg mb-2">About This Event</h3>
                            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>
                    )}

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <Card className="bg-secondary/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <MapPin size={24} className="text-primary mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Location</h4>
                                        <p className="text-muted-foreground">{event.venue}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Date & Time */}
                        <Card className="bg-secondary/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Calendar size={24} className="text-primary mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Date & Time</h4>
                                        <p className="text-muted-foreground">{startDateTime.date}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {startDateTime.time} - {endDateTime.time}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Duration */}
                        <Card className="bg-secondary/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Clock size={24} className="text-primary mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Duration</h4>
                                        <p className="text-muted-foreground">{duration}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card className="bg-secondary/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Badge variant={subscribed ? "default" : "outline"} className="text-base px-3 py-1">
                                            {subscribed ? "Subscribed" : "Not Subscribed"}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Your Status</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {subscribed ? "You're subscribed to this club" : "Subscribe to get updates"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventDetailPage;
