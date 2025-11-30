import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Loader2, UserCheck } from 'lucide-react';

const AttendanceTable = ({ eventId }) => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        try {
            const response = await api.get(`/attendance/live/${eventId}`);
            setAttendees(response.data);
        } catch (error) {
            console.error("Failed to fetch attendance", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
        const interval = setInterval(fetchAttendance, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [eventId]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>;

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Live Attendance
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {attendees.length} Present
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendees.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No attendance marked yet.
                                </td>
                            </tr>
                        ) : (
                            attendees.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.s_no}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.qid}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.timestamp}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;
