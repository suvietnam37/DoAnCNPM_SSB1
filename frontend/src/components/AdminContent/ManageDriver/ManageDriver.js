// src/components/AdminContent/ManageDriver/ManageDriver.js
import styles from './ManageDriver.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function ManageDriver() {
    const [drivers, setDrivers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverName, setDriverName] = useState('');

    // Lấy danh sách tài xế từ API
    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            showToast('Không thể tải danh sách tài xế.', false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    // Mở modal
    const handleOpenModal = (type, driver = null) => {
        setIsOpenModal(type);
        setSelectedDriver(driver);
        setDriverName(driver ? driver.driver_name : '');
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedDriver(null);
        setDriverName('');
    };

    // Thêm tài xế
    const handleAddDriver = async () => {
        if (!driverName.trim()) {
            alert('Vui lòng nhập tên tài xế!');
            return;
        }
        try {
            // Chỉ gửi `driver_name`, không gửi `account_id`
            await axios.post('http://localhost:5000/api/drivers', {
                driver_name: driverName,
            });
            showToast('Thêm tài xế thành công!', true);
            handleCloseModal();
            fetchDrivers(); // Tải lại danh sách
        } catch (error) {
            console.error('Add driver error:', error);
            showToast('Lỗi khi thêm tài xế.', false);
        }
    };

    // Sửa tài xế
    const handleEditDriver = async () => {
        if (!driverName.trim()) {
            alert('Vui lòng nhập tên tài xế!');
            return;
        }
        try {
            // Chỉ gửi `driver_name`, không gửi `account_id`
            await axios.put(`http://localhost:5000/api/drivers/${selectedDriver.driver_id}`, {
                driver_name: driverName,
            });
            showToast('Cập nhật tài xế thành công!', true);
            handleCloseModal();
            fetchDrivers(); // Tải lại danh sách
        } catch (error) {
            console.error('Edit driver error:', error);
            showToast('Lỗi khi sửa tài xế.', false);
        }
    };

    // Xóa tài xế
    const handleDeleteDriver = async () => {
        try {
            // Gọi đến API xóa mềm
            await axios.delete(`http://localhost:5000/api/drivers/${selectedDriver.driver_id}`);
            showToast('Xóa tài xế thành công!', true);
            handleCloseModal();
            fetchDrivers(); // Tải lại danh sách
        } catch (error) {
            console.error('Delete driver error:', error);
            showToast('Lỗi khi xóa tài xế.', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý tài xế</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm tài xế
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã tài xế</th>
                        <th>Tên tài xế</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver) => (
                        <tr key={driver.driver_id}>
                            <td>{driver.driver_id}</td>
                            <td>{driver.driver_name}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', driver)}>
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn', 'danger')}
                                    onClick={() => handleOpenModal('delete', driver)}
                                >
                                    Xóa
                                </button>
                            </td>
                            <td>
                                <button
                                    className={cx('btn', 'details')}
                                    onClick={() => handleOpenModal('details', driver)}
                                >
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
                        <h3>Sửa tài xế</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên tài xế"
                                className={cx('input')}
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditDriver}>
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
                        <h3>Thêm tài xế</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên tài xế"
                                className={cx('input')}
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddDriver}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết */}
            {isOpenModal === 'details' && selectedDriver && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Chi tiết tài xế</h3>
                        <div className={cx('form')}>
                            <input type="text" value={selectedDriver.driver_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedDriver.driver_name} readOnly className={cx('input')} />
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
                        <h3>Xác nhận xóa tài xế?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteDriver}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageDriver;
