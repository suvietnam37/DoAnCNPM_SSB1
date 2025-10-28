// src/components/AdminContent/SetupRoute/SetupRoute.js
import styles from './SetupRoute.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function SetupRoute() {
    const [assignments, setAssignments] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [buses, setBuses] = useState([]);

    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const [routeId, setRouteId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [busId, setBusId] = useState('');
    const [runDate, setRunDate] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [departureTime, setDepartureTime] = useState('');

    const fetchData = async () => {
        try {
            const [assignRes, routesRes, driversRes, busesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/route_assignments'),
                axios.get('http://localhost:5000/api/routes'),
                axios.get('http://localhost:5000/api/drivers'),
                axios.get('http://localhost:5000/api/buses'),
            ]);
            setAssignments(assignRes.data);
            setRoutes(routesRes.data);
            setDrivers(driversRes.data);
            setBuses(busesRes.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phân công:', error);
            showToast('Không thể tải dữ liệu của trang.', false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetFormState = () => {
        setRouteId('');
        setDriverId('');
        setBusId('');
        setRunDate('');
        setStatus('Not Started');
        setDepartureTime('');
        setSelectedAssignment(null);
    };

    const handleOpenModal = (type, assignment = null) => {
        resetFormState();
        setIsOpenModal(type);
        if (assignment) {
            setSelectedAssignment(assignment);
            if (type === 'edit') {
                setRouteId(assignment.route_id);
                setDriverId(assignment.driver_id);
                setBusId(assignment.bus_id);
                setRunDate(assignment.run_date ? new Date(assignment.run_date).toISOString().split('T')[0] : '');
                setStatus(assignment.status);
                setDepartureTime(assignment.departure_time);
            }
        }
    };

    const handleCloseModal = () => {
        setIsOpenModal('');
        resetFormState();
    };

    const validateForm = () => {
        return routeId && driverId && busId && runDate && departureTime;
    };

    const handleAddAssignment = async () => {
        if (!validateForm()) {
            showToast('Vui lòng điền đầy đủ thông tin!', false);
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
            showToast('Thêm phân công tuyến thành công!', true);
            handleCloseModal();
            fetchData();
        } catch (error) {
            showToast('Lỗi khi thêm phân công tuyến.', false);
        }
    };

    const handleEditAssignment = async () => {
        if (!validateForm()) {
            showToast('Vui lòng điền đầy đủ thông tin!', false);
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
            showToast('Cập nhật phân công thành công!', true);
            handleCloseModal();
            fetchData();
        } catch (error) {
            showToast('Lỗi khi cập nhật phân công.', false);
        }
    };

    const handleDeleteAssignment = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/route_assignments/${selectedAssignment.assignment_id}`);
            showToast('Xóa phân công thành công!', true);
            handleCloseModal();
            fetchData();
        } catch (error) {
            showToast('Lỗi khi xóa phân công.', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản Lý Phân Công Tuyến</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm Phân Công
                </button>
            </div>

            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã PC</th>
                        <th>Ngày Chạy</th>
                        <th>Giờ Khởi Hành</th>
                        <th>Tên Tuyến</th>
                        <th>Tên Tài Xế</th>
                        <th>Biển Số Xe</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                        <th>Chi Tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => {
                        const route = routes.find(r => r.route_id === assignment.route_id);
                        const driver = drivers.find(d => d.driver_id === assignment.driver_id);
                        const bus = buses.find(b => b.bus_id === assignment.bus_id);

                        return (
                            <tr key={assignment.assignment_id}>
                                <td>{assignment.assignment_id}</td>
                                <td>{new Date(assignment.run_date).toLocaleDateString('vi-VN')}</td>
                                <td>{assignment.departure_time}</td>
                                <td>{route ? route.route_name : `(ID: ${assignment.route_id})`}</td>
                                <td>{driver ? driver.driver_name : `(ID: ${assignment.driver_id})`}</td>
                                <td>{bus ? bus.license_plate : `(ID: ${assignment.bus_id})`}</td>
                                <td>{assignment.status}</td>
                                <td>
                                    <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', assignment)}>Sửa</button>
                                    <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', assignment)}>Xóa</button>
                                </td>
                                <td>
                                    <button className={cx('btn', 'details')} onClick={() => handleOpenModal('details', assignment)}>...</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* MODAL THÊM & SỬA */}
            {(isOpenModal === 'add' || isOpenModal === 'edit') && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h3>{isOpenModal === 'add' ? 'Thêm Phân Công Mới' : 'Sửa Phân Công'}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>

                        <div className={cx('form')}>
                            <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                                <option value="">-- Chọn tuyến xe --</option>
                                {routes.map(r => (
                                    <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
                                ))}
                            </select>

                            <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
                                <option value="">-- Chọn tài xế --</option>
                                {drivers.map(d => (
                                    <option key={d.driver_id} value={d.driver_id}>{d.driver_name}</option>
                                ))}
                            </select>

                            <select value={busId} onChange={(e) => setBusId(e.target.value)}>
                                <option value="">-- Chọn xe bus --</option>
                                {buses.map(b => (
                                    <option key={b.bus_id} value={b.bus_id}>{b.license_plate}</option>
                                ))}
                            </select>

                            <input type="date" value={runDate} onChange={(e) => setRunDate(e.target.value)} />
                            <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />

                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Not Started">Chưa bắt đầu</option>
                                <option value="Running">Đang chạy</option>
                                <option value="Completed">Hoàn thành</option>
                            </select>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={isOpenModal === 'add' ? handleAddAssignment : handleEditAssignment}>
                                    {isOpenModal === 'add' ? 'Thêm Mới' : 'Cập Nhật'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT */}
            {isOpenModal === 'details' && selectedAssignment && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content', 'modal-content-details')}>
                        <div className={cx('modal-header')}>
                            <h3>Chi Tiết Phân Công</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>
                        <div className={cx('form')}>
                            <input type="text" value={selectedAssignment.assignment_id} readOnly className={cx('input')} />
                            <input type="text" value={new Date(selectedAssignment.run_date).toLocaleDateString('vi-VN')} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.departure_time} readOnly className={cx('input')} />
                            <input type="text" value={routes.find(r => r.route_id === selectedAssignment.route_id)?.route_name || 'N/A'} readOnly className={cx('input')} />
                            <input type="text" value={drivers.find(d => d.driver_id === selectedAssignment.driver_id)?.driver_name || 'N/A'} readOnly className={cx('input')} />
                            <input type="text" value={buses.find(b => b.bus_id === selectedAssignment.bus_id)?.license_plate || 'N/A'} readOnly className={cx('input')} />
                            <input type="text" value={selectedAssignment.status} readOnly className={cx('input')} />
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {isOpenModal === 'delete' && selectedAssignment && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h3>Xác nhận xóa</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>
                        <p>Bạn có chắc chắn muốn xóa phân công này không?</p>
                        <div className={cx('buttons')}>
                            <button className={cx('btn', 'cancel')} onClick={handleCloseModal}>Hủy</button>
                            <button className={cx('btn', 'danger')} onClick={handleDeleteAssignment}>Xác nhận Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SetupRoute;