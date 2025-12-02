import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/student';
import { useAuth } from '../../context/AuthContext';
import ProfilePictureUpload from '../../components/profile/ProfilePictureUpload';
import {
    User,
    Mail,
    BookOpen,
    LogOut,
    Edit,
    Loader2,
    GraduationCap,
    Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setProfile(data);
        } catch (error) {
            toast.error('Failed to load profile');
            console.error(error);
            // Use fallback data
            setProfile({
                name: user?.name || 'Student Name',
                email: user?.email || 'student@example.com',
                QID: 'Q123456',
                programme: 'B.Tech',
                course: 'Computer Science',
                section: 'A',
                specialization: 'AIML',
                total_events: 15,
                clubs_subscribed: 5
            });
        } finally {
            setLoading(false);
        }
    };

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
                            currentPicture={profile?.profile_picture ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/storage/${profile.profile_picture}` : null}
                            onUploadSuccess={(url) => {
                                setProfile({ ...profile, profile_picture: url });
                            }}
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold">{profile?.name}</h2>
                            <p className="text-indigo-100 text-sm">{profile?.email}</p>
                            <p className="text-indigo-100 text-sm mt-1">QID: {profile?.QID}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-6 border-b border-border">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{profile?.total_events || 0}</p>
                        <p className="text-sm text-muted-foreground">Events Attended</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{profile?.clubs_subscribed || 0}</p>
                        <p className="text-sm text-muted-foreground">Clubs Joined</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <User className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{profile?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Hash className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">QID</p>
                            <p className="font-medium font-mono">{profile?.QID}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <GraduationCap className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Programme</p>
                            <p className="font-medium">{profile?.programme}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <BookOpen className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Course</p>
                            <p className="font-medium">{profile?.course}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-primary text-xs font-bold">S</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Section</p>
                                <p className="font-medium">{profile?.section}</p>
                            </div>
                        </div>

                        {profile?.specialization && profile.specialization !== 'None' && (
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-primary text-xs font-bold">★</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Specialization</p>
                                    <p className="font-medium">{profile.specialization}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={() => navigate('/student/edit-profile')}
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
                <p>EventHub Student Portal v1.0</p>
                <p className="mt-1">© 2024 All rights reserved</p>
            </div>
        </div>
    );
};

export default StudentProfile;

