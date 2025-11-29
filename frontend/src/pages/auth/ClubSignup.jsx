import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

const ClubSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        club_name: '',
        club_code: '',
        email: '',
        club_email: '',
        faculty_incharge: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/signup/club', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
            <div className="w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Club Registration
                    </h1>
                    <p className="text-muted-foreground mt-2">Register your club on Event Hub</p>
                </div>

                <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
                    <CardHeader>
                        <CardTitle>Create Club Account</CardTitle>
                        <CardDescription>Provide your club details to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Account Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Club Admin Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="club_name">Club Name</Label>
                                    <Input
                                        id="club_name"
                                        name="club_name"
                                        type="text"
                                        placeholder="Coding Club"
                                        value={formData.club_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="club_code">Club Code</Label>
                                    <Input
                                        id="club_code"
                                        name="club_code"
                                        type="text"
                                        placeholder="CC01"
                                        value={formData.club_code}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Account Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="club_email">Club Email</Label>
                                    <Input
                                        id="club_email"
                                        name="club_email"
                                        type="email"
                                        placeholder="club@example.com"
                                        value={formData.club_email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="faculty_incharge">Faculty Incharge</Label>
                                <Input
                                    id="faculty_incharge"
                                    name="faculty_incharge"
                                    type="text"
                                    placeholder="Dr. John Smith"
                                    value={formData.faculty_incharge}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive" className="animate-fade-in">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClubSignup;
