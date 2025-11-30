import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QRDisplay from '../../components/club/QRDisplay';
import AttendanceTable from '../../components/club/AttendanceTable';
import PrintAttendance from '../../components/club/PrintAttendance';

const ClubEventDashboard = () => {
    const { eventId } = useParams();
    const componentRef = useRef();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Event Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage attendance and view live stats for Event ID: {eventId}
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <PrintAttendance componentRef={componentRef} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: QR Code */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <QRDisplay eventId={eventId} />

                        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Ask students to scan this QR code using the EventHub app to mark their attendance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Attendance List */}
                <div className="lg:col-span-2">
                    <div ref={componentRef} className="bg-white p-4">
                        {/* Header for Print View */}
                        <div className="hidden print:block mb-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Event Attendance Sheet</h1>
                            <p className="text-gray-500">Event ID: {eventId}</p>
                            <p className="text-sm text-gray-400">Generated on: {new Date().toLocaleString()}</p>
                        </div>

                        <AttendanceTable eventId={eventId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubEventDashboard;
