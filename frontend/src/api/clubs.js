import api from './axios';

/**
 * Clubs API Service
 */

// Get all clubs
export const getAllClubs = async () => {
    const response = await api.get('/clubs');
    return response.data;
};

// Get club details by ID
export const getClubDetails = async (clubId) => {
    const response = await api.get(`/clubs/${clubId}`);
    return response.data;
};

// Subscribe or unsubscribe to a club (toggle)
export const subscribeToClub = async (clubId) => {
    const response = await api.post(`/clubs/subscribe/${clubId}`);
    return response.data;
};

// Get events for a specific club (with optional pagination)
export const getClubEvents = async (clubId, page = 1, perPage = 10) => {
    const response = await api.get(`/clubs/${clubId}/events`, {
        params: { page, per_page: perPage }
    });
    return response.data;
};

export default {
    getAllClubs,
    getClubDetails,
    subscribeToClub,
    getClubEvents,
};
