import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './ParentContent.module.scss';
import RouteStatus from './RouteStatus/RouteStatus';
import StudentManage from './StudentManage/StudentManage';
import Notification from './Notification/Notification';
import MapRoute from './MapRoute/MapRoute';
import { AuthContext } from '../../context/auth.context';
import showToast from '../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function ParentContent() {
    const authContext = useContext(AuthContext);
    const ACCOUNT_ID = authContext.auth.user.account_id;

    // Chỉ tạo socket 1 lần
    const socketRef = useRef(null);

    const [students, setStudents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [routeStatus, setRouteStatus] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [parent, setParent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Students:', students);
        console.log('Notifications:', notifications);
    }, [students, notifications]);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register', ACCOUNT_ID);

        socketRef.current.on('startRoute', async (message) => {
            showToast(message);

            if (parent) {
                fetchParentData(parent.parent_id, ACCOUNT_ID);
            }
        });

        return () => {
            socketRef.current.off('startRoute');
            socketRef.current.disconnect();
        };
    }, []);

    //  //lắng nghe sự kiện socket theo routeStatus
    // useEffect(() => {
    //     if (!routeStatus) return;

    //     const socket = socketRef.current;
    //     const routeId = routeStatus.route_id;

    //     console.log(`Join room route: ${routeId}`);
    //     socket.emit('join_route_room', routeId);

    //     const handleNewLocation = (data) => {
    //         setBusLocation({ lat: data.lat, lng: data.lng });
    //     };

    //     const handleApproachingStop = (data) => {
    //         showToast(`Xe sắp đến trạm "${data.stopName}" (còn ${data.distance}m)!`);
    //     };

    //     socket.on('new_location', handleNewLocation);
    //     socket.on('approaching_stop', handleApproachingStop);

    //     return () => {
    //         console.log(`Leave room route: ${routeId}`);
    //         socket.off('new_location', handleNewLocation);
    //         socket.off('approaching_stop', handleApproachingStop);
    //         socket.emit('leave_route_room', routeId);
    //     };
    // }, [routeStatus]);

    //lấy parent từ account
    useEffect(() => {
        fetchParentsByAcountId(ACCOUNT_ID);
    }, []);

    useEffect(() => {
        if (parent) fetchParentData(parent.parent_id, ACCOUNT_ID);
    }, [parent]);

    const fetchParentData = async (PARENT_ID, ACCOUNT_ID) => {
        setLoading(true);
        const date = new Date().toISOString().split('T')[0];

        try {
            const [studentsRes, notificationsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/students?parent_id=${PARENT_ID}`),
                axios.get(`http://localhost:5000/api/notifications?account_id=${ACCOUNT_ID}?date=${date}`),
            ]);

            const studentList = studentsRes.data;
            setStudents(studentList);
            setNotifications(notificationsRes.data);

            if (studentList.length === 0) {
                setRouteStatus(null);
                return;
            }

            const stopId = studentList[0].stop_id;

            try {
                const routeRes = await axios.get(`http://localhost:5000/api/routes/stop/${stopId}`);
                fetchRouteAssignmentsByRouteId(routeRes.data.route_id);
            } catch (e) {
                console.log('Không có tuyến chạy hiện tại.');
                setRouteStatus(null);
            }
            // const today = new Date().toISOString().split('T')[0];
            // fetchRoutes(today, stopId);
        } catch (error) {
            console.error('Lỗi fetch dữ liệu phụ huynh:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRouteAssignmentsByRouteId = async (routeId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/route_assignments/current?route_id=${routeId}`);
            setRouteStatus(res.data);
        } catch (e) {
            console.log('Không có route assignment đang chạy');
            setRouteStatus(null);
        }
    };
    const fetchRoutes = async (date, stop_id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/routes/date/${date}/stop/${stop_id}`);
            setRoutes(res.data);
        } catch (e) {
            console.log('Không có routes');
            setRouteStatus(null);
        }
    };

    const fetchParentsByAcountId = async (ACCOUNT_ID) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/parents/by-account/${ACCOUNT_ID}`);
            setParent(res.data);
        } catch (e) {
            console.error('Lỗi lấy parent:', e);
        }
    };

    const menus = [
        { name: 'Trạng Thái Tuyến Xe', id: 'route-status', offset: -300 },
        { name: 'Quản Lý Con Em', id: 'student-manage', offset: -280 },
        { name: 'Thông Báo Hệ Thống', id: 'notification', offset: -250 },
        { name: 'Theo Dõi Tuyến Đường', id: 'map-route', offset: -190 },
    ];

    if (loading) return <div>Đang tải thông tin...</div>;

    return (
        <div className={cx('header-position')}>
            <NavMenu menus={menus} role={'Parent'} />
            <div className={cx('content-position')}>
                <RouteStatus routeStatus={routeStatus} />
                <StudentManage students={students} />
                <Notification
                    setNotifications={setNotifications}
                    notifications={notifications}
                    routeStatus={routeStatus}
                />
                <MapRoute routeStatus={routeStatus} busLocation={busLocation} />
            </div>
        </div>
    );
}

export default ParentContent;
