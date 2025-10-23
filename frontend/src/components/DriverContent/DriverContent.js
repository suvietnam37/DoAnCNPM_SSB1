// frontend/src/components/DriverContent/DriverContent.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu/NavMenu';
import classNames from 'classnames/bind';
import styles from './DriverContent.module.scss';
import RouteManage from './RouteManage/RouteManage';
import StudentManage from './StudentManage/StudentManage';
import Doing from './Doing/Doing';
import Report from './Report/Report';

const cx = classNames.bind(styles);

// Giả định ID của tài xế đã đăng nhập
const LOGGED_IN_DRIVER_ID = 1;

function DriverContent() {
    // State quản lý toàn bộ dữ liệu cho trang Driver
    const [assignments, setAssignments] = useState([]);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [studentsOnRoute, setStudentsOnRoute] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Hàm để tài xế bắt đầu một tuyến
    const handleStartRoute = async (assignmentId, routeId) => {
        try {
            // 1. Cập nhật trạng thái của assignment thành 'Running'
            await axios.put(`http://localhost:5000/api/route_assignments/${assignmentId}`, {
                status: 'Running',
                // Cần gửi lại đủ các trường khác hoặc để backend tự xử lý
            });

            // 2. Tải lại dữ liệu
            fetchDriverData();
            
            // 3. Tải danh sách học sinh cho tuyến đó
            fetchStudentsForRoute(routeId);

        } catch (error) {
            console.error("Lỗi khi bắt đầu tuyến:", error);
            alert("Không thể bắt đầu tuyến. Vui lòng thử lại.");
        }
    };
    
    // Hàm để tải tất cả dữ liệu ban đầu
    const fetchDriverData = async () => {
        setLoading(true);
        try {
            const [assignmentsRes, currentAssignmentRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/route_assignments?driver_id=${LOGGED_IN_DRIVER_ID}`),
                axios.get(`http://localhost:5000/api/route_assignments/current?driver_id=${LOGGED_IN_DRIVER_ID}`),
            ]);

            setAssignments(assignmentsRes.data);
            setCurrentAssignment(currentAssignmentRes.data);

            // Nếu đã có tuyến đang chạy, tải luôn danh sách học sinh
            if (currentAssignmentRes.data) {
                fetchStudentsForRoute(currentAssignmentRes.data.route_id);
            }

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu cho tài xế:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDriverData();
    }, []);


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