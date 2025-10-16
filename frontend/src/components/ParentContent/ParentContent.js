import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './ParentContent.module.scss';
import RouteStatus from './RouteStatus/RouteStatus';
import StudentManage from './StudentManage/StudentManage';
import Notification from './Notification/Notification';
import MapRoute from './MapRoute/MapRoute';

const cx = classNames.bind(styles);

function ParentContent() {
    const menus = [
        { name: 'Trạng Thái Tuyến Xe', id: 'route-status', offset: -300 },
        { name: 'Quản Lý Con Em', id: 'student-manage', offset: -280 },
        { name: 'Thông Báo Hệ Thống', id: 'notification', offset: -250 },
        { name: 'Theo Dõi Tuyến Đường', id: 'map-route', offset: -200 },
    ];
    return (
        <div className={cx('header-position')}>
            <NavMenu menus={menus} role={'Parent'}></NavMenu>
            <div className={cx('content-position')}>
                <RouteStatus></RouteStatus>
                <StudentManage></StudentManage>
                <Notification></Notification>
                <MapRoute></MapRoute>
            </div>
        </div>
    );
}

export default ParentContent;
