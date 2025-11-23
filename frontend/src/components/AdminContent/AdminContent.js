import styles from './AdminContent.module.scss';
import classNames from 'classnames/bind';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import showToast from '../../untils/ShowToast/showToast';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth.context';
import axios from '../../untils/CustomAxios/axios.customize';
import { useTranslation } from 'react-i18next';
import '../../untils/ChangeLanguage/i18n';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const cx = classNames.bind(styles);

function AdminContent() {
    const { t } = useTranslation();

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
            showToast('logout_success');
        } else {
            navigate('/');
            showToast('logout_success');
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
                <div className={cx('header-infor-logo')}>
                    {t('admin_dashboard')}
                    <LanguageSwitcher />
                </div>
                <div className={cx('header-infor-acc')}>
                    <span>
                        {t('welcome')} {username}
                    </span>
                    <button
                        className={cx('header-logout-btn')}
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        <span>{t('Logout')}</span>
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
                        {t('dashboard')}
                    </NavLink>
                    <NavLink
                        to="manage-driver"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('driver_management')}
                    </NavLink>
                    <NavLink
                        to="manage-student"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('student_management')}
                    </NavLink>
                    <NavLink
                        to="manage-parent"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('parent_management')}
                    </NavLink>
                    <NavLink
                        to="manage-station"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('stop_management')}
                    </NavLink>
                    <NavLink
                        to="manage-route"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('route_management')}
                    </NavLink>
                    <NavLink
                        to="manage-bus"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('bus_management')}
                    </NavLink>
                    <NavLink
                        to="manage-account"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('account_management')}
                    </NavLink>
                    <NavLink
                        to="setup-route"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('route_assignment')}
                    </NavLink>
                    <NavLink
                        to="report"
                        className={({ isActive }) => (isActive ? cx('sidebar-item', 'active') : cx('sidebar-item'))}
                    >
                        {t('reports')}
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
