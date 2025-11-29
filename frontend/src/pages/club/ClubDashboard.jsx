import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ClubDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Assuming user object has club_id or we fetch by current user context
                const response = await api.get(`/events/club/${user?.id}`);
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
                // Mock data
                setEvents([
                    { id: 1, title: 'Hackathon 2024', start_time: '2024-12-01 10:00:00', venue: 'Auditorium' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchEvents();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Club Dashboard</h1>
                <Link
                    to="/club/create-event"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Event
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {events.map((event) => (
                        <li key={event.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{event.title}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {event.venue}
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            {event.start_time}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <Link to={`/club/events/${event.id}/qr`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            View QR
                                        </Link>
                                        <Link to={`/club/events/${event.id}/attendance`} className="text-indigo-600 hover:text-indigo-900">
                                            View Attendance
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClubDashboard;
