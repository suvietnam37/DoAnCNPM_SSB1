import styles from './MapRoute.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';

const cx = classNames.bind(styles);

const busIcon = new L.Icon({
    iconUrl: '/bus-icon.png', 
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40] 
});


function MapRoute({ routeStatus, busLocation }) {
    const markerRef = useRef(null);
    const [map, setMap] = useState(null);

    // Effect để di chuyển marker và căn giữa bản đồ
    useEffect(() => {
        if (map && markerRef.current && busLocation) {
            const newLatLng = [busLocation.lat, busLocation.lng];
            // Di chuyển marker đến vị trí mới
            markerRef.current.setLatLng(newLatLng);
            // Căn giữa bản đồ vào vị trí mới của marker
            map.panTo(newLatLng);
        }
    }, [busLocation, map]); // Chạy lại khi busLocation hoặc map thay đổi

    if (!routeStatus) {
        return (
            <div id="map-route" className={cx('map-placeholder')}>
                <div className={cx('map-route-title')}>
                    <FontAwesomeIcon icon={faMap} className={cx('map-route-title-icon')} />
                    <span>Bản Đồ Theo Dõi Lộ Trình Xe</span>
                </div>
                <p>Bản đồ sẽ hiển thị khi tuyến xe của con bắt đầu hoạt động.</p>
            </div>
        );
    }

    // Đặt vị trí ban đầu của bản đồ (chỉ dùng khi render lần đầu)
    // Nếu có vị trí xe thì dùng, không thì dùng vị trí mặc định
    const initialPosition = busLocation ? [busLocation.lat, busLocation.lng] : [10.762622, 106.682214];

    return (
        <div className={cx('map-route')} id="map-route">
            <div className={cx('map-route-title')}>
                <FontAwesomeIcon icon={faMap} className={cx('map-route-title-icon')} />
                <span>Bản Đồ Theo Dõi Lộ Trình Xe</span>
            </div>
            
            <div className={cx('map-route-location')}>
                <MapContainer 
                    center={initialPosition} 
                    zoom={16} // Zoom gần hơn một chút
                    style={{ height: '500px', width: '100%' }}
                    whenCreated={setMap} // Lưu đối tượng map vào state khi nó được tạo
                >
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Chỉ render Marker khi có vị trí ban đầu */}
                    {busLocation && (
                        <Marker 
                            ref={markerRef} 
                            position={initialPosition} 
                            icon={busIcon}
                        >
                            <Popup>Vị trí hiện tại của xe.</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapRoute;
