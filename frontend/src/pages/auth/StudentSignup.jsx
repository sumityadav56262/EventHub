import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';

const StudentSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        QID: '',
        email: '',
        programme: 'BTech',
        course: 'CSE',
        section: '',
        specialization: 'None',
        password: '',
        password_confirmation: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup/student', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh p-4 py-8">
            <div className="w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Student Registration
                    </h1>
                    <p className="text-muted-foreground mt-2">Join Event Hub as a student</p>
                </div>

                <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
                        <CardDescription>Fill in your details to get started</CardDescription>
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
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="transition-all duration-200 focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="QID">QID</Label>
                                    <Input
                                        id="QID"
                                        name="QID"
                                        type="text"
                                        placeholder="S12345"
                                        value={formData.QID}
                                        onChange={handleChange}
                                        required
                                        className="transition-all duration-200 focus:scale-[1.01]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="transition-all duration-200 focus:scale-[1.01]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="programme">Programme</Label>
                                    <select
                                        id="programme"
                                        name="programme"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 focus:scale-[1.01]"
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
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 focus:scale-[1.01]"
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
                                        placeholder="A"
                                        value={formData.section}
                                        onChange={handleChange}
                                        required
                                        className="transition-all duration-200 focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <select
                                        id="specialization"
                                        name="specialization"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 focus:scale-[1.01]"
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="transition-all duration-200 focus:scale-[1.01] pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            required
                                            className="transition-all duration-200 focus:scale-[1.01] pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <Alert variant="destructive" className="animate-fade-in">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link to="/login" className="text-primary font-medium hover:underline transition-colors">
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

export default StudentSignup;
