import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Loader2,
    Trash2,
    Calendar,
    MapPin,
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = async () => {
        try {
            const response = await api.get('/admin/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId, eventTitle) => {
        if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;

        setDeleting(eventId);
        try {
            await api.delete(`/admin/events/${eventId}`);
            toast.success('Event deleted successfully');
            fetchAllEvents(); // Refresh list
        } catch (error) {
            console.error('Failed to delete event', error);
            toast.error('Failed to delete event');
        } finally {
            setDeleting(null);
        }
    };

    const formatDateTime = (dateString) => {
        const cleanDate = dateString.replace('Z', '').replace('.000000', '');
        const date = new Date(cleanDate);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">All Events</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all events ({events.length} total)
                </p>
            </div>

            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{event.venue}</span>
                                    </div>
                                    {event.club && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                                                {event.club.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(event.id, event.title)}
                                disabled={deleting === event.id}
                                className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting === event.id ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Trash2 size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Events created by clubs will appear here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllEvents;
