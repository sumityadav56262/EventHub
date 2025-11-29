import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import StudentSignup from './pages/auth/StudentSignup';
import ClubSignup from './pages/auth/ClubSignup';
import TeacherSignup from './pages/auth/TeacherSignup';
import StudentDashboard from './pages/student/StudentDashboard';
import MyClubs from './pages/student/MyClubs';
import ScanQR from './pages/student/ScanQR';
import ClubDashboard from './pages/club/ClubDashboard';
import CreateEvent from './pages/club/CreateEvent';
import EventQR from './pages/club/EventQR';
import LiveAttendance from './pages/club/LiveAttendance';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/student" element={<StudentSignup />} />
            <Route path="/signup/club" element={<ClubSignup />} />
            <Route path="/signup/teacher" element={<TeacherSignup />} />

            <Route path="/" element={<Layout />}>
                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="student/dashboard" element={<StudentDashboard />} />
                    <Route path="student/my-clubs" element={<MyClubs />} />
                    <Route path="student/scan" element={<ScanQR />} />
                    {/* Default redirect for student */}
                    <Route index element={<StudentDashboard />} />
                </Route>

                {/* Club Routes */}
                <Route element={<ProtectedRoute allowedRoles={['club']} />}>
                    <Route path="club/dashboard" element={<ClubDashboard />} />
                    <Route path="club/create-event" element={<CreateEvent />} />
                    <Route path="club/events/:eventId/qr" element={<EventQR />} />
                    <Route path="club/events/:eventId/attendance" element={<LiveAttendance />} />
                </Route>

                {/* Teacher Routes */}
                <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                    <Route path="teacher/dashboard" element={<TeacherDashboard />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
