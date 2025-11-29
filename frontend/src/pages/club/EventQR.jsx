import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from '../../api/axios';

const EventQR = () => {
    const { eventId } = useParams();
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const response = await api.get(`/attendance/qr/${eventId}`);
                setQrData(response.data);
            } catch (error) {
                console.error("Failed to fetch QR", error);
                // Mock data
                setQrData({
                    event_id: eventId,
                    token: `mock_token_${Date.now()}`,
                    expires_in: 15
                });
            } finally {
                setLoading(false);
            }
        };

        fetchQR();
        const interval = setInterval(fetchQR, 15000); // Refresh every 15 seconds

        return () => clearInterval(interval);
    }, [eventId]);

    if (loading) return <div>Loading QR Code...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Scan for Attendance</h1>
                <p className="text-gray-600 mb-6">QR Code refreshes every 15 seconds</p>

                <div className="flex justify-center mb-6">
                    {qrData && (
                        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                            <QRCode
                                value={JSON.stringify({ event_id: qrData.event_id, token: qrData.token })}
                                size={256}
                            />
                        </div>
                    )}
                </div>

                <div className="text-sm text-gray-500">
                    Event ID: {eventId}
                </div>
            </div>
        </div>
    );
};

export default EventQR;
