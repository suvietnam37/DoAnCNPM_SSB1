// import { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/auth.context';

// function PrivateRoute({ children }) {
//     const token = localStorage.getItem('access_token');
//     const authContext = useContext(AuthContext);
//     const role = authContext?.auth?.user?.role;
//     const segment = window.location.pathname;

//     // Nếu chưa đăng nhập
//     if (!token) {
//         if (segment.startsWith('/admin/')) {
//             return <Navigate to="/admin" />;
//         } else if (segment.startsWith('/parent')) {
//             return <Navigate to="/" />;
//         } else if (segment.startsWith('/driver')) {
//             return <Navigate to="/" />;
//         }
//     } else {
//         // Nếu đã đăng nhập
//         if (segment.startsWith('/admin')) {
//             if (role !== 'Admin') return <Navigate to="/admin" />;
//         } else if (segment.startsWith('/parent')) {
//             if (role !== 'Parent') return <Navigate to="/" />;
//         } else if (segment.startsWith('/driver')) {
//             if (role !== 'Driver') return <Navigate to="/" />;
//         }
//     }

//     return children;
// }

// export default PrivateRoute;

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

function PrivateRoute({ children }) {
    const { auth, loading } = useContext(AuthContext);
    const token = localStorage.getItem('access_token');
    const role = auth?.user?.role;
    const segment = window.location.pathname;

    if (loading) {
        return <div>Loading...</div>; // hoặc spinner
    }

    // Chưa đăng nhập
    if (!token) {
        if (segment.startsWith('/admin/')) return <Navigate to="/admin" />;
        if (segment.startsWith('/parent')) return <Navigate to="/" />;
        if (segment.startsWith('/driver')) return <Navigate to="/" />;
    } else {
        if (segment === '/admin' && role === 'Admin') return <Navigate to="/admin/dashboard" />;
        if (segment === '/' && role === 'Parent') return <Navigate to="/parent" />;
        if (segment === '/' && role === 'Driver') return <Navigate to="/driver" />;

        if (segment.startsWith('/admin') && (role == 'Parent' || role == 'Driver')) return <Navigate to="/" />;
        if (segment.startsWith('/admin') && role !== 'Admin') return <Navigate to="/admin" />;
        if (segment.startsWith('/parent') && role !== 'Parent') return <Navigate to="/" />;
        if (segment.startsWith('/driver') && role !== 'Driver') return <Navigate to="/" />;
    }

    return children;
}

export default PrivateRoute;
