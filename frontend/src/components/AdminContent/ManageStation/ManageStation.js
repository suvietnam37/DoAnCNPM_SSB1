// src/pages/ManageStation/ManageStation.js
import styles from './ManageStation.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import LocationPicker from './LocationPicker';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const cx = classNames.bind(styles);

function ManageStation() {
    const [stops, setStops] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedStop, setSelectedStop] = useState(null);
    const [stopName, setStopName] = useState('');
    const [address, setAddress] = useState('');
    const [routeId, setRouteId] = useState('');
    const [position, setPosition] = useState([10.762622, 106.660172]); // mặc định HCM

    // Lấy danh sách trạm từ API
    const fetchStops = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stops');
            setStops(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchStops();
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
        if (!stopName.trim() || !address.trim() || !routeId.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
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
            alert('Thêm trạm thành công!');
            handleCloseModal();
            fetchStops();
        } catch (error) {
            console.error('Add stop error:', error);
            alert('Lỗi khi thêm trạm.');
        }
    };

    // Sửa trạm
    const handleEditStop = async () => {
        if (!stopName.trim() || !address.trim() || !routeId.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
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
            alert('Cập nhật trạm thành công!');
            handleCloseModal();
            fetchStops();
        } catch (error) {
            console.error('Edit stop error:', error);
            alert('Lỗi khi sửa trạm.');
        }
    };

    // Xóa trạm
    const handleDeleteStop = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/stops/${selectedStop.stop_id}`);
            alert('Xóa trạm thành công!');
            handleCloseModal();
            fetchStops();
        } catch (error) {
            console.error('Delete stop error:', error);
            alert('Lỗi khi xóa trạm.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý trạm</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm trạm
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã trạm</th>
                        <th>Tên trạm</th>
                        <th>Địa chỉ</th>
                        <th>Mã tuyến</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
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
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', stop)}>
                                    Sửa
                                </button>
                                <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', stop)}>
                                    Xóa
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

            {/* Modal Sửa */}
            {isOpenModal === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Sửa trạm</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên trạm"
                                className={cx('input')}
                                value={stopName}
                                onChange={(e) => setStopName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Địa chỉ"
                                className={cx('input')}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {/* <input
                                type="text"
                                placeholder="Mã tuyến"
                                className={cx('input')}
                                value={routeId}
                                onChange={(e) => setRouteId(e.target.value)}
                            /> */}

                            <div className={cx('table-wrapper')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Mã tuyến</th>
                                            <th>Tên tuyến</th>
                                            <th>Chọn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>R01</td>
                                            <td>Cầu Ông Lãnh</td>
                                            <td>
                                                <input type="radio" name="route" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>R01</td>
                                            <td>Cầu Ông Lãnh</td>
                                            <td>
                                                <input type="radio" name="route" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>R01</td>
                                            <td>Cầu Ông Lãnh</td>
                                            <td>
                                                <input type="radio" name="route" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ height: '240px', width: '80%' }}>
                                <MapContainer
                                    key={address} // remount mỗi khi address thay đổi, đảm bảo reset popup
                                    center={position}
                                    zoom={13}
                                    style={{ height: '240px', width: '80%' }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                        <h3>Thêm trạm</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên trạm"
                                className={cx('input')}
                                value={stopName}
                                onChange={(e) => setStopName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Địa chỉ"
                                className={cx('input')}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                readOnly
                            />
                            {/* <input
                                type="text"
                                placeholder="Mã tuyến"
                                className={cx('input')}
                                value={routeId}
                                onChange={(e) => setRouteId(e.target.value)}
                            /> */}

                            <div className={cx('table-wrapper')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Mã tuyến</th>
                                            <th>Tên tuyến</th>
                                            <th>Chọn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>R01</td>
                                            <td>Cầu Ông Lãnh</td>
                                            <td>
                                                <input type="radio" name="route" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>R01</td>
                                            <td>Cầu Ông Lãnh</td>
                                            <td>
                                                <input type="radio" name="route" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>R01</td>
                                            <td>Cầu Ông Lãnh</td>
                                            <td>
                                                <input type="radio" name="route" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ height: '240px', width: '80%' }}>
                                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                                    Thêm
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
                        <h3>Chi tiết trạm</h3>
                        <div className={cx('form')}>
                            <input type="text" value={selectedStop.stop_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStop.stop_name} readOnly className={cx('input')} />
                            <input type="text" value={selectedStop.address} readOnly className={cx('input')} />
                            <input type="text" value={selectedStop.route_id} readOnly className={cx('input')} />
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
                        <h3>Xác nhận xóa trạm?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteStop}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStation;
