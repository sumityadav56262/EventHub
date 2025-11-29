import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const LiveAttendance = () => {
    const { eventId } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await api.get(`/attendance/live/${eventId}`);
                setAttendees(response.data);
            } catch (error) {
                console.error("Failed to fetch attendance", error);
                // Mock data
                setAttendees([
                    { id: 1, name: 'John Doe', qid: 'Q123456', scanned_at: '10:05 AM' },
                    { id: 2, name: 'Jane Smith', qid: 'Q654321', scanned_at: '10:10 AM' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
        const interval = setInterval(fetchAttendance, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [eventId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Live Attendance</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Attendees ({attendees.length})</h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {attendees.map((student) => (
                            <li key={student.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-indigo-600 truncate">
                                        {student.name} ({student.qid})
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Present
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Scanned at: {student.scanned_at}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LiveAttendance;
