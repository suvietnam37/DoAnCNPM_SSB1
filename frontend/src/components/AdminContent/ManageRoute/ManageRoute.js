// src/pages/ManageRoute/ManageRoute.js
import styles from './ManageRoute.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function ManageRoute() {
    const { t } = useTranslation();

    const [routes, setRoutes] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [routeName, setRouteName] = useState('');

    // Lấy danh sách tuyến từ API
    const fetchRoutes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/routes');
            setRoutes(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    // Mở modal
    const handleOpenModal = (type, route = null) => {
        setIsOpenModal(type);
        setSelectedRoute(route);
        setRouteName(route ? route.route_name : '');
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedRoute(null);
        setRouteName('');
    };

    // Thêm tuyến
    const handleAddRoute = async () => {
        if (!routeName.trim()) {
            showToast('please_enter_route_name', false);
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/routes', {
                route_name: routeName,
            });
            showToast('add_route_success');
            handleCloseModal();
            fetchRoutes();
        } catch (error) {
            console.error('Add route error:', error);
            showToast('add_route_failed', false);
        }
    };

    // Sửa tuyến
    const handleEditRoute = async () => {
        if (!routeName.trim()) {
            showToast('please_enter_route_name', false);
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/routes/${selectedRoute.route_id}`, {
                route_name: routeName,
            });
            showToast('update_route_success');
            handleCloseModal();
            fetchRoutes();
        } catch (error) {
            console.error('Edit route error:', error);
            showToast('update_route_failed', false);
        }
    };

    // Xóa tuyến
    const handleDeleteRoute = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/routes/${selectedRoute.route_id}`);
            showToast('delete_route_success');
            handleCloseModal();
            fetchRoutes();
        } catch (error) {
            console.error('Delete route error:', error);
            showToast('delete_route_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('route_management')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_route')}
                </button>
            </div>
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('route_id')}</th>
                            <th>{t('route_name')}</th>
                            <th>{t('actions')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route) => (
                            <tr key={route.route_id}>
                                <td>{route.route_id}</td>
                                <td>{route.route_name}</td>
                                <td>
                                    <button
                                        className={cx('btn', 'change')}
                                        onClick={() => handleOpenModal('edit', route)}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        className={cx('btn', 'danger')}
                                        onClick={() => handleOpenModal('delete', route)}
                                    >
                                        {t('delete')}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={cx('btn', 'details')}
                                        onClick={() => handleOpenModal('details', route)}
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
                        <h3>{t('edit_route')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('route_name')}: </label>
                                <input
                                    type="text"
                                    placeholder={t('route_name')}
                                    className={cx('input')}
                                    value={routeName}
                                    onChange={(e) => setRouteName(e.target.value)}
                                />
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditRoute}>
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
                        <h3>{t('add_route')}</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder={t('route_name')}
                                className={cx('input')}
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddRoute}>
                                    {t('add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Chi tiết */}
            {isOpenModal === 'details' && selectedRoute && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>{t('route_details')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('route_id')}: </label>
                                <input type="text" value={selectedRoute.route_id} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('route_name')}: </label>
                                <input type="text" value={selectedRoute.route_name} readOnly className={cx('input')} />
                            </div>
                            {/* Có thể thêm bảng trạm nếu cần */}
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
                        <h3>{t('confirm_delete_route')}</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteRoute}>
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRoute;
