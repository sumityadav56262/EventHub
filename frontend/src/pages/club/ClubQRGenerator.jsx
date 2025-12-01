import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    Play,
    Square,
    QrCode as QrCodeIcon,
    Calendar,
    Clock,
    MapPin,
    Users,
    Loader2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

const ClubQRGenerator = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get(`/events/club/${user?.id}`);
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
                // Mock data
                setEvents([
                    {
                        id: 1,
                        title: 'Hackathon 2024',
                        start_time: '2024-12-01 10:00:00',
                        end_time: '2024-12-01 18:00:00',
                        venue: 'Main Auditorium'
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

    const fetchQR = async () => {
        if (!selectedEvent) return;

        try {
            const response = await api.get(`/attendance/qr/${selectedEvent.id}`);
            setQrData(response.data);
            setTimeLeft(15);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch QR", error);
            setError("Failed to generate QR code");
            // Mock data
            setQrData({
                event_id: selectedEvent.id,
                token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                expires_at: new Date(Date.now() + 20000).toISOString()
            });
        }
    };

    const fetchAttendeeCount = async () => {
        if (!selectedEvent) return;

        try {
            const response = await api.get(`/attendance/live/${selectedEvent.id}`);
            setAttendeeCount(response.data.length);
        } catch (error) {
            console.error("Failed to fetch attendee count", error);
        }
    };

    useEffect(() => {
        let qrInterval;
        let timerInterval;
        let attendeeInterval;

        if (isGenerating && selectedEvent) {
            fetchQR();
            fetchAttendeeCount();

            // Refresh QR every 15 seconds
            qrInterval = setInterval(fetchQR, 15000);

            // Countdown timer
            timerInterval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        return 15;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Refresh attendee count every 3 seconds
            attendeeInterval = setInterval(fetchAttendeeCount, 3000);
        }

        return () => {
            if (qrInterval) clearInterval(qrInterval);
            if (timerInterval) clearInterval(timerInterval);
            if (attendeeInterval) clearInterval(attendeeInterval);
        };
    }, [isGenerating, selectedEvent]);

    const isEventActive = (event) => {
        const now = new Date();
        // Remove 'Z' and parse as local time instead of UTC
        const cleanStart = event.start_time.replace('Z', '').replace('.000000', '');
        const cleanEnd = event.end_time.replace('Z', '').replace('.000000', '');
        const start = new Date(cleanStart);
        const end = new Date(cleanEnd);
        return now >= start && now <= end;
    };

    const handleStartGeneration = () => {
        if (selectedEvent && isEventActive(selectedEvent)) {
            setIsGenerating(true);
        }
    };

    const handleStopGeneration = () => {
        setIsGenerating(false);
        setQrData(null);
        setTimeLeft(15);
    };

    const formatDateTime = (dateString) => {
        // Remove 'Z' and parse as local time instead of UTC
        const cleanDate = dateString.replace('Z', '').replace('.000000', '');
        const date = new Date(cleanDate);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">QR Code Generator</h1>

            {/* Event Selection */}
            <div className="bg-card border border-border rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">Select Event</label>
                <select
                    value={selectedEvent?.id || ''}
                    onChange={(e) => {
                        const event = events.find(ev => ev.id === parseInt(e.target.value));
                        setSelectedEvent(event);
                        setIsGenerating(false);
                        setQrData(null);
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Choose an event...</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.title} - {formatDateTime(event.start_time)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Event Details */}
            {selectedEvent && (
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <span>{formatDateTime(selectedEvent.start_time)} - {formatDateTime(selectedEvent.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-primary" />
                            <span>{selectedEvent.venue}</span>
                        </div>
                    </div>

                    {/* Event Status */}
                    {!isEventActive(selectedEvent) && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                            <div className="text-sm">
                                <p className="font-semibold text-yellow-800 dark:text-yellow-200">Event not active</p>
                                <p className="text-yellow-700 dark:text-yellow-300">QR generation is only available during the event time.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Control Buttons */}
            {selectedEvent && (
                <div className="flex gap-3">
                    {!isGenerating ? (
                        <button
                            onClick={handleStartGeneration}
                            disabled={!isEventActive(selectedEvent)}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play size={20} />
                            Start Generation
                        </button>
                    ) : (
                        <button
                            onClick={handleStopGeneration}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            <Square size={20} />
                            Stop Generation
                        </button>
                    )}
                </div>
            )}

            {/* QR Code Display */}
            {isGenerating && qrData && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    {error && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
                        </div>
                    )}

                    {/* QR Code */}
                    <div className="flex justify-center">
                        <div className="p-6 bg-white border-4 border-primary/20 rounded-xl shadow-lg">
                            <QRCode
                                value={JSON.stringify({
                                    event_id: qrData.event_id,
                                    token: qrData.token
                                })}
                                size={240}
                                level="H"
                            />
                        </div>
                    </div>

                    {/* Timer */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Refreshing in:</span>
                            <span className="text-lg font-bold text-primary">{timeLeft}s</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(timeLeft / 15) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Attendee Count */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Users className="text-primary" size={20} />
                            <span className="text-2xl font-bold text-primary">{attendeeCount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Students Attended</p>
                    </div>

                    {/* Info */}
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">QR code refreshes every 15 seconds</span>
                            <br />
                            Each code is valid for 20 seconds
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedEvent && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <QrCodeIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Event Selected</h3>
                    <p className="text-sm text-muted-foreground">
                        Select an event to start generating QR codes for attendance
                    </p>
                </div>
            )}
        </div>
    );
};

export default ClubQRGenerator;
