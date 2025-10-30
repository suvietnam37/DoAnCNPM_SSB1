import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    const segment = window.location.pathname;

    // Nếu chưa đăng nhập
    if (!token) {
        if (segment.startsWith('/admin/')) {
            return <Navigate to="/admin" />;
        } else if (segment.startsWith('/parent')) {
            return <Navigate to="/" />;
        } else if (segment.startsWith('/driver')) {
            return <Navigate to="/" />;
        }
    } else {
        // Nếu đã đăng nhập
        if (segment.startsWith('/admin')) {
            if (role !== 'Admin') return <Navigate to="/admin" />;
        } else if (segment.startsWith('/parent')) {
            if (role !== 'Parent') return <Navigate to="/" />;
        } else if (segment.startsWith('/driver')) {
            if (role !== 'Driver') return <Navigate to="/" />;
        }
    }

    return children;
}

export default PrivateRoute;
