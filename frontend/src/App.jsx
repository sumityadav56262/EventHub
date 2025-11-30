import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import StudentSignup from './pages/auth/StudentSignup';
import ClubSignup from './pages/auth/ClubSignup';
import TeacherSignup from './pages/auth/TeacherSignup';

// Student Dashboard
import DashboardLayout from './components/layout/DashboardLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import MyClubs from './pages/student/MyClubs';
import StudentProfile from './pages/student/StudentProfile';
import QRScannerPage from './pages/student/QRScannerPage';
import ClubDetailPage from './pages/student/ClubDetailPage';
import EventDetailPage from './pages/student/EventDetailPage';

// Club Pages
import ClubDashboard from './pages/club/ClubDashboard';
import CreateEvent from './pages/club/CreateEvent';
import EventQR from './pages/club/EventQR';
import LiveAttendance from './pages/club/LiveAttendance';
import ClubEventDashboard from './pages/club/ClubEventDashboard';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';

function App() {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/student" element={<StudentSignup />} />
            <Route path="/signup/club" element={<ClubSignup />} />
            <Route path="/signup/teacher" element={<TeacherSignup />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={<DashboardLayout />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="my-clubs" element={<MyClubs />} />
                    <Route path="qr-scanner" element={<QRScannerPage />} />
                    <Route path="profile" element={<StudentProfile />} />
                </Route>
                {/* Detail pages outside DashboardLayout for full-width */}
                <Route path="/student/clubs/:clubId" element={<DashboardLayout><ClubDetailPage /></DashboardLayout>} />
                <Route path="/student/events/:eventId" element={<DashboardLayout><EventDetailPage /></DashboardLayout>} />
            </Route>

            {/* Club Routes */}
            <Route element={<ProtectedRoute allowedRoles={['club']} />}>
                <Route path="/club/dashboard" element={<ClubDashboard />} />
                <Route path="/club/create-event" element={<CreateEvent />} />
                <Route path="/club/events/:eventId" element={<ClubEventDashboard />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Login />} />
        </Routes>
    );
}

export default App;

