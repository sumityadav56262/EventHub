import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { markAttendance, getEventAttendance } from '../../api/attendance';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import toast from 'react-hot-toast';

const QRScannerPage = () => {
    const [activeTab, setActiveTab] = useState('scan');
    const [scanning, setScanning] = useState(false);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const html5QrCodeRef = useRef(null);
    const itemsPerPage = 10;

    useEffect(() => {
        if (activeTab === 'history') {
            loadAttendanceHistory();
        }
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
            }
        };
    }, [activeTab]);

    const loadAttendanceHistory = async () => {
        setLoading(true);
        try {
            // This would need a backend endpoint to get all student attendance
            // For now, using placeholder data
            setAttendanceHistory([]);
        } catch (error) {
            console.error('Failed to load attendance history:', error);
        } finally {
            setLoading(false);
        }
    };

    const startScanning = async () => {
        try {
            const html5QrCode = new Html5Qrcode('qr-reader');
            html5QrCodeRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                onScanSuccess,
                () => { }
            );

            setScanning(true);
        } catch (err) {
            console.error('Error starting scanner:', err);
            toast.error('Failed to start camera. Please ensure you have granted camera permissions and are using HTTPS.');
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
            await stopScanning();
            const qrData = JSON.parse(decodedText);
            const { event_id, token } = qrData;

            if (!event_id || !token) {
                toast.error('Invalid QR code format');
                return;
            }

            await markAttendance(event_id, token);
            toast.success('Attendance marked successfully!');

            // Reload attendance history
            if (activeTab === 'history') {
                loadAttendanceHistory();
            }
        } catch (err) {
            console.error('Error marking attendance:', err);
            toast.error(err.response?.data?.message || 'Failed to mark attendance');
        }
    };

    const filteredHistory = attendanceHistory.filter(record =>
        record.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.event?.club?.club_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">QR Scanner</h1>
                <p className="text-muted-foreground mt-1">Scan QR codes and view attendance history</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab('scan')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'scan'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Scan QR
                    {activeTab === 'scan' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'history'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Attendance History
                    {activeTab === 'history' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
            </div>

            {/* Scan QR Tab */}
            {activeTab === 'scan' && (
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Scan Event QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <div
                                id="qr-reader"
                                className="w-full rounded-lg overflow-hidden border-2 border-border"
                                style={{ minHeight: scanning ? '300px' : '0px' }}
                            />

                            {!scanning && (
                                <div className="flex items-center justify-center py-20 bg-secondary rounded-lg">
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
                            {!scanning ? (
                                <Button
                                    onClick={startScanning}
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                >
                                    Start Scanning
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopScanning}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    Stop Scanning
                                </Button>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t border-border">
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
            )}

            {/* Attendance History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Search attendance..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-secondary border-border"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse text-primary">Loading...</div>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <Card className="border-border">
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    {searchTerm ? 'No attendance records found.' : 'No attendance history yet.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {paginatedHistory.map((record) => (
                                    <Card key={record.id} className="border-border">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground">
                                                        {record.event?.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {record.event?.club?.club_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {new Date(record.marked_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant="success">Present</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="border-border"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="border-border"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default QRScannerPage;
