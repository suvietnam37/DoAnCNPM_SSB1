import Dashboard from '../components/AdminContent/DashBoard/DashBoard';
import ManageBus from '../components/AdminContent/ManageBus/ManageBus';
import ManageDriver from '../components/AdminContent/ManageDriver/ManageDriver';
import ManageRoute from '../components/AdminContent/ManageRoute/ManageRoute';
import ManageStudent from '../components/AdminContent/ManageStudent/ManageStudent';
import Report from '../components/AdminContent/Report/Report';
import SetupRoute from '../components/AdminContent/SetupRoute/SetupRoute';
import DriverPage from '../pages/DriverPage';
import LoginPage from '../pages/LoginPage';
import LoginAdminPage from '../pages/LoginAdminPage';
import ParentPage from '../pages/ParentPage';
import AdminPage from '../pages/AdminPage';
import { Navigate } from 'react-router-dom';

const publicRoutes = [
    { path: '/', component: LoginPage, layout: null },
    { path: '/parent', component: ParentPage },
    { path: '/driver', component: DriverPage },

    { path: '/admin', component: LoginAdminPage, layout: null },
];

const privateRoutes = [
    {
        path: '/admin',
        component: AdminPage, // layout chính của admin
        layout: null,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'manage-bus', component: ManageBus },
            { path: 'manage-driver', component: ManageDriver },
            { path: 'manage-route', component: ManageRoute },
            { path: 'manage-student', component: ManageStudent },
            { path: 'report', component: Report },
            { path: 'setup-route', component: SetupRoute },
        ],
    },
];

export { publicRoutes, privateRoutes };
