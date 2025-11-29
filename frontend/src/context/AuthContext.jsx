import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => { },
    logout: () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    // Assuming there's a /user endpoint to get current user details
                    // If not, we rely on the login response to set user
                    // For now, we'll try to fetch user if token exists
                    const response = await api.get('/user'); // Adjust endpoint as needed
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user", error);
                    // If token is invalid, clear it
                    // logout();
                }
            }
            setIsLoading(false);
        };

        // fetchUser(); 
        // For now, we'll just set loading to false as we might not have a /user endpoint ready
        setIsLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            console.log("Login successful", user.role);
            return { success: true, role: user.role };
        } catch (error) {
            console.error("Login failed", error);

            // Extract error message from Laravel validation errors
            let errorMessage = 'Login failed';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Laravel validation errors are in errors object
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            }

            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Helper to check if user has a specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        token,
        login,
        logout,
        isLoading,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
