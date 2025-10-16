import AdminPage from "../pages/AdminPage";
import DriverPage from "../pages/DriverPage";
import LoginPage from "../pages/LoginPage";
import ParentPage from "../pages/ParentPage";


const publicRoutes = [
    { path: '/', component: LoginPage, layout: null },
    { path: '/parent', component: ParentPage },
    { path: '/driver', component: DriverPage },
];
const privateRoutes = [
    { path: '/admin', component: AdminPage, layout: null },
];

export { publicRoutes,privateRoutes };
