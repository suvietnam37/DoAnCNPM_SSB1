import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './DriverContent.module.scss';
import RouteManage from './RouteManage/RouteManage';
import StudentManage from './StudentManage/StudentManage';
import Doing from './Doing/Doing';
import Report from './Report/Report';
const cx = classNames.bind(styles);

function DriverContent() {
    const menus = [
        { name: 'Danh Sách Tuyến Xe', id: 'route-manage', offset: -300 },
        { name: 'Quản Lý Học Sinh', id: 'student-manage', offset: -250 },
        { name: 'Tuyến Xe Đang Thực Hiện', id: 'doing', offset: -200 },
        { name: 'Báo Cáo Sự Cố', id: 'report', offset: -200 },
    ];
    return (
        <div className={cx('header-position')}>
            <NavMenu menus={menus} role={'Driver'}></NavMenu>
            <div className={cx('content-position')}>
                <RouteManage></RouteManage>
                <StudentManage></StudentManage>
                <Doing></Doing>
                <Report></Report>
            </div>
        </div>
    );
}

export default DriverContent;
