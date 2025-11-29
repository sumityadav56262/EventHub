import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

const TeacherSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        teacher_id: '',
        email: '',
        department: '',
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
            await api.post('/auth/signup/teacher', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Teacher Registration
                    </h1>
                    <p className="text-muted-foreground mt-2">Join Event Hub as a teacher</p>
                </div>

                <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
                    <CardHeader>
                        <CardTitle>Create Your Account</CardTitle>
                        <CardDescription>Fill in your details to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Dr. John Smith"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="teacher_id">Teacher ID</Label>
                                <Input
                                    id="teacher_id"
                                    name="teacher_id"
                                    type="text"
                                    placeholder="T12345"
                                    value={formData.teacher_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="teacher@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    name="department"
                                    type="text"
                                    placeholder="Computer Science"
                                    value={formData.department}
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
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
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

export default TeacherSignup;
