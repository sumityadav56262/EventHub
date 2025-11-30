import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, MapPin } from 'lucide-react';

const EventCard = ({ event, onSubscribeClub, isSubscribed }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleCardClick = (e) => {
        // Don't navigate if clicking the button
        if (e.target.closest('button')) return;
        navigate(`/student/events/${event.id}`);
    };

    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary cursor-pointer"
            onClick={handleCardClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg text-foreground mb-2 hover:text-primary transition-colors">
                            {event.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                            {event.club?.club_name || 'Unknown Club'}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>{formatDate(event.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{event.venue}</span>
                    </div>
                    {event.description && (
                        <p className="text-muted-foreground line-clamp-2 mt-2">
                            {event.description}
                        </p>
                    )}
                </div>

                {!isSubscribed && onSubscribeClub && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSubscribeClub(event.club_id);
                        }}
                        variant="outline"
                        className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                        Subscribe to Club
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default EventCard;

