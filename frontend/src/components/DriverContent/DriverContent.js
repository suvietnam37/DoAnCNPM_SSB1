// frontend/src/components/DriverContent/DriverContent.js
import { useState, useEffect, useContext, use, useRef } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './DriverContent.module.scss';
import RouteManage from './RouteManage/RouteManage';
import StudentManage from './StudentManage/StudentManage';
import Doing from './Doing/Doing';
import Report from './Report/Report';
import showToast from '../../untils/ShowToast/showToast';
import showConfirm from '../../untils/ShowConfirm/showConfirm';
import { AuthContext } from '../../context/auth.context';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer } from 'react-leaflet';
import Routing from '../../untils/Routing/Routing';
import getDistance from '../../untils/getDistance/getDistance';

const cx = classNames.bind(styles);

function DriverContent() {
    const socketRef = useRef(null);
    const authContext = useContext(AuthContext);
    const ACCOUNT_ID = authContext.auth.user.account_id;

    // State quản lý toàn bộ dữ liệu cho trang Driver
    const [assignments, setAssignments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [studentsOnRoute, setStudentsOnRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [driver, setDriver] = useState(null);
    const [route, setRoute] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [routeCoords, setRouteCoords] = useState([]);
    const [stops, setStops] = useState([]);

    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const currentIndexRef = useRef(0);
    const stopIndexRef = useRef(1);

    // //lay vi tri bang geolocation
    // const [position, setPosition] = useState(null);
    // const watchIdRef = useRef(null);

    // useEffect(() => {
    //     const options = {
    //         enableHighAccuracy: true, // cố gắng dùng gps
    //         maximumAge: 1000, // sau 1s đo lại vị trí
    //         timeout: 10000, // tối đa 10s mỗi lần lấy vị trí
    //     };

    //     if (!('geolocation' in navigator)) {
    //         showToast('Trình duyệt không hỗ trợ geolocation', false);
    //         return;
    //     }

    //     watchIdRef.current = navigator.geolocation.watchPosition(
    //         (pos) => {
    //             setPosition(pos);
    //         },
    //         (err) => {
    //             showToast('Lỗi: ' + err.message);
    //         },
    //         options,
    //     );

    //     return () => {
    //         if (watchIdRef.current !== null) {
    //             navigator.geolocation.clearWatch(watchIdRef.current);
    //         }
    //     };
    // }, []);

    // useEffect(() => {
    //     console.log(position);
    // }, [position]);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register', ACCOUNT_ID);

        return () => {
            socketRef.current.off('startRoute');
            socketRef.current.off('endRoute');
            socketRef.current.off('confirmStudent');
            socketRef.current.disconnect();
        };
    }, []);
    useEffect(() => {
        if (waypoints) {
            // console.log('waypoints: ', waypoints);
            socketRef.current.emit('waypoints', { waypoints: waypoints, route_id: route?.route_id });
        }
    }, [waypoints, route]);

    useEffect(() => {
        if (route) handleSendLocation();
    }, [route, routeCoords]);

    useEffect(() => {
        setWaypoints(stops.map((stop) => ({ lat: stop.latitude, lng: stop.longitude })));
    }, [stops]);

    const handleSendLocation = () => {
        if (intervalRef.current) return;

        setIsRunning(true);

        intervalRef.current = setInterval(() => {
            if (currentIndexRef.current >= routeCoords.length) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setIsRunning(false);
                return;
            }

            const loc = routeCoords[currentIndexRef.current];
            console.log(currentIndexRef.current + ':', loc);

            let dis;
            if (stopIndexRef.current < waypoints.length) {
                dis = getDistance(
                    loc.lat,
                    loc.lng,
                    waypoints[stopIndexRef.current].lat,
                    waypoints[stopIndexRef.current].lng,
                );
            }
            if (currentAssignment) {
                socketRef.current.emit('location', {
                    location: loc,
                    route_id: currentAssignment.route_id,
                });

                if (dis < 500) {
                    socketRef.current.emit('nearStop', {
                        message: `Xe số ${currentAssignment.bus_id} còn cách trạm tiếp theo ` + Math.round(dis) + ' m',
                        route_id: route.route_id,
                    });

                    (async () => {
                        const pRes = await axios.get(
                            `http://localhost:5000/api/parents/route_id/${currentAssignment.route_id}`,
                        );
                        const parent = pRes.data;

                        const aRes = await axios.get(`http://localhost:5000/api/accounts/role/1`);

                        const admin = aRes.data;

                        parent.forEach(async (i) => {
                            try {
                                await axios.post('http://localhost:5000/api/notifications/create', {
                                    accountId: i.account_id,
                                    content:
                                        `Xe số ${currentAssignment.bus_id} còn cách trạm tiếp theo: ` +
                                        Math.round(dis) +
                                        ' m',
                                });
                            } catch (error) {
                                console.log(error, 'Lỗi khi thêm notification');
                            }
                        });

                        admin.forEach(async (i) => {
                            try {
                                await axios.post('http://localhost:5000/api/notifications/create', {
                                    accountId: i.account_id,
                                    content:
                                        `Xe số ${currentAssignment.bus_id} còn cách trạm tiếp theo: ` +
                                        Math.round(dis) +
                                        ' m',
                                });
                            } catch (error) {
                                console.log(error, 'Lỗi khi thêm notification');
                            }
                        });
                    })();

                    stopIndexRef.current++;
                }
            }

            currentIndexRef.current++;
        }, 200);
    };

    const pauseTest = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
        }
        // console.log('pause');
    };

    const resumeTest = () => {
        handleSendLocation(); // sẽ tiếp tục từ currentIndexRef hiện tại
        // console.log('resume');
    };

    const stopTest = () => {
        // Dừng interval nếu đang chạy
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Reset trạng thái
        setIsRunning(false);

        currentIndexRef.current = 0; // reset lại điểm bắt đầu
        stopIndexRef.current = 1; // reset waypoint tiếp theo

        socketRef.current.emit('location', {
            location: null,
            route_id: route.route_id,
        });
        socketRef.current.emit('waypoints', { waypoints: [], route_id: route.route_id });
    };

    // Hàm gọi API lấy danh sách học sinh khi một tuyến bắt đầu
    const fetchStudentsForRoute = async (routeId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/students/route/${routeId}`);
            setStudentsOnRoute(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách học sinh:', error);
            setStudentsOnRoute([]); // Xóa danh sách nếu có lỗi
        }
    };

    const fetchAdmin = async () => {
        try {
            const aRes = await axios.get(`http://localhost:5000/api/accounts/role/1`);
            setAdmin(aRes.data);
        } catch (error) {
            console.log(error, 'Lỗi khi lay admin');
        }
    };

    // Lấy tài xế từ account_id
    useEffect(() => {
        fetchDriverByAcountId(ACCOUNT_ID);
        fetchNotifications(ACCOUNT_ID);
        fetchAdmin();
    }, []);

    // Khi driver đã có -> load toàn bộ dữ liệu
    useEffect(() => {
        if (driver) {
            fetchAssignmentByDriverId(driver.driver_id);
        }
    }, [driver]);

    useEffect(() => {
        const runningAssignment = assignments.find((a) => {
            const today = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
            const run_date = new Date(a.run_date).toLocaleDateString('vi-VN').replace(/\//g, '-');
            if (a.status === 'Running' && today === run_date) return true;

            return false;
        });

        if (runningAssignment) {
            fetchStopByRouteId(runningAssignment.route_id);
            fetchStudentsForRoute(runningAssignment.route_id);
            setCurrentAssignment(runningAssignment);
        }
    }, [assignments]);

    useEffect(() => {
        if (currentAssignment && currentAssignment.route_id) {
            fetchRouteByRouteId(currentAssignment?.route_id);
        }
    }, [currentAssignment]);

    useEffect(() => {
        if (route) {
            admin.forEach(async (i) => {
                try {
                    await axios.post('http://localhost:5000/api/notifications/create', {
                        accountId: i.account_id,
                        content: `Tuyến xe ${route.route_name} đã bắt đầu`,
                    });
                } catch (error) {
                    console.log(error, 'Lỗi khi thêm notification');
                }
            });
            socketRef.current.emit('report', `Tuyến xe ${route.route_name} đã bắt đầu`);
        }
    }, [route]);

    // Hàm lấy tài xế theo account_id
    const fetchDriverByAcountId = async (ACCOUNT_ID) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/drivers/by-account/${ACCOUNT_ID}`);
            setDriver(response.data);
        } catch (error) {
            console.error('Lỗi khi tải tài xế:', error);
        }
    };

    // Hàm lấy toàn bộ dữ liệu liên quan tài xế
    const fetchAssignmentByDriverId = async (driverId) => {
        setLoading(true);
        try {
            const assignmentsRes = await axios.get(`http://localhost:5000/api/route_assignments?driver_id=${driverId}`);

            setAssignments(assignmentsRes.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu cho tài xế:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRouteByRouteId = async (route_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/routes/${route_id}`);
            setRoute(response.data);
        } catch (err) {
            console.error('Lỗi fetch routes:', err);
        }
    };

    const handleResetStatusStudent = async () => {
        try {
            const { data } = await axios.put('http://localhost:5000/api/students/status', {
                status: 'Not Started',
            });

            if (data.success) {
                showToast('Xác nhận thành công');
            } else {
                showToast(data.message || 'Xác nhận thất bại', false);
            }
        } catch (error) {
            showToast('Lỗi hệ thống', false);
        }
    };

    // Khi bắt đầu tuyến
    const handleStartRoute = async (assignmentId, routeId) => {
        const runningAssignment = assignments.find((a) => a.status === 'Running');
        if (runningAssignment) {
            showToast('Vui lòng hoàn thành tuyến đã bắt đầu.', false);
            return;
        }

        const stopsData = await fetchStopByRouteId(routeId);
        const firstStopId = stopsData[0].stop_id;

        showConfirm('Bạn có chắc muốn bắt đầu tuyến?', 'Bắt đầu', async () => {
            try {
                const response = await axios.put(`http://localhost:5000/api/route_assignments/start/${assignmentId}`, {
                    status: 'Running',
                    current_stop_id: firstStopId,
                });

                // console.log('routeId: ', routeId);
                socketRef.current.emit('startRoute', { message: 'Tuyến xe đã bắt đầu', route_id: routeId });
                setWaypoints(stopsData.map((stop) => ({ lat: stop.latitude, lng: stop.longitude })));
                setCurrentAssignment(response.data);
                fetchAssignmentByDriverId(driver.driver_id);
                handleResetStatusStudent();
                fetchStudentsForRoute(routeId);
                showToast('Tuyến xe đã bắt đầu chúc bác tài làm việc vui vẻ');
            } catch (error) {
                console.error('Lỗi khi bắt đầu tuyến:', error);
                showToast('Không thể bắt đầu tuyến. Vui lòng thử lại.', false);
            }
        });
    };

    const handleEndRoute = async (assignmentId) => {
        showConfirm('Bạn có chắc muốn kết thúc tuyến ?', 'Kết thúc', async () => {
            try {
                await axios.put(`http://localhost:5000/api/route_assignments/start/${assignmentId}`, {
                    status: 'Completed',
                });

                admin.forEach(async (i) => {
                    try {
                        await axios.post('http://localhost:5000/api/notifications/create', {
                            accountId: i.account_id,
                            content: `Tuyến xe ${route.route_name} đã kết thúc`,
                        });
                    } catch (error) {
                        console.log(error, 'Lỗi khi thêm notification');
                    }
                });
                socketRef.current.emit('endRoute', { message: 'Tuyến xe đã kết thúc', route_id: route?.route_id });
                socketRef.current.emit('report', `Tuyến xe ${route.route_name} đã kết thúc`);
                setCurrentAssignment(null);
                fetchAssignmentByDriverId(driver.driver_id);
                handleResetStatusStudent();
                setStudentsOnRoute([]);
                showToast('Tuyến xe đã kết thúc thành công');
                stopTest();
            } catch (error) {
                console.error('Lỗi khi kết thúc tuyến:', error);
                showToast('Không thể kết thúc tuyến. Vui lòng thử lại.', false);
            }
        });
    };

    const handleConfirmStudent = async (newStatus, student_id, student_name, parent_id) => {
        showConfirm('Xác nhận học sinh đã lên xe', 'Xác nhận', async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/parents/${parent_id}`);
                const account_id = res.data.account_id;

                await axios.post('http://localhost:5000/api/notifications/create', {
                    accountId: account_id,
                    content: `Học sinh ${student_name} đã lên xe`,
                });
            } catch (error) {
                console.log(error, 'Lỗi khi thêm notification');
            }

            admin.forEach(async (i) => {
                try {
                    await axios.post('http://localhost:5000/api/notifications/create', {
                        accountId: i.account_id,
                        content: `Học sinh ${student_name} đã lên xe thuộc tuyến ${route.route_name}`,
                    });
                } catch (error) {
                    console.log(error, 'Lỗi khi thêm notification');
                }
            });

            try {
                const { data } = await axios.put('http://localhost:5000/api/students/status', {
                    status: newStatus,
                    student_id,
                });

                if (data.success) {
                    showToast('Xác nhận thành công');
                    socketRef.current.emit('confirmStudent', {
                        message: `Học sinh ${student_name} đã lên xe`,
                        student_id: student_id,
                    });
                    socketRef.current.emit(
                        'report',
                        `Học sinh ${student_name} đã lên xe thuộc tuyến ${route.route_name}`,
                    );

                    setStudentsOnRoute(
                        //ghi lai thuoc tinh cu va ghi de status
                        (prev) => prev.map((st) => (st.student_id === student_id ? { ...st, status: newStatus } : st)),
                    );
                } else {
                    showToast(data.message || 'Xác nhận thất bại', false);
                }
            } catch (error) {
                showToast('Lỗi hệ thống', false);
            }
        });
    };

    const fetchNotifications = async (ACCOUNT_ID) => {
        const date = new Date().toISOString().split('T')[0];
        try {
            const response = await axios.get(
                `http://localhost:5000/api/notifications?account_id=${ACCOUNT_ID}&date=${date}`,
            );
            setNotifications(response.data);
        } catch (err) {
            console.error('Lỗi fetch notification:', err);
        }
    };

    const fetchStopByRouteId = async (route_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/stops?route_id=${route_id}`);
            setStops(response.data);
            return response.data;
        } catch (err) {
            console.error('Lỗi fetch stops:', err);
        }
    };

    const menus = [
        { name: 'Danh Sách Tuyến Xe', id: 'route-manage', offset: -300 },
        { name: 'Quản Lý Học Sinh', id: 'student-manage', offset: -250 },
        { name: 'Tuyến Xe Đang Thực Hiện', id: 'doing', offset: -200 },
        { name: 'Báo Cáo Sự Cố', id: 'report', offset: -200 },
    ];

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div className={cx('header-position')}>
            <NavMenu menus={menus} role={'Driver'} />
            <div className={cx('content-position')}>
                <RouteManage
                    assignments={assignments}
                    onStartRoute={handleStartRoute}
                    pauseTest={pauseTest}
                    resumeTest={resumeTest}
                />
                <StudentManage students={studentsOnRoute} handleConfirmStudent={handleConfirmStudent} />
                <Doing
                    notifications={notifications}
                    currentAssignment={currentAssignment}
                    handleEndRoute={handleEndRoute}
                    setNotifications={setNotifications}
                />
                <Report driver_name={driver.driver_name} />
            </div>
            {waypoints.length > 0 && (
                <MapContainer style={{ display: 'none' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Routing waypoints={waypoints} setRouteCoords={setRouteCoords} setC={true} />
                </MapContainer>
            )}
        </div>
    );
}

export default DriverContent;
