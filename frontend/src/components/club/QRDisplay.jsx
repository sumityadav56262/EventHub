import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const QRDisplay = ({ eventId }) => {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);

    const fetchQR = async () => {
        try {
            const response = await api.get(`/attendance/qr/${eventId}`);
            setQrData(response.data);
            setTimeLeft(15); // Reset timer
            setError(null);
        } catch (err) {
            console.error("Failed to fetch QR", err);
            setError("Failed to load QR Code");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQR();
        const interval = setInterval(fetchQR, 15000); // Refresh every 15 seconds

        // Countdown timer for visual feedback
        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timerInterval);
        };
    }, [eventId]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan for Attendance</h3>

            <div className="bg-white p-4 border-2 border-gray-100 rounded-lg shadow-inner mb-4">
                {qrData && (
                    <QRCode
                        value={JSON.stringify({ event_id: qrData.event_id, token: qrData.token })}
                        size={200}
                        level="H"
                    />
                )}
            </div>

            <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500">Refreshing in {timeLeft}s</p>
        </div>
    );
};

export default QRDisplay;
