import styles from './Notification.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faBus,
    faIdCard,
    faMapLocationDot,
    faMapPin,
    faRightLong,
    faSignal,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);

function Notification({ notifications, routeStatus }) {
    const [bus, setBus] = useState([]);
    const [driver, setDriver] = useState([]);
    const [stops, setStops] = useState([]);
    const [currentStop, setCurrentStop] = useState('');

    useEffect(() => {
        if (routeStatus) {
            fetchBusByBusId(routeStatus.bus_id);
            fetchDriverByDriverId(routeStatus.driver_id);
            fetchStopByRouteId(routeStatus.route_id);

            if (routeStatus.current_stop_id) {
                fetchNameCurrentStop(routeStatus.current_stop_id);
            } else {
                setCurrentStop(stops[0].stop_name);
            }
        }
    }, [routeStatus]);

    const fetchNameCurrentStop = async (STOP_ID) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/stops/${STOP_ID}`);
            setCurrentStop(response.data.stop_name);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const fetchBusByBusId = async (bus_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/buses/${bus_id}`);
            setBus(response.data);
        } catch (error) {
            console.error('Lỗi khi tải tài xế:', error);
        }
    };

    const fetchDriverByDriverId = async (driver_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/drivers/${driver_id}`);
            setDriver(response.data);
        } catch (error) {
            console.error('Lỗi khi tải tài xế:', error);
        }
    };

    const fetchStopByRouteId = async (route_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/stops?route_id=${route_id}`);
            setStops(response.data);
        } catch (err) {
            console.error('Lỗi fetch stops:', err);
        }
    };

    return (
        <div className={cx('notification')} id="notification">
            <div className={cx('notification-title')}>
                <FontAwesomeIcon icon={faBell} />
                <span>Thông Báo Hệ Thống</span>
            </div>

            {routeStatus ? (
                <>
                    {/* 
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div key={notif.notification_id} className={cx('notification-item')}>
                            <h4>
                                {notif.title} ({notif.type})
                            </h4>
                            <p>{notif.content}</p>
                            <small>{new Date(notif.created_at).toLocaleString('vi-VN')}</small>
                        </div>
                    ))
                ) : (
                    <p>Không có thông báo mới.</p>
                )} 
                */}

                    <div className={cx('notification-realtime')}>
                        <p>Xe Đã Khởi Hành Từ Cầu Thị Nghè Lúc 7:00 AM</p>
                        <button className={cx('notification-realtime-details')}>Xem chi tiết</button>
                    </div>

                    <div className={cx('notification-infor')}>
                        <div className={cx('route-num')}>
                            <div className={cx('route-num-title')}>
                                <FontAwesomeIcon icon={faBus} className={cx('route-num-title-icon')} />
                                <span>Xe số {bus?.bus_id}</span>
                            </div>
                            <div className={cx('route-num-name')}>{bus?.license_plate}</div>
                        </div>

                        <div className={cx('driver-infor')}>
                            <div className={cx('driver-infor-title')}>
                                <FontAwesomeIcon icon={faIdCard} className={cx('driver-infor-title-icon')} />
                                <span>Tài xế</span>
                            </div>
                            <div className={cx('driver-infor-name')}>{driver?.driver_name}</div>
                        </div>

                        <div className={cx('bus-active')}>
                            <div className={cx('bus-active-title')}>
                                <FontAwesomeIcon icon={faSignal} className={cx('bus-active-title-icon')} />
                                <span>Trạng thái</span>
                            </div>
                            <div className={cx('bus-active-name')}>
                                {routeStatus?.status === 'Running' ? 'Đang hoạt động' : 'Chưa hoạt động'}
                            </div>
                        </div>
                    </div>

                    <div className={cx('notification-route')}>
                        <div className={cx('notification-route-title')}>
                            <FontAwesomeIcon icon={faMapLocationDot} className={cx('notification-route-title-icon')} />
                            <span>Tuyến đường</span>
                        </div>

                        <div className={cx('notification-route-name')}>
                            {stops.map((stop, index) => (
                                <div key={stop.stop_id}>
                                    <span>{stop.stop_name}</span>
                                    {index < stops.length - 1 && <FontAwesomeIcon icon={faRightLong} />}
                                </div>
                            ))}
                        </div>

                        <div className={cx('notification-route-location')}>
                            <FontAwesomeIcon icon={faMapPin} className={cx('notification-route-title-icon')} />
                            <span>
                                Vị trí hiện tại / đã qua : <p>{currentStop}</p>
                            </span>
                        </div>
                    </div>
                </>
            ) : (
                <h2>Chưa có chuyến xe bắt đầu</h2>
            )}
        </div>
    );
}

export default Notification;
