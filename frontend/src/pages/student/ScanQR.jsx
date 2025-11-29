import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import api from '../../api/axios';

const ScanQR = () => {
    const [data, setData] = useState('No result');
    const [status, setStatus] = useState('');

    const handleScan = async (result, error) => {
        if (!!result) {
            setData(result?.text);
            try {
                const parsedData = JSON.parse(result?.text);
                if (parsedData.event_id && parsedData.token) {
                    setStatus('Marking attendance...');
                    await api.post('/attendance/mark', parsedData);
                    setStatus('Attendance marked successfully!');
                } else {
                    setStatus('Invalid QR Code');
                }
            } catch (err) {
                console.error("Scan error", err);
                setStatus('Failed to mark attendance');
            }
        }

        if (!!error) {
            console.info(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Scan Event QR</h1>
            <div className="w-full max-w-md bg-white p-4 rounded-lg shadow">
                <QrReader
                    onResult={handleScan}
                    constraints={{ facingMode: 'environment' }}
                    style={{ width: '100%' }}
                />
                <div className="mt-4 text-center">
                    <p className="font-medium">Result: {data}</p>
                    {status && <p className={`mt-2 font-bold ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
