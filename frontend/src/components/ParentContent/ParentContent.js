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

    const socketRef = useRef(null);

    const [students, setStudents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [routeStatus, setRouteStatus] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [parent, setParent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [waypoints, setWaypoints] = useState([]);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register', ACCOUNT_ID);

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log('busLocation: ', busLocation);
    }, [busLocation]);

    useEffect(() => {
        console.log('waypoints: ', waypoints);
    }, [waypoints]);

    useEffect(() => {
        if (!parent) return;

        const handleStartRoute = (data) => {
            // console.log('routes.route_id: ', routes.route_id);
            if (data.route_id === routes?.route_id) {
                showToast(data.message);
                // fetchParentData(parent.parent_id, ACCOUNT_ID);
                fetchRouteByStopId(students[0].stop_id);
            }
        };

        socketRef.current.on('startRoute', handleStartRoute);

        const handleConfirmStudent = (data) => {
            var check = students.some((st) => st.student_id === data.student_id);
            if (check) {
                showToast(data.message);
                // fetchParentData(parent.parent_id, ACCOUNT_ID);
                fetchStudentByParentId(parent.parent_id);
            }
        };

        socketRef.current.on('confirmStudent', handleConfirmStudent);

        const handleChangeRoute = (data) => {
            if (routeStatus?.route_id === data.route_id) {
                showToast(data.message);
                // fetchParentData(parent.parent_id, ACCOUNT_ID);
                fetchRouteByStopId(students[0].stop_id);
            }
        };

        socketRef.current.on('changeRoute', handleChangeRoute);

        const handleEndRoute = (data) => {
            if (data.route_id === routes?.route_id) {
                showToast(data.message);
                // fetchParentData(parent.parent_id, ACCOUNT_ID);
                fetchRouteByStopId(students[0].stop_id);
            }
        };

        socketRef.current.on('endRoute', handleEndRoute);

        const handleGetLocation = (data) => {
            console.log('data.route_id: ', data.route_id);
            console.log('routeStatus?.route_id: ', routeStatus?.route_id);

            if (data.route_id === routeStatus?.route_id) {
                setBusLocation(data.location);
            }
        };
        socketRef.current.on('location', handleGetLocation);

        const handleGetWaypoints = (data) => {
            if (routeStatus && data.route_id === routeStatus?.route_id) {
                setWaypoints(data.waypoints);
            }
        };
        socketRef.current.on('waypoints', handleGetWaypoints);

        const handleGetMessageNearStops = (data) => {
            if (data.route_id === routeStatus?.route_id) {
                showToast(data.message);
            }
        };
        socketRef.current.on('nearStop', handleGetMessageNearStops);

        return () => {
            socketRef.current.off('startRoute', handleStartRoute);
            socketRef.current.off('confirmStudent', handleConfirmStudent);
            socketRef.current.off('endRoute', handleEndRoute);
            socketRef.current.off('changeRoute', handleChangeRoute);
            socketRef.current.off('location', handleGetLocation);
            socketRef.current.off('waypoints', handleGetWaypoints);
            socketRef.current.off('nearStop', handleGetMessageNearStops);
        };
    }, [parent, students, routeStatus, routes]);

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
                axios.get(`http://localhost:5000/api/notifications?account_id=${ACCOUNT_ID}&date=${date}`),
            ]);

            const studentList = studentsRes.data;
            setStudents(studentList);
            setNotifications(notificationsRes.data);

            if (studentList.length === 0) {
                setRouteStatus(null);
                return;
            }

            const stopId = studentList[0].stop_id;

            fetchRouteByStopId(stopId);
        } catch (error) {
            console.error('Lỗi fetch dữ liệu phụ huynh:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentByParentId = async (PARENT_ID) => {
        try {
            const studentsRes = await axios.get(`http://localhost:5000/api/students?parent_id=${PARENT_ID}`);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Lỗi fetch dữ liệu học sinh:', error);
        }
    };

    useEffect(() => {
        if (routes && routes.route_id) fetchRouteAssignmentsByRouteId(routes.route_id);
    }, [routes]);

    const fetchRouteByStopId = async (stopId) => {
        try {
            const routeRes = await axios.get(`http://localhost:5000/api/routes/stop/${stopId}`);
            setRoutes(routeRes.data);
        } catch (e) {
            console.log('Không có tuyến chạy hiện tại.');
            setRouteStatus(null);
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
                <StudentManage routeStatus={routeStatus} students={students} setStudents={setStudents} />
                <Notification
                    setNotifications={setNotifications}
                    notifications={notifications}
                    routeStatus={routeStatus}
                />
                <MapRoute routeStatus={routeStatus} busLocation={busLocation} waypoints={waypoints} />
                {/* <MapRoute routeStatus={routeStatus} busLocation={busLocation} /> */}
            </div>
        </div>
    );
}

export default ParentContent;
