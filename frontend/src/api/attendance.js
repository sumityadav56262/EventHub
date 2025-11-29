import api from './axios';

/**
 * Attendance API Service
 */

// Mark attendance using QR code token
export const markAttendance = async (eventId, token) => {
    const response = await api.post('/attendance/mark', {
        event_id: eventId,
        token: token,
    });
    return response.data;
};

// Get attendance status for an event
export const getEventAttendance = async (eventId) => {
    const response = await api.get(`/attendance/event/${eventId}`);
    return response.data;
};

// Get live attendance for an event
export const getLiveAttendance = async (eventId) => {
    const response = await api.get(`/attendance/live/${eventId}`);
    return response.data;
};

export default {
    markAttendance,
    getEventAttendance,
    getLiveAttendance,
};
