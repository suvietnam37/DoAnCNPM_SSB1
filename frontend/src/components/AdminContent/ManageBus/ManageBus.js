import styles from './ManageBus.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function ManageBus() {
    const { t } = useTranslation();

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
            showToast('please_enter_license_plate', false);
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/buses', {
                license_plate: licensePlate,
            });
            showToast('add_bus_success');
            handleCloseModal();
            fetchBuses();
        } catch (error) {
            console.error('Add bus error:', error);
            showToast('add_bus_failed', false);
        }
    };

    // Sửa xe
    const handleEditBus = async () => {
        if (!licensePlate.trim()) {
            showToast('please_enter_license_plate', false);
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/buses/${selectedBus.bus_id}`, {
                license_plate: licensePlate,
            });
            showToast('update_bus_success');
            handleCloseModal();
            fetchBuses();
        } catch (error) {
            console.error('Edit bus error:', error);
            showToast('update_bus_failed', false);
        }
    };

    // Xóa xe
    const handleDeleteBus = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/buses/${selectedBus.bus_id}`);
            showToast('delete_bus_success');
            handleCloseModal();
            fetchBuses();
        } catch (error) {
            console.error('Delete bus error:', error);
            showToast('delete_bus_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('manage_bus')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_bus')}
                </button>
            </div>

            {/* Bảng danh sách xe */}
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('bus_id')}</th>
                            <th>{t('license_plate')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buses.map((bus) => (
                            <tr key={bus.bus_id}>
                                <td>{bus.bus_id}</td>
                                <td>{bus.license_plate}</td>
                                <td>
                                    <button
                                        className={cx('btn', 'change')}
                                        onClick={() => handleOpenModal('edit', bus)}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        className={cx('btn', 'danger')}
                                        onClick={() => handleOpenModal('delete', bus)}
                                    >
                                        {t('delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Sửa */}
            {isOpenModal === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>{t('edit_bus')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('license_plate')}:</label>
                                <input
                                    type="text"
                                    placeholder={t('license_plate')}
                                    className={cx('input')}
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                />
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditBus}>
                                    {t('update')}
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
                        <h3>{t('add_bus')}</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder={t('license_plate')}
                                className={cx('input')}
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddBus}>
                                    {t('add')}
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
                        <h3>{t('confirm_delete_bus')}</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteBus}>
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageBus;
