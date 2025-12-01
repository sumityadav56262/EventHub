import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar,
    MapPin,
    Clock,
    QrCode,
    Users,
    Plus,
    Loader2,
    AlertCircle
} from 'lucide-react';

const ClubDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Assuming user object has club_id or we fetch by current user context
                const response = await api.get(`/events/club/${user?.id}`);
                setEvents(response.data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setError("Failed to load events. Showing sample data.");
                // Mock data
                setEvents([
                    {
                        id: 1,
                        title: 'Hackathon 2024',
                        start_time: '2024-12-01 10:00:00',
                        end_time: '2024-12-01 18:00:00',
                        venue: 'Main Auditorium',
                        description: 'Annual coding hackathon event'
                    },
                    {
                        id: 2,
                        title: 'Tech Talk: AI & ML',
                        start_time: '2024-12-05 14:00:00',
                        end_time: '2024-12-05 16:00:00',
                        venue: 'Conference Hall',
                        description: 'Expert talk on AI and Machine Learning'
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
        const date = new Date(dateString);
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
            return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
        } else if (now >= start && now <= end) {
            return { label: 'Live', color: 'bg-green-100 text-green-800' };
        } else {
            return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Events</h1>
                    <p className="text-gray-500 mt-1">Manage and track all your club events</p>
                </div>
                <Link
                    to="/club/create-event"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg"
                >
                    <Plus size={20} />
                    Create Event
                </Link>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-yellow-800">{error}</p>
                </div>
            )}

            {/* Events Grid */}
            {events.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first event</p>
                    <Link
                        to="/club/create-event"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} />
                        Create Event
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {events.map((event) => {
                        const status = getEventStatus(event.start_time, event.end_time);
                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                {/* Event Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 flex-1">
                                            {event.title}
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    {event.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}
                                </div>

                                {/* Event Details */}
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar className="text-indigo-600 flex-shrink-0" size={18} />
                                        <span className="text-sm font-medium">
                                            {formatDate(event.start_time)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Clock className="text-indigo-600 flex-shrink-0" size={18} />
                                        <span className="text-sm">
                                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin className="text-indigo-600 flex-shrink-0" size={18} />
                                        <span className="text-sm">{event.venue}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                    <Link
                                        to={`/club/events/${event.id}/qr`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <QrCode size={18} />
                                        <span className="text-sm">QR Code</span>
                                    </Link>
                                    <Link
                                        to={`/club/events/${event.id}/attendance`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Users size={18} />
                                        <span className="text-sm">Attendance</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClubDashboard;
