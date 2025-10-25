import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/Routes';
import { Fragment } from 'react/jsx-runtime';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';
function App() {
    const renderRoutes = (routes, isPrivate = false) =>
        routes.map((route, index) => {
            let Layout = MainLayout;
            const Page = route.component;
            if (route.layout) {
                Layout = route.layout;
            } else if (route.layout === null) {
                Layout = Fragment;
            }

            const element = isPrivate ? (
                <PrivateRoute>
                    <Layout>
                        <Page />
                    </Layout>
                </PrivateRoute>
            ) : (
                <Layout>
                    <Page />
                </Layout>
            );

            if (route.children) {
                return (
                    <Route key={index} path={route.path} element={element}>
                        {route.children.map((child, i) => {
                            const ChildPage = child.component;
                            return <Route key={i} path={child.path} element={<ChildPage />} />;
                        })}
                    </Route>
                );
            }

            return <Route key={index} path={route.path} element={element} />;
        });
    return (
        <Router>
            <div className="App">
                <Routes>
                    {renderRoutes(publicRoutes, true)}
                    {renderRoutes(privateRoutes, true)}
                </Routes>
            </div>
        </Router>
    );
}
export default App;
