import api from './axios';

/**
 * Events API Service
 */

// Get all upcoming events
export const getUpcomingEvents = async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
};

// Get event details by ID
export const getEventDetails = async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
};

// Get events for a specific club
export const getClubEvents = async (clubId) => {
    const response = await api.get(`/events/club/${clubId}`);
    return response.data;
};

export default {
    getUpcomingEvents,
    getEventDetails,
    getClubEvents,
};
