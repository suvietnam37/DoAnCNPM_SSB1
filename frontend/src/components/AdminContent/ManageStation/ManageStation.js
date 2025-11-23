// src/pages/ManageStation/ManageStation.js
import styles from './ManageStation.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import LocationPicker from './LocationPicker';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const cx = classNames.bind(styles);

function ManageStation() {
    const { t } = useTranslation();

    const [stops, setStops] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedStop, setSelectedStop] = useState(null);
    const [stopName, setStopName] = useState('');
    const [address, setAddress] = useState('');
    const [routeId, setRouteId] = useState('');
    const [position, setPosition] = useState([10.762622, 106.660172]); // mặc định HCM
    const [routes, setRoutes] = useState([]);

    // Lấy danh sách trạm từ API
    const fetchStops = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stops');
            setStops(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/routes');
            setRoutes(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchStops();
        fetchRoutes();
    }, []);

    // Mở modal
    const handleOpenModal = (type, stop = null) => {
        setIsOpenModal(type);
        setSelectedStop(stop);
        setStopName(stop ? stop.stop_name : '');
        setAddress(stop ? stop.address : ''); // Giả sử có address
        setRouteId(stop ? stop.route_id : '');
        setPosition(
            stop && stop.latitude && stop.longitude ? [stop.latitude, stop.longitude] : [10.762622, 106.660172],
        );
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedStop(null);
        setStopName('');
        setAddress('');
        setRouteId('');
    };

    // Thêm trạm
    const handleAddStop = async () => {
        if (!stopName.trim() || !address.trim()) {
            showToast('please_enter_full_info', false);
            return;
        }
        if (!routeId || !address || !position[0] || !position[1]) {
            showToast('stop_info_incomplete', false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/stops', {
                stop_name: stopName,
                address,
                route_id: routeId,
                latitude: position[0],
                longitude: position[1],
            });
            showToast('add_stop_success');

            handleCloseModal();
            fetchStops();
        } catch (error) {
            console.error('Add stop error:', error);
            showToast('add_stop_failed', false);
        }
    };

    // Sửa trạm
    const handleEditStop = async () => {
        if (!stopName.trim() || !address.trim()) {
            showToast('please_enter_full_info', false);

            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/stops/${selectedStop.stop_id}`, {
                stop_name: stopName,
                address,
                route_id: routeId,
                latitude: position[0],
                longitude: position[1],
            });
            showToast('update_stop_success');
            handleCloseModal();
            fetchStops();
        } catch (error) {
            console.error('Edit stop error:', error);
            showToast('update_stop_failed', false);
        }
    };

    // Xóa trạm
    const handleDeleteStop = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/stops/${selectedStop.stop_id}`);
            showToast('delete_stop_success');
            handleCloseModal();
            fetchStops();
        } catch (error) {
            console.error('Delete stop error:', error);
            showToast('delete_stop_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('stop_management')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_stop')}
                </button>
            </div>
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('stop_id')}</th>
                            <th>{t('stop_name')}</th>
                            <th>{t('stop_address')}</th>
                            <th>{t('route_id')}</th>
                            <th>{t('action')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stops.map((stop) => (
                            <tr key={stop.stop_id}>
                                <td>{stop.stop_id}</td>
                                <td>{stop.stop_name}</td>
                                <td>{stop.address}</td>
                                <td>{stop.route_id}</td>
                                <td>
                                    <button
                                        className={cx('btn', 'change')}
                                        onClick={() => handleOpenModal('edit', stop)}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        className={cx('btn', 'danger')}
                                        onClick={() => handleOpenModal('delete', stop)}
                                    >
                                        {t('delete')}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={cx('btn', 'details')}
                                        onClick={() => handleOpenModal('details', stop)}
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
                        <h3>{t('edit_stop')}</h3>

                        <div className={cx('form')}>
                            <div className={cx('form-input')}>
                                <div className={cx('flex-input')}>
                                    <label>{t('stop_name')}: </label>
                                    <input
                                        type="text"
                                        placeholder={t('stop_name_placeholder')}
                                        className={cx('input')}
                                        value={stopName}
                                        onChange={(e) => setStopName(e.target.value)}
                                    />
                                </div>
                                <div className={cx('flex-input')}>
                                    <label>{t('stop_address')}: </label>
                                    <input
                                        type="text"
                                        placeholder={t('stop_address_placeholder')}
                                        className={cx('input')}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Bảng chọn tuyến */}
                            <div className={cx('table-wrapper')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>{t('route_id')}</th>
                                            <th>{t('route_name')}</th>
                                            <th>{t('select')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route) => (
                                            <tr key={route.route_id}>
                                                <td>{route.route_id}</td>
                                                <td>{route.route_name}</td>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        name="route"
                                                        value={route.route_id}
                                                        checked={routeId === route.route_id}
                                                        onChange={() => setRouteId(route.route_id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Map chọn vị trí */}
                            <div style={{ height: '240px', width: '80%' }}>
                                <MapContainer
                                    key={selectedStop?.stop_id || 'new'}
                                    center={position}
                                    zoom={13}
                                    style={{ height: '240px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                    />
                                    <LocationPicker
                                        position={position}
                                        setPosition={setPosition}
                                        address={address}
                                        setAddress={setAddress}
                                    />
                                </MapContainer>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditStop}>
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
                        <h3>{t('add_stop')}</h3>

                        <div className={cx('form')}>
                            <div className={cx('form-input')}>
                                <input
                                    type="text"
                                    placeholder={t('stop_name_placeholder')}
                                    className={cx('input')}
                                    value={stopName}
                                    onChange={(e) => setStopName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder={t('stop_address_placeholder')}
                                    className={cx('input')}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    readOnly
                                />
                            </div>

                            <div className={cx('table-wrapper')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>{t('route_id')}</th>
                                            <th>{t('route_name')}</th>
                                            <th>{t('select')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route) => (
                                            <tr key={route.route_id}>
                                                <td>{route.route_id}</td>
                                                <td>{route.route_name}</td>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        name="route"
                                                        value={route.route_id}
                                                        checked={routeId === route.route_id}
                                                        onChange={() => setRouteId(route.route_id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ height: '240px', width: '80%' }}>
                                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                    />
                                    <LocationPicker
                                        position={position}
                                        setPosition={setPosition}
                                        address={address}
                                        setAddress={setAddress}
                                    />
                                </MapContainer>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddStop}>
                                    {t('add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết */}
            {isOpenModal === 'details' && selectedStop && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>{t('stop_details')}</h3>
                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('stop_id')}: </label>
                                <input type="text" value={selectedStop.stop_id} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('stop_name')}: </label>
                                <input type="text" value={selectedStop.stop_name} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('stop_address')}: </label>
                                <input type="text" value={selectedStop.address} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('route_id')}: </label>
                                <input type="text" value={selectedStop.route_id} readOnly className={cx('input')} />
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
                        <h3>{t('confirm_delete_stop')}</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteStop}>
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStation;
