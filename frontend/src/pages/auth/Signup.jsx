import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const Signup = () => {
    const roles = [
        {
            to: '/signup/student',
            title: 'Student',
            description: 'Access events, subscribe to clubs, and mark attendance',
            icon: '🎓',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            to: '/signup/club',
            title: 'Club',
            description: 'Create events, manage members, and track attendance',
            icon: '🎭',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            to: '/signup/teacher',
            title: 'Teacher',
            description: 'Oversee club activities and monitor events',
            icon: '👨‍🏫',
            gradient: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
            <div className="w-full max-w-4xl animate-fade-in">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Join Event Hub
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Select your role to get started
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {roles.map((role, index) => (
                        <Link
                            key={role.to}
                            to={role.to}
                            className="group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-primary cursor-pointer">
                                <CardHeader className="text-center pb-4">
                                    <div className={`text-6xl mb-4 bg-gradient-to-br ${role.gradient} bg-clip-text text-transparent`}>
                                        {role.icon}
                                    </div>
                                    <CardTitle className="text-2xl">{role.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center text-base">
                                        {role.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Card className="inline-block px-6 py-3 shadow-lg">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-primary font-semibold hover:underline transition-colors"
                        >
                            Sign in
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Signup;
