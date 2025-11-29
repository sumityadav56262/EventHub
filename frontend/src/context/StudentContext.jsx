import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSubscriptions } from '../api/student';
import { getAllClubs } from '../api/clubs';
import { getUpcomingEvents } from '../api/events';

const StudentContext = createContext();

export const useStudent = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error('useStudent must be used within StudentProvider');
    }
    return context;
};

export const StudentProvider = ({ children }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [allClubs, setAllClubs] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch subscribed clubs
    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const data = await getSubscriptions();
            setSubscriptions(data);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all clubs
    const fetchAllClubs = async () => {
        try {
            const data = await getAllClubs();
            setAllClubs(data);
        } catch (error) {
            console.error('Failed to fetch clubs:', error);
        }
    };

    // Fetch upcoming events
    const fetchUpcomingEvents = async () => {
        try {
            const data = await getUpcomingEvents();
            setUpcomingEvents(data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    // Refresh all data
    const refreshData = async () => {
        await Promise.all([
            fetchSubscriptions(),
            fetchAllClubs(),
            fetchUpcomingEvents(),
        ]);
    };

    // Check if student is subscribed to a club
    const isSubscribed = (clubId) => {
        return subscriptions.some(sub => sub.club_id === clubId);
    };

    const value = {
        subscriptions,
        allClubs,
        upcomingEvents,
        loading,
        fetchSubscriptions,
        fetchAllClubs,
        fetchUpcomingEvents,
        refreshData,
        isSubscribed,
    };

    return (
        <StudentContext.Provider value={value}>
            {children}
        </StudentContext.Provider>
    );
};
