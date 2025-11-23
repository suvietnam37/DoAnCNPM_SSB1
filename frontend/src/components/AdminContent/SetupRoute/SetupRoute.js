// src/components/AdminContent/SetupRoute/SetupRoute.js
import styles from './SetupRoute.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function SetupRoute() {
    const { t } = useTranslation();

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

    // Fetch dữ liệu
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
            showToast('load_assignment_data_failed', false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Reset form về mặc định
    const resetFormState = () => {
        setRouteId('');
        setDriverId('');
        setBusId('');
        setRunDate('');
        setStatus('Not Started');
        setDepartureTime('');
        setSelectedAssignment(null);
    };

    // Mở modal (add, edit, delete, details)
    const handleOpenModal = (type, assignment = null) => {
        resetFormState();
        setIsOpenModal(type);
        if (assignment) {
            setSelectedAssignment(assignment);
            if (type === 'edit') {
                setRouteId(assignment.route_id);
                setDriverId(assignment.driver_id);
                setBusId(assignment.bus_id);
                setRunDate(assignment.run_date || '');
                setStatus(assignment.status);
                setDepartureTime(assignment.departure_time);
            }
        }
    };

    const handleCloseModal = () => {
        setIsOpenModal('');
        resetFormState();
    };

    // Kiểm tra form hợp lệ
    const validateForm = () => {
        return routeId && driverId && busId && runDate && departureTime;
    };

    // Thêm mới
    const handleAddAssignment = async () => {
        if (!validateForm()) {
            showToast('please_fill_all_info', false);
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/route_assignments', {
                route_id: routeId,
                driver_id: driverId,
                bus_id: busId,
                run_date: runDate,
                status: 'Not Started', // Luôn mặc định là "Not Started"
                departure_time: departureTime,
            });
            showToast('add_assignment_success');
            handleCloseModal();
            fetchData();
        } catch (error) {
            showToast('add_assignment_failed', false);
        }
    };

    // Sửa phân công
    const handleEditAssignment = async () => {
        if (!validateForm()) {
            showToast('please_fill_all_info', false);
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
            showToast('update_assignment_success');
            handleCloseModal();
            fetchData();
        } catch (error) {
            showToast('update_assignment_failed', false);
        }
    };

    // Xóa phân công
    const handleDeleteAssignment = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/route_assignments/${selectedAssignment.assignment_id}`);
            showToast('delete_assignment_success');
            handleCloseModal();
            fetchData();
        } catch (error) {
            showToast('delete_assignment_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('assignment_management')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_assignment')}
                </button>
            </div>
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('assignment_id')}</th>
                            <th>{t('run_date')}</th>
                            <th>{t('route_name')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => {
                            const route = routes.find((r) => r.route_id === assignment.route_id);
                            const driver = drivers.find((d) => d.driver_id === assignment.driver_id);
                            const bus = buses.find((b) => b.bus_id === assignment.bus_id);

                            return (
                                <tr key={assignment.assignment_id}>
                                    <td>{assignment.assignment_id}</td>
                                    <td>{new Date(assignment.run_date).toLocaleDateString('vi-VN')}</td>
                                    <td>{route ? route.route_name : `(ID: ${assignment.route_id})`}</td>
                                    <td>
                                        {assignment.status === 'Running'
                                            ? t('Running')
                                            : assignment.status === 'Not Started'
                                            ? t('NotStarted')
                                            : t('Completed')}
                                    </td>
                                    <td>
                                        <button
                                            className={cx('btn', 'change')}
                                            onClick={() => handleOpenModal('edit', assignment)}
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            className={cx('btn', 'danger')}
                                            onClick={() => handleOpenModal('delete', assignment)}
                                        >
                                            {t('delete')}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={cx('btn', 'details')}
                                            onClick={() => handleOpenModal('details', assignment)}
                                        >
                                            ...
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* MODAL THÊM & SỬA */}
            {isOpenModal === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h3>{t('add_assignment')}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>

                        <div className={cx('form')}>
                            <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                                <option value="">{t('select_route')}</option>
                                {routes.map((r) => (
                                    <option key={r.route_id} value={r.route_id}>
                                        {r.route_name}
                                    </option>
                                ))}
                            </select>

                            <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
                                <option value="">{t('Driver')}</option>
                                {drivers.map((d) => (
                                    <option key={d.driver_id} value={d.driver_id}>
                                        {d.driver_name}
                                    </option>
                                ))}
                            </select>

                            <select value={busId} onChange={(e) => setBusId(e.target.value)}>
                                <option value="">{t('manage_bus')}</option>
                                {buses.map((b) => (
                                    <option key={b.bus_id} value={b.bus_id}>
                                        {b.license_plate}
                                    </option>
                                ))}
                            </select>

                            <input type="text" value={t('no_trip_started')} readOnly />

                            <input type="date" value={runDate} onChange={(e) => setRunDate(e.target.value)} />
                            <input
                                type="time"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                            />

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={() => handleAddAssignment()}>
                                    {t('add_assignment')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpenModal === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h3>{t('edit_assignment')}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>

                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('route')}: </label>
                                <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                                    <option value="">{t('select_route')}</option>
                                    {routes.map((r) => (
                                        <option key={r.route_id} value={r.route_id}>
                                            {r.route_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={cx('flex-input')}>
                                <label>{t('Driver')}: </label>
                                <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
                                    <option value="">{t('Driver')}</option>
                                    {drivers.map((d) => (
                                        <option key={d.driver_id} value={d.driver_id}>
                                            {d.driver_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={cx('flex-input')}>
                                <label>{t('manage_bus')}: </label>
                                <select value={busId} onChange={(e) => setBusId(e.target.value)}>
                                    <option value="">{t('manage_bus')}</option>
                                    {buses.map((b) => (
                                        <option key={b.bus_id} value={b.bus_id}>
                                            {b.license_plate}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={cx('flex-input')}>
                                <label>{t('run_date')}: </label>
                                <input type="date" value={runDate} onChange={(e) => setRunDate(e.target.value)} />
                            </div>

                            <div className={cx('flex-input')}>
                                <label>{t('departure_time')}: </label>
                                <input
                                    type="time"
                                    value={departureTime}
                                    onChange={(e) => setDepartureTime(e.target.value)}
                                />
                            </div>

                            <div className={cx('flex-input')}>
                                <label>{t('status')}: </label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Not Started">{t('no_trip_started')}</option>
                                    <option value="Running">{t('in_progress')}</option>
                                    <option value="Completed">{t('completed')}</option>
                                </select>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={() => handleEditAssignment()}>
                                    {t('update')}
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
                            <h3>{t('assignment_details_title')}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                {t('close')}
                            </button>
                        </div>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('assignment_id_label')}: </label>
                                <input
                                    type="text"
                                    value={selectedAssignment.assignment_id}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('run_date')}: </label>
                                <input
                                    type="text"
                                    value={new Date(selectedAssignment.run_date).toLocaleDateString('vi-VN')}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('departure_time')}: </label>
                                <input
                                    type="text"
                                    value={selectedAssignment.departure_time}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('route')}: </label>
                                <input
                                    type="text"
                                    value={
                                        routes.find((r) => r.route_id === selectedAssignment.route_id)?.route_name ||
                                        'N/A'
                                    }
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('Driver')}: </label>
                                <input
                                    type="text"
                                    value={
                                        drivers.find((d) => d.driver_id === selectedAssignment.driver_id)
                                            ?.driver_name || 'N/A'
                                    }
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('manage_bus')}: </label>
                                <input
                                    type="text"
                                    value={
                                        buses.find((b) => b.bus_id === selectedAssignment.bus_id)?.license_plate ||
                                        'N/A'
                                    }
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('status')}: </label>
                                <input type="text" value={selectedAssignment.status} readOnly className={cx('input')} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {isOpenModal === 'delete' && selectedAssignment && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h3>{t('confirm_delete_title')}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                {t('close')}
                            </button>
                        </div>
                        <p>{t('confirm_delete_message_assignment')}</p>
                        <div className={cx('buttons')}>
                            <button className={cx('btn', 'cancel')} onClick={handleCloseModal}>
                                {t('cancel')}
                            </button>
                            <button className={cx('btn', 'danger')} onClick={handleDeleteAssignment}>
                                {t('confirm_delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SetupRoute;
