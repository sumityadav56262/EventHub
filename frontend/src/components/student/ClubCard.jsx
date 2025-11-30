import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const ClubCard = ({ club, onSubscribe, isSubscribed, loading }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // Don't navigate if clicking the button
        if (e.target.closest('button')) return;
        navigate(`/student/clubs/${club.id}`);
    };

    return (
        <Card
            className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary cursor-pointer"
            onClick={handleCardClick}
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
                    {club.club_email && (
                        <p className="flex items-center gap-2 mt-1">
                            <span className="font-semibold">Email:</span>
                            {club.club_email}
                        </p>
                    )}
                </div>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSubscribe(club.id);
                    }}
                    className={`w-full transition-all duration-200 ${isSubscribed
                        ? 'bg-destructive hover:bg-destructive/90'
                        : 'gradient-primary hover:opacity-90'
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ClubCard;

