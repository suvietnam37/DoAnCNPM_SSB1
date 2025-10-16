import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const isAuthenticated = true;

    return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
