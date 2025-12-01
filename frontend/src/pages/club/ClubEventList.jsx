import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    Loader2,
    Plus
} from 'lucide-react';

const ClubEventList = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get(`/events/club/${user?.id}`);
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
                // Mock data
                setEvents([
                    {
                        id: 1,
                        title: 'Hackathon 2024',
                        start_time: '2024-12-01 10:00:00',
                        end_time: '2024-12-01 18:00:00',
                        venue: 'Main Auditorium',
                        attendees_count: 45
                    },
                    {
                        id: 2,
                        title: 'Tech Talk: AI & ML',
                        start_time: '2024-12-05 14:00:00',
                        end_time: '2024-12-05 16:00:00',
                        venue: 'Conference Hall',
                        attendees_count: 30
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchEvents();
        }
    }, [user]);

    const formatDate = (dateString) => {
        // Remove 'Z' and parse as local time instead of UTC
        const cleanDate = dateString.replace('Z', '').replace('.000000', '');
        const date = new Date(cleanDate);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        // Remove 'Z' and parse as local time instead of UTC
        const cleanDate = dateString.replace('Z', '').replace('.000000', '');
        const date = new Date(cleanDate);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getEventStatus = (startTime, endTime) => {
        const now = new Date();
        // Remove 'Z' and parse as local time instead of UTC
        const cleanStart = startTime.replace('Z', '').replace('.000000', '');
        const cleanEnd = endTime.replace('Z', '').replace('.000000', '');
        const start = new Date(cleanStart);
        const end = new Date(cleanEnd);

        if (now < start) {
            return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
        } else if (now >= start && now <= end) {
            return { label: 'Live', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
        } else {
            return { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Events</h1>
                <Link
                    to="/club/create-event"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    <span className="text-sm font-medium">Create</span>
                </Link>
            </div>

            {/* Events List */}
            {events.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Get started by creating your first event</p>
                    <Link
                        to="/club/create-event"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus size={20} />
                        Create Event
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {events.map((event) => {
                        const status = getEventStatus(event.start_time, event.end_time);
                        return (
                            <Link
                                key={event.id}
                                to={`/club/events/${event.id}`}
                                className="block bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all"
                            >
                                {/* Event Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold flex-1 pr-2">{event.title}</h3>
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Event Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{formatDate(event.start_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock size={16} className="text-primary" />
                                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users size={16} className="text-primary" />
                                        <span>{event.attendees_count || 0} attendees</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClubEventList;
