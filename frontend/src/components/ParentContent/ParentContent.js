import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client'; // 🆕 Thêm socket.io-client
import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './ParentContent.module.scss';
import RouteStatus from './RouteStatus/RouteStatus';
import StudentManage from './StudentManage/StudentManage';
import Notification from './Notification/Notification';
import MapRoute from './MapRoute/MapRoute';

const cx = classNames.bind(styles);

const token = localStorage.getItem('access_token');

// Giả định ID của phụ huynh và tài khoản
const LOGGED_IN_PARENT_ID = 1;
const LOGGED_IN_PARENT_ACCOUNT_ID = 3;

// 🆕 Tạo kết nối socket (chỉ cần tạo 1 lần)
const socket = io('http://localhost:5000'); // Đổi URL theo backend của bạn nếu khác

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
                    const routeId = studentList[0].route_id;

                    try {
                        const routeStatusRes = await axios.get(
                            `http://localhost:5000/api/route_assignments/current?route_id=${routeId}`,
                        );
                        setRouteStatus(routeStatusRes.data);
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

    // 🆕 useEffect cho socket.io: nhận dữ liệu thời gian thực
    useEffect(() => {
        socket.on('busLocationUpdate', (data) => {
            console.log('Nhận vị trí xe buýt mới:', data);
            // Nếu tuyến hiện tại trùng với route_id của dữ liệu gửi đến → cập nhật giao diện
            if (routeStatus && data.route_id === routeStatus.route_id) {
                setRouteStatus((prev) => ({
                    ...prev,
                    current_location: data.location,
                }));
            }
        });

        // Cleanup khi component unmount
        return () => {
            socket.off('busLocationUpdate');
        };
    }, [routeStatus]);

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
                <RouteStatus routeStatus={routeStatus} />
                <StudentManage students={students} />
                <Notification notifications={notifications} />
                <MapRoute routeStatus={routeStatus} />
            </div>
        </div>
    );
}

export default ParentContent;
