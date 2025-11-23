// src/components/AdminContent/ManageDriver/ManageDriver.js
import styles from './ManageDriver.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function ManageDriver() {
    const { t } = useTranslation();

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
            showToast('loading_driver_failed', false);
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
            showToast('please_enter_driver_name', false);
            return;
        }
        try {
            // Chỉ gửi `driver_name`, không gửi `account_id`
            await axios.post('http://localhost:5000/api/drivers', {
                driver_name: driverName,
            });
            showToast('add_driver_success');
            handleCloseModal();
            fetchDrivers(); // Tải lại danh sách
        } catch (error) {
            console.error('Add driver error:', error);
            showToast('add_driver_failed', false);
        }
    };

    // Sửa tài xế
    const handleEditDriver = async () => {
        if (!driverName.trim()) {
            showToast('please_enter_driver_name', false);
            return;
        }
        try {
            // Chỉ gửi `driver_name`, không gửi `account_id`
            await axios.put(`http://localhost:5000/api/drivers/${selectedDriver.driver_id}`, {
                driver_name: driverName,
            });
            showToast('update_driver_success');
            handleCloseModal();
            fetchDrivers(); // Tải lại danh sách
        } catch (error) {
            console.error('Edit driver error:', error);
            showToast('update_driver_failed', false);
        }
    };

    // Xóa tài xế
    const handleDeleteDriver = async () => {
        try {
            // Gọi đến API xóa mềm
            await axios.delete(`http://localhost:5000/api/drivers/${selectedDriver.driver_id}`);
            showToast('delete_driver_success');
            handleCloseModal();
            fetchDrivers(); // Tải lại danh sách
        } catch (error) {
            console.error('Delete driver error:', error);
            showToast('delete_driver_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('driver_management')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_driver')}
                </button>
            </div>
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('driver_id')}</th>
                            <th>{t('driver_name')}</th>
                            <th>{t('actions')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.driver_id}>
                                <td>{driver.driver_id}</td>
                                <td>{driver.driver_name}</td>
                                <td>
                                    <button
                                        className={cx('btn', 'change')}
                                        onClick={() => handleOpenModal('edit', driver)}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        className={cx('btn', 'danger')}
                                        onClick={() => handleOpenModal('delete', driver)}
                                    >
                                        {t('delete')}
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
                        <h3>{t('edit_driver')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('driver_name')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('driver_name')}
                                    className={cx('input')}
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                />
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditDriver}>
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
                        <h3>{t('add_driver')}</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder={t('driver_name')}
                                className={cx('input')}
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddDriver}>
                                    {t('add')}
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
                        <h3>{t('driver_detail')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('driver_id')}: </label>
                                <input type="text" value={selectedDriver.driver_id} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('driver_name')}: </label>
                                <input
                                    type="text"
                                    value={selectedDriver.driver_name}
                                    readOnly
                                    className={cx('input')}
                                />
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
                        <h3>{t('confirm_delete_driver')} ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteDriver}>
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageDriver;
