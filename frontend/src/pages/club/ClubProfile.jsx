import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ProfilePictureUpload from '../../components/profile/ProfilePictureUpload';
import {
    User,
    Mail,
    Building,
    LogOut,
    Edit,
    Loader2
} from 'lucide-react';

const ClubProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [clubData, setClubData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const response = await api.get('/club/profile');
                setClubData(response.data);
            } catch (error) {
                console.error("Failed to fetch club data", error);
                // Use user data as fallback
                setClubData({
                    name: user?.name || 'Club Name',
                    email: user?.email || 'club@example.com',
                    description: 'A vibrant club dedicated to organizing amazing events',
                    total_events: 12,
                    total_members: 150
                });
            } finally {
                setLoading(false);
            }
        };

        fetchClubData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>

            {/* Profile Card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <ProfilePictureUpload
                            currentPicture={clubData?.profile_picture ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/storage/${clubData.profile_picture}` : null}
                            onUploadSuccess={(url) => {
                                setClubData({ ...clubData, profile_picture: url });
                            }}
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold">{clubData?.name}</h2>
                            <p className="text-indigo-100 text-sm">{clubData?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-6 border-b border-border">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{clubData?.total_events || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Events</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{clubData?.total_members || 0}</p>
                        <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <User className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Club Name</p>
                            <p className="font-medium">{clubData?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{clubData?.email}</p>
                        </div>
                    </div>

                    {clubData?.description && (
                        <div className="flex items-start gap-3">
                            <Building className="text-primary flex-shrink-0 mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">About</p>
                                <p className="font-medium">{clubData.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={() => navigate('/club/edit-profile')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                    <Edit size={18} />
                    <span className="font-medium">Edit Profile</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>

            {/* App Info */}
            <div className="text-center text-xs text-muted-foreground">
                <p>EventHub Club Portal v1.0</p>
                <p className="mt-1">© 2024 All rights reserved</p>
            </div>
        </div>
    );
};

export default ClubProfile;
