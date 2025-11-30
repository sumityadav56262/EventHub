import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';

const PrintAttendance = ({ componentRef }) => {
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Attendance_Sheet',
    });

    return (
        <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <Printer className="h-4 w-4 mr-2" />
            Print Attendance
        </button>
    );
};

export default PrintAttendance;
