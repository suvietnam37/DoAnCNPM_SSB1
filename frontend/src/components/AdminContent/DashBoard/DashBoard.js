import styles from './DashBoard.module.scss';
import classNames from 'classnames/bind';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from '../../../untils/CustomAxios/axios.customize';

import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

const busIcon = L.icon({
    iconUrl: '/bus.png', // đường dẫn ảnh
    iconSize: [40, 40], // kích thước icon
});
// L.Marker.prototype.options.icon = busIcon;

function DashBoard() {
    const [numStudents, setNumStudents] = useState([]);
    const [numDrivers, setNumDrivers] = useState([]);
    const [numBuses, setNumBuses] = useState([]);
    const [numRoutes, setNumRoutes] = useState([]);
    const [message, setMessage] = useState('');

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResp, driversResp, busesResp, routesResp] = await Promise.all([
                    axios.get('http://localhost:5000/api/students'),
                    axios.get('http://localhost:5000/api/drivers'),
                    axios.get('http://localhost:5000/api/buses'),
                    axios.get('http://localhost:5000/api/routes'),
                ]);
                setNumStudents(studentsResp.data);
                setNumDrivers(driversResp.data);
                setNumBuses(busesResp.data);
                setNumRoutes(routesResp.data);
            } catch (error) {
                setMessage('Lỗi khi tải dữ liệu dashboard!');
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);

    const waypoints = [
        { lat: 21.028511, lng: 105.804817 }, // Hà Nội
        { lat: 20.8411, lng: 106.6881 }, // Hải Phòng
        { lat: 19.8075, lng: 105.7764 }, // Thanh Hóa
    ];
    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Tổng quan hệ thống</h2>
            <div className={cx('stats')}>
                <div className={cx('card')}>Tuyến xe: {numRoutes.length}</div>
                <div className={cx('card')}>Xe bus: {numBuses.length}</div>
                <div className={cx('card')}>Tài xế: {numDrivers.length}</div>
                <div className={cx('card')}>Học sinh: {numStudents.length}</div>
            </div>
            <div className={cx('content')}>
                <div className={cx('content-map')}>
                    <MapContainer center={[21.0285, 105.8542]} zoom={13} style={{ height: '385px', width: '100%' }}>
                        {/* <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        /> */}
                        <TileLayer
                            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        />
                        <Marker position={waypoints[0]} icon={busIcon}></Marker>
                        <Marker position={waypoints[1]} icon={busIcon}></Marker>
                        <Marker position={waypoints[2]} icon={busIcon}></Marker>
                    </MapContainer>
                </div>
                <div></div>
                <div className={cx('content-notification')}>
                    <h1>Thông báo hệ thống</h1>
                    <div className={cx('content-notification-content')}>
                        <ul>
                            <li>Xe 01 sẽ đến trạm A trong 5 phút nữa</li>
                            <li>Xe 02 đã đến trạm B dừng trong 5 phút</li>
                            <li>Xe 03 sẽ đến trạm A trễ 5 phút lý do "kẹt xe"</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
