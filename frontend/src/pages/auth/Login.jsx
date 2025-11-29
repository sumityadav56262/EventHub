import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result?.success) {
            navigate('/');
        } else {
            setError(result?.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Event Hub
                    </h1>
                    <p className="text-muted-foreground mt-2">Welcome back! Sign in to continue</p>
                </div>

                <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="transition-all duration-200 focus:scale-[1.01]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="transition-all duration-200 focus:scale-[1.01]"
                                />
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
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Don't have an account? </span>
                                <Link
                                    to="/signup"
                                    className="text-primary font-medium hover:underline transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;

