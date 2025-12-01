import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from '../../api/axios';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Clock,
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';

const EventQR = () => {
    const { eventId } = useParams();
    const [qrData, setQrData] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchQR = async () => {
        try {
            setIsRefreshing(true);
            const response = await api.get(`/attendance/qr/${eventId}`);
            setQrData(response.data);
            setTimeLeft(15); // Reset timer
            setError(null);
        } catch (error) {
            console.error("Failed to fetch QR", error);
            setError("Failed to generate QR code");
            // Mock data for development
            setQrData({
                event_id: parseInt(eventId),
                token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                expires_at: new Date(Date.now() + 20000).toISOString()
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEventDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch event details", error);
            // Mock event data
            setEventDetails({
                title: 'Event Name',
                venue: 'Venue',
                start_time: new Date().toISOString(),
                end_time: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
        fetchQR();

        // Refresh QR every 15 seconds
        const qrInterval = setInterval(fetchQR, 15000);

        // Countdown timer
        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(qrInterval);
            clearInterval(timerInterval);
        };
    }, [eventId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/club/events"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Dashboard</span>
                </Link>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                        <h1 className="text-3xl font-bold mb-2">{eventDetails?.title || 'Event QR Code'}</h1>
                        <p className="text-indigo-100">Students can scan this QR code to mark their attendance</p>
                    </div>

                    {/* Event Details */}
                    <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-indigo-600 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatDate(eventDetails?.start_time)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-indigo-600 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500">Time</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatTime(eventDetails?.start_time)} - {formatTime(eventDetails?.end_time)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-indigo-600 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500">Venue</p>
                                    <p className="text-sm font-semibold text-gray-900">{eventDetails?.venue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="px-8 py-12">
                        {error && (
                            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-semibold text-yellow-800">{error}</p>
                                    <p className="text-xs text-yellow-700 mt-1">Using mock data for demonstration</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center">
                            {/* QR Code */}
                            <div className="relative">
                                {isRefreshing && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10">
                                        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                                    </div>
                                )}
                                <div className="p-8 bg-white border-4 border-indigo-100 rounded-xl shadow-lg">
                                    {qrData && (
                                        <QRCode
                                            value={JSON.stringify({
                                                event_id: qrData.event_id,
                                                token: qrData.token
                                            })}
                                            size={280}
                                            level="H"
                                            className="rounded-lg"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Timer and Info */}
                            <div className="mt-8 w-full max-w-md">
                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">Auto-refresh in:</span>
                                        <span className="text-lg font-bold text-indigo-600">{timeLeft}s</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${(timeLeft / 15) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
                                    <p className="text-sm text-indigo-900">
                                        <span className="font-semibold">QR code refreshes every 15 seconds</span>
                                    </p>
                                    <p className="text-xs text-indigo-700 mt-1">
                                        Each code is valid for 20 seconds
                                    </p>
                                </div>

                                {/* Token Info (for debugging) */}
                                {qrData && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Current Token:</p>
                                        <p className="text-xs font-mono text-gray-700 break-all">
                                            {qrData.token.substring(0, 32)}...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Manual Refresh Button */}
                            <button
                                onClick={fetchQR}
                                disabled={isRefreshing}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                                Refresh Now
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Event ID: <span className="font-mono font-semibold">{eventId}</span>
                            </p>
                            <Link
                                to={`/club/events/${eventId}/attendance`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View Live Attendance
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventQR;

