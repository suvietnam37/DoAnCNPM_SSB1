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
import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import showToast from '../../../untils/ShowToast/showToast';
import { AuthContext } from '../../../context/auth.context';
const cx = classNames.bind(styles);

function Notification({ notifications, routeStatus, setNotifications }) {
    const socketRef = useRef(null);
    const [bus, setBus] = useState([]);
    const [driver, setDriver] = useState([]);
    const [stops, setStops] = useState([]);
    const [currentStop, setCurrentStop] = useState('');
    const [noti, setNoti] = useState('');
    const authContext = useContext(AuthContext);

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
        fetchNotifications(authContext?.auth?.user?.account_id);
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register', authContext?.auth?.user?.account_id);

        socketRef.current.on('notification', (data) => {
            setNoti(data.message);
            showToast('Có thông báo mới');
        });

        return () => {
            socketRef.current.off('notification');
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (routeStatus) {
            fetchBusByBusId(routeStatus.bus_id);
            fetchDriverByDriverId(routeStatus.driver_id);
            fetchStopByRouteId(routeStatus.route_id);

            if (routeStatus.current_stop_id) {
                fetchNameCurrentStop(routeStatus.current_stop_id);
            } else {
                setCurrentStop(stops[0]?.stop_name);
            }
        }
    }, [routeStatus]);

    useEffect(() => {
        setNoti(notifications[0]?.content);
    }, [notifications, setNotifications]);

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

    const fetchNotifications = async (ACCOUNT_ID) => {
        const date = new Date().toISOString().split('T')[0];
        try {
            const response = await axios.get(
                `http://localhost:5000/api/notifications?account_id=${ACCOUNT_ID}&date=${date}`,
            );
            setNotifications(response.data);
        } catch (err) {
            console.error('Lỗi fetch notification:', err);
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
                    <div className={cx('notification-realtime')}>
                        <p>{noti || 'Chưa có thông báo mới từ hệ thống '}</p>
                        <button
                            className={cx('notification-realtime-details')}
                            onClick={() => {
                                handleOpenModal();
                            }}
                        >
                            Xem chi tiết
                        </button>
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
            {modalOpen && (
                <div className={cx('modal-overlay')} onClick={handleCloseModal}>
                    <div className={cx('modal-content')}>
                        <button className={cx('modal-close')} onClick={handleCloseModal}>
                            &times;
                        </button>
                        <h3>Chi tiết thông báo</h3>
                        <div className={cx('table-wrapper')}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nội dung</th>
                                        <th>Thời gian gửi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((n) => {
                                        return (
                                            <tr key={n.notification_id}>
                                                <td>{n.content}</td>
                                                <td>{new Date(n.created_at).toTimeString().split(' ')[0]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notification;
