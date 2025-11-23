import styles from './MapRoute.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsToEye, faEye, faEyeSlash, faMap } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import FocusBus from '../../../untils/FocusBus/FocusBus';
import Routing from '../../../untils/Routing/Routing';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

const busIcon = new L.Icon({
    iconUrl: '/bus.png',
    iconSize: [35, 35],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

function MapRoute({ routeStatus, busLocation, waypoints }) {
    const { t } = useTranslation();

    // Nếu có vị trí xe thì dùng, không thì dùng vị trí mặc định
    const [focus, setFocus] = useState(false);
    const initialPosition = busLocation ? [busLocation.lat, busLocation.lng] : [10.7597031, 106.6817595];

    // useEffect(() => {
    //     console.log('busLocation: ', busLocation);
    // }, [busLocation]);

    // useEffect(() => {
    //     console.log('waypoints: ', waypoints);
    // }, [waypoints]);

    // const waypoints = [
    //     { lat: 10.762622, lng: 106.682199 }, // Trường Đại học Sài Gòn, Quận 5
    //     { lat: 10.823099, lng: 106.693221 }, // Bến xe Miền Đông, Quận Bình Thạnh
    //     { lat: 10.8016, lng: 106.6648 }, // Công viên Hoàng Văn Thụ, Quận Tân Bình
    //     { lat: 10.762622, lng: 106.682199 }, // Trường Đại học Sài Gòn, Quận 5 (lặp lại)
    // ];

    return (
        <div className={cx('map-route')} id="map-route">
            <div className={cx('map-route-title')}>
                <FontAwesomeIcon icon={faMap} className={cx('map-route-title-icon')} />
                <span>{t('route_tracking_map')}</span>
            </div>

            <div className={cx('map-route-location')}>
                {focus === false ? (
                    <button className={cx('btn-focus', 'unfocus')} onClick={() => setFocus(true)}>
                        <FontAwesomeIcon icon={faEyeSlash} />
                    </button>
                ) : (
                    <button className={cx('btn-focus', 'focus')} onClick={() => setFocus(false)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                )}
                <MapContainer center={initialPosition} zoom={16} style={{ height: '450px', width: '100%' }}>
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                    <Routing waypoints={waypoints}></Routing>
                    <Marker
                        position={busLocation ? [busLocation.lat, busLocation.lng] : initialPosition}
                        icon={busIcon}
                    />
                    {focus && <FocusBus busLocation={busLocation}></FocusBus>}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapRoute;
