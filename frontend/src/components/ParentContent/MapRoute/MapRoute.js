import styles from './MapRoute.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadowUrl,
});

L.Marker.prototype.options.icon = DefaultIcon;
const cx = classNames.bind(styles);

function MapRoute({ routeStatus }) {
    return (
        <div className={cx('map-route')} id="map-route">
            <div className={cx('map-route-title')}>
                <FontAwesomeIcon icon={faMap} className={cx('map-route-title-icon')} />
                <span>Bản Đồ Theo Dõi Lộ Trình Xe</span>
                </div>
            {routeStatus ? (
                 <div className={cx('map-route-location')}>
                    <MapContainer center={[10.762622, 106.682214]} zoom={13} style={{ height: '450px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        {/* Marker vị trí xe sẽ được thêm ở đây trong Tuần 6 */}
                    </MapContainer>
                </div>
            ) : (
                <p>Bản đồ sẽ hiển thị khi tuyến xe bắt đầu hoạt động.</p>
            )}
        </div>
    );
}

export default MapRoute;
