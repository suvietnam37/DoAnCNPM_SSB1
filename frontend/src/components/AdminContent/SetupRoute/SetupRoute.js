// src/pages/SetupRoute/SetupRoute.js
import styles from './SetupRoute.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function SetupRoute() {
    const [assignments, setAssignments] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [routeId, setRouteId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [busId, setBusId] = useState('');
    const [runDate, setRunDate] = useState('');
    const [status, setStatus] = useState('');
    const [departureTime, setDepartureTime] = useState('');

    // Lấy danh sách phân công tuyến từ API
    const fetchAssignments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/route_assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    // Mở modal
    const handleOpenModal = (type, assignment = null) => {
        setIsOpenModal(type);
        setSelectedAssignment(assignment);
        setRouteId(assignment ? assignment.route_id : '');
        setDriverId(assignment ? assignment.driver_id : '');
        setBusId(assignment ? assignment.bus_id : '');
        setRunDate(assignment ? assignment.run_date : '');
        setStatus(assignment ? assignment.status : '');
        setDepartureTime(assignment ? assignment.departure_time : '');
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedAssignment(null);
        setRouteId('');
        setDriverId('');
        setBusId('');
        setRunDate('');
        setStatus('');
        setDepartureTime('');
    };

    // Thêm phân công tuyến
    const handleAddAssignment = async () => {
        if (!routeId.trim() || !driverId.trim() || !busId.trim() || !runDate.trim() || !status.trim() || !departureTime.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/route_assignments', {
                route_id: routeId,
                driver_id: driverId,
                bus_id: busId,
                run_date: runDate,
                status: status,
                departure_time: departureTime,
            });
            alert('Thêm phân công tuyến thành công!');
            handleCloseModal();
            fetchAssignments();
        } catch (error) {
            console.error('Add assignment error:', error);
            alert('Lỗi khi thêm phân công tuyến.');
        }
    };

    // Sửa phân công tuyến
    const handleEditAssignment = async () => {
        if (!routeId.trim() || !driverId.trim() || !busId.trim() || !runDate.trim() || !status.trim() || !departureTime.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/route_assignments/${selectedAssignment.assignment_id}`, {
                route_id: routeId,
                driver_id: driverId,
                bus_id: busId,
                run_date: runDate,
                status: status,
                departure_time: departureTime,
            });
            alert('Cập nhật phân công tuyến thành công!');
            handleCloseModal();
            fetchAssignments();
        } catch (error) {
            console.error('Edit assignment error:', error);
            alert('Lỗi khi sửa phân công tuyến.');
        }
    };

    // Xóa phân công tuyến
    const handleDeleteAssignment = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/route_assignments/${selectedAssignment.assignment_id}`);
            alert('Xóa phân công tuyến thành công!');
            handleCloseModal();
            fetchAssignments();
        } catch (error) {
            console.error('Delete assignment error:', error);
            alert('Lỗi khi xóa phân công tuyến.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản Lý Phân Tuyến</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Phân tuyến
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã phân công tuyến</th>
                        <th>Thời gian khởi hành</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.assignment_id}>
                            <td>{assignment.assignment_id}</td>
                            <td>{assignment.departure_time}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', assignment)}>
                                    Sửa
                                </button>
                                <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', assignment)}>
                                    Xóa
                                </button>
                            </td>
                            <td>
                                <button className={cx('btn', 'details')} onClick={() => handleOpenModal('details', assignment)}>
                                    ...
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Sửa */}
            {isOpenModal === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Sửa phân công tuyến</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Mã tuyến"
                                className={cx('input')}
                                value={routeId}
                                onChange={(e) => setRouteId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã tài xế"
                                className={cx('input')}
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã xe"
                                className={cx('input')}
                                value={busId}
                                onChange={(e) => setBusId(e.target.value)}
                            />
                            <input
                                type="date"
                                placeholder="Ngày chạy"
                                className={cx('input')}
                                value={runDate}
                                onChange={(e) => setRunDate(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Trạng thái"
                                className={cx('input')}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <input
                                type="time"
                                placeholder="Thời gian khởi hành"
                                className={cx('input')}
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditAssignment}>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Thêm */}
            {isOpenModal === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Phân công tuyến</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Mã tuyến"
                                className={cx('input')}
                                value={routeId}
                                onChange={(e) => setRouteId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã tài xế"
                                className={cx('input')}
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã xe"
                                className={cx('input')}
                                value={busId}
                                onChange={(e) => setBusId(e.target.value)}
                            />
                            <input
                                type="date"
                                placeholder="Ngày chạy"
                                className={cx('input')}
                                value={runDate}
                                onChange={(e) => setRunDate(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Trạng thái"
                                className={cx('input')}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <input
                                type="time"
                                placeholder="Thời gian khởi hành"
                                className={cx('input')}
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddAssignment}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết */}
            {isOpenModal === 'details' && selectedAssignment && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Chi tiết phân công tuyến</h3>
                        <div className={cx('form')}>
                            <input type="text" value={selectedAssignment.assignment_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.route_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.driver_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.bus_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.run_date} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.status} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.departure_time} readOnly className={cx('input')} />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xóa */}
            {isOpenModal === 'delete' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Xác nhận xóa phân công tuyến?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteAssignment}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SetupRoute;