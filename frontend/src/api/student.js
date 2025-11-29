import api from './axios';

/**
 * Student API Service
 */

// Get student profile
export const getProfile = async () => {
    const response = await api.get('/student/profile');
    return response.data;
};

// Update student profile
export const updateProfile = async (profileData) => {
    const response = await api.put('/student/profile', profileData);
    return response.data;
};

// Get student's subscribed clubs
export const getSubscriptions = async () => {
    const response = await api.get('/student/subscriptions');
    return response.data;
};

export default {
    getProfile,
    updateProfile,
    getSubscriptions,
};
