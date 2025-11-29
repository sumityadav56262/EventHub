import { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { subscribeToClub } from '../../api/clubs';
import EventCard from '../../components/student/EventCard';
import { Input } from '../../components/ui/input';
import toast from 'react-hot-toast';

const UpcomingEvents = () => {
    const { upcomingEvents, fetchUpcomingEvents, isSubscribed, fetchSubscriptions } = useStudent();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        await fetchUpcomingEvents();
        await fetchSubscriptions();
        setLoading(false);
    };

    const handleSubscribeClub = async (clubId) => {
        try {
            await subscribeToClub(clubId);
            toast.success('Subscribed to club successfully!');
            await fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to subscribe to club');
            console.error(error);
        }
    };

    const filteredEvents = upcomingEvents.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.club?.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-pulse text-primary text-xl">Loading events...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Upcoming Events
                    </h1>
                    <p className="text-muted-foreground mt-2">Discover events happening soon</p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        {searchTerm ? 'No events found matching your search.' : 'No upcoming events at the moment.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event, index) => (
                        <div key={event.id} style={{ animationDelay: `${index * 50}ms` }}>
                            <EventCard
                                event={event}
                                onSubscribeClub={handleSubscribeClub}
                                isSubscribed={isSubscribed(event.club_id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
