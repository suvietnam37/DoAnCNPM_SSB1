import styles from './AdminContent.module.scss';
import classNames from 'classnames/bind';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import showToast from '../../untils/ShowToast/showToast';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth.context';
import axios from '../../untils/CustomAxios/axios.customize';
const cx = classNames.bind(styles);

function AdminContent() {
    const authContext = useContext(AuthContext);
    const username = authContext.auth.user.username;
    const navigate = useNavigate();
    const handleLogout = () => {
        const role = authContext?.auth?.user?.role;
        localStorage.removeItem('access_token');
        authContext.setAuth({
            isAuthenticated: false,
            user: {
                username: '',
                account_id: '',
                role: '',
            },
        });
        if (role === 'Admin') {
            navigate('/admin');
            showToast('Đăng xuất thành công');
        } else {
            navigate('/');
            showToast('Đăng xuất thành công');
        }
    };

    const fetchAccount = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/accounts/account');
            authContext.setAuth({
                isAuthenticated: true,
                user: {
                    username: response.data.username,
                    account_id: response.data.account_id,
                    role: response.data.role,
                },
            });
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        // Khi vào trang login => luôn xóa token cũ
        fetchAccount();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                Admin Dashboard
                <div className={cx('header-infor-acc')}>
                    <span>Welcome {username}</span>
                    <button
                        className={cx('header-logout-btn')}
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        <span>Đăng Xuất</span>
                    </button>
                </div>
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div className={cx('sidebar')}>
                    <NavLink
                        to="dashboard"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="manage-driver"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý tài xế
                    </NavLink>
                    <NavLink
                        to="manage-student"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý học sinh
                    </NavLink>
                    <NavLink
                        to="manage-parent"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý phụ huynh
                    </NavLink>
                    <NavLink
                        to="manage-station"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý trạm
                    </NavLink>
                    <NavLink
                        to="manage-route"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý tuyến
                    </NavLink>
                    <NavLink
                        to="manage-bus"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý xe
                    </NavLink>
                    <NavLink
                        to="manage-account"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Quản lý tài khoản
                    </NavLink>
                    <NavLink
                        to="setup-route"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Setup tuyến
                    </NavLink>
                    <NavLink
                        to="report"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        Báo cáo
                    </NavLink>
                </div>

                {/* Content thay đổi theo route con */}
                <div className={cx('content')}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminContent;
