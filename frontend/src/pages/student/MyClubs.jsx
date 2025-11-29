import { useState, useEffect } from 'react';
import api from '../../api/axios';

const MyClubs = () => {
    const [subscribedClubs, setSubscribedClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribedClubs = async () => {
            try {
                const response = await api.get('/clubs/subscribed'); // Assuming this endpoint exists
                setSubscribedClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch subscribed clubs", error);
                // Mock data
                setSubscribedClubs([
                    { id: 1, club_name: 'Coding Club', events: [{ id: 1, title: 'Hackathon 2024', start_time: '2024-12-01 10:00:00' }] }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribedClubs();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Clubs</h1>
            {subscribedClubs.length === 0 ? (
                <p>You haven't subscribed to any clubs yet.</p>
            ) : (
                <div className="space-y-4">
                    {subscribedClubs.map((club) => (
                        <div key={club.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">{club.club_name}</h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Upcoming Events</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {club.events && club.events.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {club.events.map(event => (
                                                        <li key={event.id}>{event.title} - {event.start_time}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No upcoming events.</p>
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyClubs;
