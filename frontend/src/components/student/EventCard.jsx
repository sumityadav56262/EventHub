import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const EventCard = ({ event, onSubscribeClub, isSubscribed }) => {
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

    return (
        <Card className="hover:bg-secondary/50 transition-all duration-200 border-border">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg text-foreground mb-2">
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
                        <span>📅</span>
                        <span>{formatDate(event.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📍</span>
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
                        onClick={() => onSubscribeClub(event.club_id)}
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
