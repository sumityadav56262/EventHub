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

export default {
    getAllClubs,
    getClubDetails,
    subscribeToClub,
};
