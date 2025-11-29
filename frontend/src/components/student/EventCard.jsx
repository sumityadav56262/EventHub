import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {event.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            <Badge variant="outline" className="font-mono">
                                {event.club?.club_name || 'Unknown Club'}
                            </Badge>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
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
                        className="w-full mt-4"
                    >
                        Subscribe to Club
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default EventCard;
