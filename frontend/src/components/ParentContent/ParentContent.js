import { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './ParentContent.module.scss';
import RouteStatus from './RouteStatus/RouteStatus';
import StudentManage from './StudentManage/StudentManage';
import Notification from './Notification/Notification';
import MapRoute from './MapRoute/MapRoute';

const cx = classNames.bind(styles);

// Giả định ID của phụ huynh và tài khoản
const LOGGED_IN_PARENT_ID = 1;
const LOGGED_IN_PARENT_ACCOUNT_ID = 3;

function ParentContent() {
    // State quản lý dữ liệu
    const [students, setStudents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [routeStatus, setRouteStatus] = useState(null); // Lưu thông tin tuyến xe đang chạy
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParentData = async () => {
            setLoading(true);
            try {
                // Bước 1: Lấy danh sách con và thông báo cùng lúc
                const [studentsRes, notificationsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/students?parent_id=${LOGGED_IN_PARENT_ID}`),
                    axios.get(`http://localhost:5000/api/notifications?account_id=${LOGGED_IN_PARENT_ACCOUNT_ID}`),
                ]);

                const studentList = studentsRes.data;
                setStudents(studentList);
                setNotifications(notificationsRes.data);

                // Bước 2: Dựa vào thông tin con, tìm tuyến xe đang chạy
                if (studentList.length > 0) {
                    // Lấy route_id từ người con đầu tiên (giả định các con đi cùng tuyến)
                    const routeId = studentList[0].route_id;
                    
                    // Bước 3: Gọi API để lấy thông tin tuyến đang chạy
                    try {
                        const routeStatusRes = await axios.get(`http://localhost:5000/api/route_assignments/current?route_id=${routeId}`);
                        setRouteStatus(routeStatusRes.data); // Sẽ là null nếu tuyến không chạy
                    } catch (routeError) {
                         console.log('Tuyến xe của con hiện không hoạt động.');
                         setRouteStatus(null);
                    }
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu cho phụ huynh:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, []);

    const menus = [
        { name: 'Trạng Thái Tuyến Xe', id: 'route-status', offset: -300 },
        { name: 'Quản Lý Con Em', id: 'student-manage', offset: -280 },
        { name: 'Thông Báo Hệ Thống', id: 'notification', offset: -250 },
        { name: 'Theo Dõi Tuyến Đường', id: 'map-route', offset: -200 },
    ];

    if (loading) {
        return <div>Đang tải thông tin...</div>;
    }

    return (
        <div className={cx('header-position')}>
            <NavMenu menus={menus} role={'Parent'} />
            <div className={cx('content-position')}>
                {/* Truyền dữ liệu xuống các component con */}
                <RouteStatus routeStatus={routeStatus} />
                <StudentManage students={students} />
                <Notification notifications={notifications} />
                <MapRoute routeStatus={routeStatus} />
            </div>
        </div>
    );
}

export default ParentContent;