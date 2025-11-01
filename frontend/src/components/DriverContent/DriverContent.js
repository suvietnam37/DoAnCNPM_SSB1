// frontend/src/components/DriverContent/DriverContent.js
import { useState, useEffect, useContext, use } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './DriverContent.module.scss';
import RouteManage from './RouteManage/RouteManage';
import StudentManage from './StudentManage/StudentManage';
import Doing from './Doing/Doing';
import Report from './Report/Report';
import showToast from '../../untils/ShowToast/showToast';
import { AuthContext } from '../../context/auth.context';

const cx = classNames.bind(styles);

// Giả định ID của tài xế đã đăng nhập

function DriverContent() {
    const authContext = useContext(AuthContext);
    const ACCOUNT_ID = authContext.auth.user.account_id;

    // State quản lý toàn bộ dữ liệu cho trang Driver
    const [assignments, setAssignments] = useState([]);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [studentsOnRoute, setStudentsOnRoute] = useState([]);
    const [loading, setLoading] = useState(true);
    const [driver, setDriver] = useState(null);

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

    // Lấy tài xế từ account_id
    useEffect(() => {
        fetchDriverByAcountId(ACCOUNT_ID);
    }, []);

    // Khi driver đã có -> load toàn bộ dữ liệu
    useEffect(() => {
        if (driver) {
            fetchDriverData(driver.driver_id);
        }
    }, [driver]);

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
    const fetchDriverData = async (driverId) => {
        setLoading(true);
        try {
            const [assignmentsRes, currentAssignmentRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/route_assignments?driver_id=${driverId}`),
                axios.get(`http://localhost:5000/api/route_assignments/current?driver_id=${driverId}`),
            ]);

            setAssignments(assignmentsRes.data);
            setCurrentAssignment(currentAssignmentRes.data);

            if (currentAssignmentRes.data) {
                fetchStudentsForRoute(currentAssignmentRes.data.route_id);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu cho tài xế:', error);
        } finally {
            setLoading(false);
        }
    };

    // Khi bắt đầu tuyến
    const handleStartRoute = async (assignmentId, routeId) => {
        const runningAssignment = assignments.find((a) => a.status === 'Running');
        if (runningAssignment) {
            showToast('Vui lòng hoàn thành tuyến đã bắt đầu.', false);
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/api/route_assignments/start/${assignmentId}`, {
                status: 'Running',
            });
            if (response) {
                fetchDriverData(driver.driver_id);
                fetchStudentsForRoute(routeId);
                showToast('Tuyến xe đã bắt đầu chúc bác tài làm việc vui vẻ');
            }
        } catch (error) {
            console.error('Lỗi khi bắt đầu tuyến:', error);
            showToast('Không thể bắt đầu tuyến. Vui lòng thử lại.', false);
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
                {/* Truyền dữ liệu và hàm xử lý xuống component con */}
                <RouteManage assignments={assignments} onStartRoute={handleStartRoute} />
                <StudentManage students={studentsOnRoute} />
                <Doing currentAssignment={currentAssignment} />
                <Report />
            </div>
        </div>
    );
}

export default DriverContent;
