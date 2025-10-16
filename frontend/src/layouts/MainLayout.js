import Header from '../components/Header/Header';

function MainLayout({ children }) {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
}

export default MainLayout;
