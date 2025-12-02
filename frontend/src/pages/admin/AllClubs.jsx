import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Loader2,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const AllClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchAllClubs();
    }, []);

    const fetchAllClubs = async () => {
        try {
            const response = await api.get('/admin/clubs');
            setClubs(response.data);
        } catch (error) {
            console.error('Failed to fetch clubs', error);
            toast.error('Failed to load clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (clubId, clubName) => {
        if (!confirm(`Are you sure you want to delete "${clubName}"? This will also delete all their events.`)) return;

        setDeleting(clubId);
        try {
            await api.delete(`/admin/clubs/${clubId}`);
            toast.success('Club deleted successfully');
            fetchAllClubs(); // Refresh list
        } catch (error) {
            console.error('Failed to delete club', error);
            toast.error('Failed to delete club');
        } finally {
            setDeleting(null);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle size={14} />, label: 'Approved' },
            pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: <Clock size={14} />, label: 'Pending' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <XCircle size={14} />, label: 'Rejected' },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
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
                <h1 className="text-3xl font-bold">All Clubs</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all registered clubs ({clubs.length} total)
                </p>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Club
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Events
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {clubs.map((club) => (
                                <tr key={club.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {club.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{club.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {club.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(club.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {club.events_count || 0} events
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {new Date(club.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(club.id, club.name)}
                                            disabled={deleting === club.id}
                                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            {deleting === club.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllClubs;
