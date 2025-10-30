import styles from './ManageBus.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function ManageBus() {
    const [buses, setBuses] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedBus, setSelectedBus] = useState(null);
    const [licensePlate, setLicensePlate] = useState('');

    // Lấy danh sách xe từ API
    const fetchBuses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/buses');
            setBuses(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    // Mở modal
    const handleOpenModal = (type, bus = null) => {
        setIsOpenModal(type);
        setSelectedBus(bus);
        setLicensePlate(bus ? bus.license_plate : '');
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedBus(null);
        setLicensePlate('');
    };

    // Thêm xe
    const handleAddBus = async () => {
        if (!licensePlate.trim()) {
            showToast('Vui lòng nhập biển số xe!', false);
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/buses', {
                license_plate: licensePlate,
            });
            showToast('Thêm xe thành công!');
            handleCloseModal();
            fetchBuses();
        } catch (error) {
            console.error('Add bus error:', error);
            showToast('Lỗi khi thêm xe.', false);
        }
    };

    // Sửa xe
    const handleEditBus = async () => {
        if (!licensePlate.trim()) {
            showToast('Vui lòng nhập biển số xe!', false);
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/buses/${selectedBus.bus_id}`, {
                license_plate: licensePlate,
            });
            showToast('Cập nhật xe thành công!');
            handleCloseModal();
            fetchBuses();
        } catch (error) {
            console.error('Edit bus error:', error);
            showToast('Lỗi khi sửa xe.', false);
        }
    };

    // Xóa xe
    const handleDeleteBus = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/buses/${selectedBus.bus_id}`);
            showToast('Xóa xe thành công!');
            handleCloseModal();
            fetchBuses();
        } catch (error) {
            console.error('Delete bus error:', error);
            showToast('Lỗi khi xóa xe.', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý xe</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm xe
                </button>
            </div>

            {/* Bảng danh sách xe */}
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Số xe</th>
                        <th>Biển số</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {buses.map((bus) => (
                        <tr key={bus.bus_id}>
                            <td>{bus.bus_id}</td>
                            <td>{bus.license_plate}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', bus)}>
                                    Sửa
                                </button>
                                <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', bus)}>
                                    Xóa
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
                        <h3>Sửa thông tin xe</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>Tên tài xế: </label>
                                <input
                                    type="text"
                                    placeholder="Biển số xe"
                                    className={cx('input')}
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                />
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditBus}>
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
                        <h3>Thêm xe</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Biển số xe"
                                className={cx('input')}
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddBus}>
                                    Thêm
                                </button>
                            </div>
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
                        <h3>Xác nhận xóa xe?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteBus}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageBus;
