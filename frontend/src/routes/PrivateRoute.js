import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    // const token = true;
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    const segment = window.location.pathname; // "admin"

    if (!token) {
        if (segment === '/admin/dashboard') {
            return <Navigate to="/admin" />;
        } else if (segment === '/parent' || segment === '/driver') {
            return <Navigate to="/" />;
        }
    } else {
        if (segment === '/admin/dashboard') {
            if (role !== 'Admin') return <Navigate to="/admin" />;
        } else {
            if (segment === '/parent' && role !== 'Parent') {
                return <Navigate to="/" />;
            }
            if (segment === '/driver' && role !== 'Driver') {
                return <Navigate to="/" />;
            }
        }
    }

    return children;
}

export default PrivateRoute;
