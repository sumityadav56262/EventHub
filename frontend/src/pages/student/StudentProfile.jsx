import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/student';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import toast from 'react-hot-toast';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        QID: '',
        email: '',
        programme: '',
        course: '',
        section: '',
        specialization: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setProfile(data);
            setFormData({
                name: data.name || '',
                QID: data.QID || '',
                email: data.email || '',
                programme: data.programme || '',
                course: data.course || '',
                section: data.section || '',
                specialization: data.specialization || '',
            });
        } catch (error) {
            toast.error('Failed to load profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
            await loadProfile();
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-pulse text-primary text-xl">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                    My Profile
                </h1>
                <p className="text-muted-foreground mt-1">Manage your personal information</p>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="bg-secondary border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="QID">QID</Label>
                                <Input
                                    id="QID"
                                    name="QID"
                                    type="text"
                                    value={formData.QID}
                                    onChange={handleChange}
                                    required
                                    disabled
                                    className="bg-muted border-border"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled
                                className="bg-muted border-border"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="programme">Programme</Label>
                                <select
                                    id="programme"
                                    name="programme"
                                    className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.programme}
                                    onChange={handleChange}
                                >
                                    <option value="BTech">BTech</option>
                                    <option value="BCA">BCA</option>
                                    <option value="Management">Management</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="course">Course</Label>
                                <select
                                    id="course"
                                    name="course"
                                    className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.course}
                                    onChange={handleChange}
                                >
                                    <option value="CSE">CSE</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="BBA">BBA</option>
                                    <option value="BCA">BCA</option>
                                    <option value="MBA">MBA</option>
                                    <option value="BHM">BHM</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="section">Section</Label>
                                <Input
                                    id="section"
                                    name="section"
                                    type="text"
                                    value={formData.section}
                                    onChange={handleChange}
                                    required
                                    className="bg-secondary border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <select
                                    id="specialization"
                                    name="specialization"
                                    className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                >
                                    <option value="None">None</option>
                                    <option value="AIML">AIML</option>
                                    <option value="Cyber Security">Cyber Security</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full md:w-auto bg-primary hover:bg-primary/90"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentProfile;
