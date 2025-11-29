import { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { subscribeToClub } from '../../api/clubs';
import ClubCard from '../../components/student/ClubCard';
import { Input } from '../../components/ui/input';
import toast from 'react-hot-toast';

const ClubList = () => {
    const { allClubs, fetchAllClubs, isSubscribed, fetchSubscriptions } = useStudent();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [subscribingClubId, setSubscribingClubId] = useState(null);

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async () => {
        setLoading(true);
        await Promise.all([fetchAllClubs(), fetchSubscriptions()]);
        setLoading(false);
    };

    const handleSubscribe = async (clubId) => {
        try {
            setSubscribingClubId(clubId);
            await subscribeToClub(clubId);
            const wasSubscribed = isSubscribed(clubId);
            toast.success(wasSubscribed ? 'Unsubscribed successfully!' : 'Subscribed successfully!');
            await fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to update subscription');
            console.error(error);
        } finally {
            setSubscribingClubId(null);
        }
    };

    const filteredClubs = allClubs.filter(club =>
        club.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.club_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.faculty_incharge?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-pulse text-primary text-xl">Loading clubs...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        All Clubs
                    </h1>
                    <p className="text-muted-foreground mt-2">Explore and join clubs</p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {filteredClubs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        {searchTerm ? 'No clubs found matching your search.' : 'No clubs available.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredClubs.map((club, index) => (
                        <div key={club.id} style={{ animationDelay: `${index * 50}ms` }}>
                            <ClubCard
                                club={club}
                                onSubscribe={handleSubscribe}
                                isSubscribed={isSubscribed(club.id)}
                                loading={subscribingClubId === club.id}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClubList;
