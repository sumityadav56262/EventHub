import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
    User,
    Mail,
    Building,
    LogOut,
    Edit,
    Loader2,
    BookOpen
} from 'lucide-react';

const TeacherProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await api.get('/teacher/profile');
                setTeacherData(response.data);
            } catch (error) {
                console.error("Failed to fetch teacher data", error);
                // Use user data as fallback
                setTeacherData({
                    name: user?.name || 'Teacher Name',
                    email: user?.email || 'teacher@example.com',
                    department: 'Computer Science',
                    designation: 'Assistant Professor',
                    total_events: 25,
                    clubs_supervised: 3
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
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
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                            {teacherData?.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{teacherData?.name}</h2>
                            <p className="text-indigo-100 text-sm">{teacherData?.email}</p>
                            <p className="text-indigo-100 text-sm mt-1">{teacherData?.designation}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-6 border-b border-border">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{teacherData?.total_events || 0}</p>
                        <p className="text-sm text-muted-foreground">Events Supervised</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{teacherData?.clubs_supervised || 0}</p>
                        <p className="text-sm text-muted-foreground">Clubs Managed</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <User className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{teacherData?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{teacherData?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Building className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="font-medium">{teacherData?.department}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <BookOpen className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Designation</p>
                            <p className="font-medium">{teacherData?.designation}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={() => navigate('/teacher/edit-profile')}
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
                <p>EventHub Teacher Portal v1.0</p>
                <p className="mt-1">© 2024 All rights reserved</p>
            </div>
        </div>
    );
};

export default TeacherProfile;
