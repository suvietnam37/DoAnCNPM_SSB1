import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    // const token = true;
    const token = sessionStorage.getItem('access_token');
    // const role = sessionStorage.getItem('role');
    const segment = window.location.pathname; // "admin"

    if (!token) {
        if (segment === '/admin/dashboard') {
            return <Navigate to="/admin" />;
        } else if (segment === '/parent' || segment === '/driver') {
            return <Navigate to="/" />;
        }
    }

    return children;
}

export default PrivateRoute;
