import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import Sidebar from '../components/side-bar/side-bar';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="flex justify-center items-center h-screen w-screen">
            <span className="loading loading-ring loading-xl" />
        </div>
    )

    return user ? (
        <Sidebar>
            <Outlet />
        </Sidebar>
    ) : (
        <Navigate to="/" replace state={{ from: location }} />
    );
}
