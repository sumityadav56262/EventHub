import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

const StudentDashboard = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await api.get('/clubs');
                setClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch clubs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleSubscribe = async (clubId) => {
        try {
            await api.post(`/clubs/subscribe/${clubId}`);
            alert('Subscription updated successfully!');
        } catch (error) {
            console.error("Subscription failed", error);
            alert('Failed to update subscription');
        }
    };

    const filteredClubs = clubs.filter(club =>
        club.club_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.club_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-pulse text-primary text-xl">Loading clubs...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Discover Clubs
                    </h1>
                    <p className="text-muted-foreground mt-2">Find and subscribe to clubs that interest you</p>
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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClubs.map((club, index) => (
                    <Card
                        key={club.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in border-2 hover:border-primary"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {club.club_name}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        <Badge variant="outline" className="font-mono">
                                            {club.club_code}
                                        </Badge>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <span className="font-semibold">Faculty:</span>
                                    {club.faculty_incharge}
                                </p>
                            </div>
                            <Button
                                onClick={() => handleSubscribe(club.id)}
                                className="w-full gradient-primary hover:opacity-90 transition-all duration-200"
                            >
                                Subscribe
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredClubs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No clubs found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

