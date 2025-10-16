import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = true; // token của admin
    // const token = localStorage.getItem('adminToken'); // token của admin

    // Nếu chưa đăng nhập → quay lại trang /admin (login)
    if (!token) {
        return <Navigate to="/admin" />;
    }

    return children;
}

export default PrivateRoute;
