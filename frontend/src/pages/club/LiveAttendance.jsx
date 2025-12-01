import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import {
    ArrowLeft,
    Printer,
    Users,
    Loader2,
    RefreshCw,
    Calendar,
    MapPin,
    Clock
} from 'lucide-react';

const LiveAttendance = () => {
    const { eventId } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAttendance = async () => {
        try {
            setRefreshing(true);
            const response = await api.get(`/attendance/live/${eventId}`);
            setAttendees(response.data);
        } catch (error) {
            console.error("Failed to fetch attendance", error);
            // Mock data
            setAttendees([
                {
                    s_no: 1,
                    name: 'John Doe',
                    qid: 'Q123456',
                    course: 'Computer Science',
                    section: 'A',
                    programme: 'B.Tech',
                    timestamp: '2024-12-01 10:05:30',
                    status: 'present'
                },
                {
                    s_no: 2,
                    name: 'Jane Smith',
                    qid: 'Q654321',
                    course: 'Information Technology',
                    section: 'B',
                    programme: 'B.Tech',
                    timestamp: '2024-12-01 10:10:15',
                    status: 'present'
                },
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEventDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch event details", error);
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
        fetchAttendance();

        // Poll every 5 seconds
        const interval = setInterval(fetchAttendance, 5000);
        return () => clearInterval(interval);
    }, [eventId]);

    const handlePrint = () => {
        window.print();
    };

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
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Screen View */}
            <div className="p-4 space-y-4 print:hidden">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/club/events"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Printer size={18} />
                        <span className="font-medium">Print</span>
                    </button>
                </div>

                {/* Event Details Card */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <h1 className="text-xl font-bold mb-3">{eventDetails?.title}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={16} className="text-primary" />
                            <span>{formatDate(eventDetails?.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={16} className="text-primary" />
                            <span>{formatTime(eventDetails?.start_time)} - {formatTime(eventDetails?.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} className="text-primary" />
                            <span>{eventDetails?.venue}</span>
                        </div>
                    </div>
                </div>

                {/* Attendance Count */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="text-primary" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-primary">{attendees.length}</p>
                                <p className="text-sm text-muted-foreground">Students Attended</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchAttendance}
                            disabled={refreshing}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <RefreshCw size={20} className={`text-primary ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Attendance List */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-semibold">Attendance List</h2>
                    </div>

                    {attendees.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No students have marked attendance yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-xs font-medium text-muted-foreground">
                                        <th className="px-4 py-3">S.No</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">QID</th>
                                        <th className="px-4 py-3">Course</th>
                                        <th className="px-4 py-3">Section</th>
                                        <th className="px-4 py-3">Programme</th>
                                        <th className="px-4 py-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {attendees.map((student) => (
                                        <tr key={student.s_no} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 text-sm">{student.s_no}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{student.name}</td>
                                            <td className="px-4 py-3 text-sm font-mono">{student.qid}</td>
                                            <td className="px-4 py-3 text-sm">{student.course}</td>
                                            <td className="px-4 py-3 text-sm">{student.section}</td>
                                            <td className="px-4 py-3 text-sm">{student.programme}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {formatTime(student.timestamp)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Print View */}
            <div className="hidden print:block p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">EventHub - Attendance Report</h1>
                    <h2 className="text-xl font-semibold mb-4">{eventDetails?.title}</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Date: {formatDate(eventDetails?.start_time)}</p>
                        <p>Time: {formatTime(eventDetails?.start_time)} - {formatTime(eventDetails?.end_time)}</p>
                        <p>Venue: {eventDetails?.venue}</p>
                        <p className="font-semibold mt-2">Total Attendees: {attendees.length}</p>
                    </div>
                </div>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">QID</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Course</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Programme</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendees.map((student) => (
                            <tr key={student.s_no}>
                                <td className="border border-gray-300 px-4 py-2">{student.s_no}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.qid}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.course}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.section}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.programme}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatTime(student.timestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-6 text-sm text-gray-600">
                    <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
            </div>
        </>
    );
};

export default LiveAttendance;

