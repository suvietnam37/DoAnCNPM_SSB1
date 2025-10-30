// src/pages/ManageRoute/ManageRoute.js
import styles from './ManageRoute.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageRoute() {
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
            alert('Vui lòng nhập tên tuyến!');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/routes', {
                route_name: routeName,
            });
            alert('Thêm tuyến thành công!');
            handleCloseModal();
            fetchRoutes();
        } catch (error) {
            console.error('Add route error:', error);
            alert('Lỗi khi thêm tuyến.');
        }
    };

    // Sửa tuyến
    const handleEditRoute = async () => {
        if (!routeName.trim()) {
            alert('Vui lòng nhập tên tuyến!');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/routes/${selectedRoute.route_id}`, {
                route_name: routeName,
            });
            alert('Cập nhật tuyến thành công!');
            handleCloseModal();
            fetchRoutes();
        } catch (error) {
            console.error('Edit route error:', error);
            alert('Lỗi khi sửa tuyến.');
        }
    };

    // Xóa tuyến
    const handleDeleteRoute = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/routes/${selectedRoute.route_id}`);
            alert('Xóa tuyến thành công!');
            handleCloseModal();
            fetchRoutes();
        } catch (error) {
            console.error('Delete route error:', error);
            alert('Lỗi khi xóa tuyến.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý tuyến</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm tuyến
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã tuyến</th>
                        <th>Tên tuyến</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route) => (
                        <tr key={route.route_id}>
                            <td>{route.route_id}</td>
                            <td>{route.route_name}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', route)}>
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn', 'danger')}
                                    onClick={() => handleOpenModal('delete', route)}
                                >
                                    Xóa
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

            {/* Modal Sửa */}
            {isOpenModal === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Sửa tuyến</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên tuyến"
                                className={cx('input')}
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditRoute}>
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
                        <h3>Thêm tuyến</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên tuyến"
                                className={cx('input')}
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddRoute}>
                                    Thêm
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
                        <h3>Chi tiết tuyến</h3>
                        <div className={cx('form')}>
                            <div className={cx('form-container')}>
                                <input type="text" value={selectedRoute.route_id} readOnly className={cx('input')} />
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
                        <h3>Xác nhận xóa tuyến?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteRoute}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRoute;
