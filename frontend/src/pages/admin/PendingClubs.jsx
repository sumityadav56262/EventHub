import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    CheckCircle,
    XCircle,
    Loader2,
    Clock,
    Mail,
    Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const PendingClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchPendingClubs();
    }, []);

    const fetchPendingClubs = async () => {
        try {
            const response = await api.get('/admin/clubs/pending');
            setClubs(response.data);
        } catch (error) {
            console.error('Failed to fetch pending clubs', error);
            toast.error('Failed to load pending clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (clubId) => {
        setProcessing(clubId);
        try {
            await api.post(`/admin/clubs/${clubId}/approve`);
            toast.success('Club approved successfully!');
            fetchPendingClubs(); // Refresh list
        } catch (error) {
            console.error('Failed to approve club', error);
            toast.error('Failed to approve club');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (clubId) => {
        if (!confirm('Are you sure you want to reject this club?')) return;

        setProcessing(clubId);
        try {
            await api.post(`/admin/clubs/${clubId}/reject`);
            toast.success('Club rejected');
            fetchPendingClubs(); // Refresh list
        } catch (error) {
            console.error('Failed to reject club', error);
            toast.error('Failed to reject club');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pending Club Approvals</h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve club registrations
                </p>
            </div>

            {clubs.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">
                        No pending club approvals at the moment
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {clubs.map((club) => (
                        <div
                            key={club.id}
                            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                            {club.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{club.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                    Pending Approval
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail size={16} className="text-primary" />
                                            <span>{club.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar size={16} className="text-primary" />
                                            <span>Registered: {new Date(club.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleApprove(club.id)}
                                        disabled={processing === club.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing === club.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={18} />
                                        )}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(club.id)}
                                        disabled={processing === club.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingClubs;
