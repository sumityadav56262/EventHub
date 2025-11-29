import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { markAttendance } from '../../api/attendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AttendanceScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            // Cleanup scanner on unmount
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
            }
        };
    }, []);

    const startScanning = async () => {
        try {
            setError('');
            setSuccess('');

            const html5QrCode = new Html5Qrcode('qr-reader');
            html5QrCodeRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                onScanFailure
            );

            setScanning(true);
        } catch (err) {
            console.error('Error starting scanner:', err);
            setError('Failed to start camera. Please check permissions.');
        }
    };

    const stopScanning = async () => {
        try {
            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            }
            setScanning(false);
        } catch (err) {
            console.error('Error stopping scanner:', err);
        }
    };

    const onScanSuccess = async (decodedText) => {
        try {
            // Stop scanning immediately
            await stopScanning();

            // Parse QR code data
            const qrData = JSON.parse(decodedText);
            const { event_id, token } = qrData;

            if (!event_id || !token) {
                setError('Invalid QR code format');
                return;
            }

            // Mark attendance
            const response = await markAttendance(event_id, token);

            setSuccess('Attendance marked successfully!');
            toast.success('Attendance marked successfully!');

            // Redirect to events page after 2 seconds
            setTimeout(() => {
                navigate('/student/events');
            }, 2000);

        } catch (err) {
            console.error('Error marking attendance:', err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
                toast.error(err.response.data.message);
            } else {
                setError('Failed to mark attendance. Please try again.');
                toast.error('Failed to mark attendance');
            }
        }
    };

    const onScanFailure = (error) => {
        // Ignore scan failures (happens when no QR code is detected)
        // console.warn('Scan failure:', error);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Scan QR Code
                </h1>
                <p className="text-muted-foreground mt-2">Scan the event QR code to mark your attendance</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>QR Code Scanner</CardTitle>
                    <CardDescription>
                        Position the QR code within the frame to scan
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="relative">
                        <div
                            id="qr-reader"
                            ref={scannerRef}
                            className="w-full rounded-lg overflow-hidden border-2 border-primary"
                            style={{ minHeight: scanning ? '300px' : '0px' }}
                        />

                        {!scanning && !success && (
                            <div className="flex items-center justify-center py-20 bg-muted rounded-lg">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📷</div>
                                    <p className="text-muted-foreground">Camera not active</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Click "Start Scanning" to begin
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {!scanning && !success && (
                            <Button
                                onClick={startScanning}
                                className="flex-1 gradient-primary hover:opacity-90"
                            >
                                Start Scanning
                            </Button>
                        )}

                        {scanning && (
                            <Button
                                onClick={stopScanning}
                                variant="destructive"
                                className="flex-1"
                            >
                                Stop Scanning
                            </Button>
                        )}

                        {success && (
                            <Button
                                onClick={() => navigate('/student/events')}
                                className="flex-1 gradient-primary hover:opacity-90"
                            >
                                View Events
                            </Button>
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                        <p className="font-semibold">Instructions:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Allow camera access when prompted</li>
                            <li>Point your camera at the event QR code</li>
                            <li>Hold steady until the code is scanned</li>
                            <li>Attendance will be marked automatically</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AttendanceScanner;
