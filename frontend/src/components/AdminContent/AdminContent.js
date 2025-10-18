import styles from './AdminContent.module.scss';
import classNames from 'classnames/bind';
import { NavLink, Outlet } from 'react-router-dom';

const cx = classNames.bind(styles);

function AdminContent() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>Admin Dashboard</div>
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
