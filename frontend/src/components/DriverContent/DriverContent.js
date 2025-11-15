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

    const route1 = [
        { lat: 10.762622, lng: 106.682199 },
        { lat: 10.764015, lng: 106.682646 },
        { lat: 10.765408, lng: 106.683093 },
        { lat: 10.766801, lng: 106.683539 },
        { lat: 10.768194, lng: 106.683985 },
        { lat: 10.769587, lng: 106.684432 },
        { lat: 10.77098, lng: 106.684878 },
        { lat: 10.772373, lng: 106.685324 },
        { lat: 10.773766, lng: 106.685771 },
        { lat: 10.775159, lng: 106.686217 },
        { lat: 10.776552, lng: 106.686664 },
        { lat: 10.777945, lng: 106.68711 },
        { lat: 10.779338, lng: 106.687556 },
        { lat: 10.780731, lng: 106.688003 },
        { lat: 10.782124, lng: 106.688449 },
        { lat: 10.783517, lng: 106.688896 },
        { lat: 10.78491, lng: 106.689342 },
        { lat: 10.786303, lng: 106.689788 },
        { lat: 10.787696, lng: 106.690235 },
        { lat: 10.789089, lng: 106.690681 },
        { lat: 10.790482, lng: 106.691128 },
        { lat: 10.791875, lng: 106.691574 },
        { lat: 10.793268, lng: 106.69202 },
        { lat: 10.794661, lng: 106.692467 },
        { lat: 10.796054, lng: 106.692913 },
        { lat: 10.797447, lng: 106.693359 },
        { lat: 10.79884, lng: 106.693806 },
        { lat: 10.800233, lng: 106.694252 },
        { lat: 10.801626, lng: 106.694699 },
        { lat: 10.803019, lng: 106.695145 },
        { lat: 10.804412, lng: 106.695591 },
        { lat: 10.805805, lng: 106.696038 },
        { lat: 10.807198, lng: 106.696484 },
        { lat: 10.808591, lng: 106.696931 },
        { lat: 10.809984, lng: 106.697377 },
        { lat: 10.811377, lng: 106.697823 },
        { lat: 10.81277, lng: 106.69827 },
        { lat: 10.814163, lng: 106.698716 },
        { lat: 10.815556, lng: 106.699162 },
        { lat: 10.816949, lng: 106.699609 },
        { lat: 10.818342, lng: 106.700055 },
        { lat: 10.819735, lng: 106.700501 },
        { lat: 10.821128, lng: 106.700948 },
        { lat: 10.822521, lng: 106.701394 },
        { lat: 10.823099, lng: 106.693221 }, // Bến xe Miền Đông
        { lat: 10.812, lng: 106.68 }, // ví dụ điểm trung gian về Công viên Hoàng Văn Thụ
        { lat: 10.8016, lng: 106.6648 }, // Công viên Hoàng Văn Thụ
        { lat: 10.782, lng: 106.672 }, // ví dụ điểm trung gian quay về ĐH Sài Gòn
        { lat: 10.762622, lng: 106.682199 }, // Quay lại Trường ĐH Sài Gòn
    ];

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

    // useEffect(() => {
    //     if (route) handleSendLocation();
    // }, [route]);

    const handleSendLocation = () => {
        let i = 0;
        const interval = setInterval(() => {
            console.log(i + ': ' + route1[i]);
            socketRef.current.emit('location', { location: route1[i], route_id: route.route_id });

            i++;
            if (i >= route1.length) {
                clearInterval(interval);
            }
        }, 1000);
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
            fetchStudentsForRoute(runningAssignment.route_id);
            setCurrentAssignment(runningAssignment);
        }
    }, [assignments]);

    useEffect(() => {
        if (currentAssignment) {
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

        const firstStopId = await fetchStopByRouteId(routeId);

        showConfirm('Bạn có chắc muốn bắt đầu tuyến?', 'Bắt đầu', async () => {
            try {
                const response = await axios.put(`http://localhost:5000/api/route_assignments/start/${assignmentId}`, {
                    status: 'Running',
                    current_stop_id: firstStopId,
                });

                socketRef.current.emit('startRoute', 'Tuyến xe đã bắt đầu');
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
                socketRef.current.emit('endRoute', 'Tuyến xe đã kết thúc');
                socketRef.current.emit('report', `Tuyến xe ${route.route_name} đã kết thúc`);
                setCurrentAssignment(null);
                fetchAssignmentByDriverId(driver.driver_id);
                handleResetStatusStudent();
                setStudentsOnRoute([]);
                showToast('Tuyến xe đã kết thúc thành công');
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
            return response.data[0].stop_id;
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
                <RouteManage assignments={assignments} onStartRoute={handleStartRoute} />
                <StudentManage students={studentsOnRoute} handleConfirmStudent={handleConfirmStudent} />
                <Doing
                    notifications={notifications}
                    currentAssignment={currentAssignment}
                    handleEndRoute={handleEndRoute}
                    setNotifications={setNotifications}
                />
                <Report driver_name={driver.driver_name} />
            </div>
        </div>
    );
}

export default DriverContent;
