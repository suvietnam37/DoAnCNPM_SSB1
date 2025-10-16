import styles from './DashBoard.module.scss';
import classNames from 'classnames/bind';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const cx = classNames.bind(styles);

const busIcon = L.icon({
    iconUrl: '/bus.png', // đường dẫn ảnh
    iconSize: [40, 40], // kích thước icon
});
// L.Marker.prototype.options.icon = busIcon;

function DashBoard() {
    const waypoints = [
        { lat: 21.028511, lng: 105.804817 }, // Hà Nội
        { lat: 20.8411, lng: 106.6881 }, // Hải Phòng
        { lat: 19.8075, lng: 105.7764 }, // Thanh Hóa
    ];
    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Tổng quan hệ thống</h2>
            <div className={cx('stats')}>
                <div className={cx('card')}>Tuyến xe: 5</div>
                <div className={cx('card')}>Xe bus: 12</div>
                <div className={cx('card')}>Tài xế: 10</div>
                <div className={cx('card')}>Học sinh: 230</div>
            </div>
            <div className={cx('content')}>
                <div className={cx('content-map')}>
                    <MapContainer center={[21.0285, 105.8542]} zoom={13} style={{ height: '450px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
