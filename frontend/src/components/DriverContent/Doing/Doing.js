import styles from './Doing.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faBus,
    faIdCard,
    faSignal,
    faMapLocationDot,
    faRightLong,
    faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import showConfirm from '../../../untils/ShowConfirm/showConfirm';
import showToast from '../../../untils/ShowToast/showToast';
import { AuthContext } from '../../../context/auth.context';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function Doing({ currentAssignment, handleEndRoute, notifications, setNotifications }) {
    const socketRef = useRef(null);
    const { t } = useTranslation();

    const [bus, setBus] = useState([]);
    const [driver, setDriver] = useState([]);
    const [stops, setStops] = useState([]);
    const [currentStop, setCurrentStop] = useState('');
    const [nextStop, setNextStop] = useState('');
    const [endRoute, setEndRoute] = useState(false);
    const [noti, setNoti] = useState('');

    const authContext = useContext(AuthContext);

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register', authContext?.auth?.user?.account_id);

        socketRef.current.on('notification', (data) => {
            setNoti(data.message);
            showToast('new_notification');
        });

        return () => {
            socketRef.current.off('notification');
            socketRef.current.off('changeRoute');
            socketRef.current.disconnect();
        };
    }, []);

    const fetchNotifications = async (ACCOUNT_ID) => {
        const date = new Date().toISOString().split('T')[0];
        try {
            const response = await axios.get(
                `http://localhost:5000/api/notifications?account_id=${ACCOUNT_ID}date=${date}`,
            );
            setNotifications(response.data);
        } catch (err) {
            console.error('Lỗi fetch notification:', err);
        }
    };

    useEffect(() => {
        if (currentAssignment) {
            if (currentAssignment.bus_id) fetchBusByBusId(currentAssignment.bus_id);
            if (currentAssignment.driver_id) fetchDriverByDriverId(currentAssignment.driver_id);
            if (currentAssignment.route_id) fetchStopByRouteId(currentAssignment.route_id);
        }
    }, [currentAssignment]);

    useEffect(() => {
        if (stops.length >= 2) {
            setCurrentStop(stops[0].stop_name);
            setNextStop(stops[1].stop_name);
        }
    }, [stops]);

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

    const handleChangeStop = async (route_id) => {
        showConfirm('arrive_stop_confirm', 'confirm', async () => {
            // Lấy vị trí của current stop trong mảng stops
            const currentIndex = stops.findIndex((s) => s.stop_name === currentStop);

            if (currentIndex === -1) return;

            // trạm cuối cùng
            if (currentIndex === stops.length - 1) {
                setCurrentStop(stops[currentIndex].stop_name);
                setNextStop('Hoàn thành tuyến');
                return;
            }

            //trạm tiếp theo
            const newCurrent = stops[currentIndex + 1];
            const newNext = currentIndex + 2 < stops.length ? stops[currentIndex + 2] : null;
            if (newNext === null) {
                setEndRoute(true);
            }

            // Cập nhật UI ngay lập tức
            setCurrentStop(newCurrent.stop_name);
            setNextStop(newNext ? newNext.stop_name : 'Đã đến trạm cuối');

            // Gửi về backend để đồng bộ
            try {
                const pRes = await axios.get(
                    `http://localhost:5000/api/parents/route_id/${currentAssignment.route_id}`,
                );
                const parent = pRes.data;

                const aRes = await axios.get(`http://localhost:5000/api/accounts/role/1`);

                const admin = aRes.data;

                await axios.put(
                    `http://localhost:5000/api/route_assignments/update-stop/${currentAssignment.assignment_id}`,
                    {
                        current_stop_id: newCurrent.stop_id,
                        next_stop_id: newNext ? newNext.stop_id : null,
                    },
                );

                parent.forEach(async (i) => {
                    try {
                        await axios.post('http://localhost:5000/api/notifications/create', {
                            accountId: i.account_id,
                            content: `Đã đến trạm ${currentStop} `,
                        });
                    } catch (error) {
                        console.log(error, 'Lỗi khi thêm notification');
                    }
                });

                admin.forEach(async (i) => {
                    try {
                        await axios.post('http://localhost:5000/api/notifications/create', {
                            accountId: i.account_id,
                            content: `Xe bus số ${bus.bus_id} đã đến trạm ${currentStop} `,
                        });
                    } catch (error) {
                        console.log(error, 'Lỗi khi thêm notification');
                    }
                });

                showToast('arrive_stop_success');
                socketRef.current.emit('changeRoute', {
                    message: `Đã đến trạm ${currentStop} `,
                    route_id: route_id,
                });

                socketRef.current.emit('report', `Xe bus số ${bus.bus_id} đã đến trạm ${currentStop} `);
            } catch (err) {
                console.error('Error updating stop:', err);
            }
        });
    };

    if (!currentAssignment) {
        return (
            <div className={cx('doing')} id="doing">
                <div className={cx('doing-title')}>
                    <FontAwesomeIcon icon={faBell} />
                    <span>{t('route_doing')}</span>
                </div>
                <h2>{t('no_active_route')}.</h2>
            </div>
        );
    }

    return (
        <div className={cx('doing')} id="doing">
            <div className={cx('doing-title')}>
                <FontAwesomeIcon icon={faBell} />
                <span>{t('route_doing')}</span>
                <div className={cx('doing-realtime')}>
                    {endRoute === true && (
                        <button
                            className={cx('doing-realtime-details')}
                            onClick={() => handleEndRoute(currentAssignment.assignment_id)}
                        >
                            {t('finish')}
                        </button>
                    )}
                    {endRoute === false && (
                        <button
                            className={cx('doing-realtime-details')}
                            onClick={() => handleChangeStop(currentAssignment.route_id)}
                        >
                            {t('arrive_stop')}
                        </button>
                    )}
                </div>
            </div>
            <div className={cx('notification-realtime')}>
                <p>{noti || t('no_new_notifications')}</p>
                <button
                    className={cx('notification-realtime-details')}
                    onClick={() => {
                        handleOpenModal();
                        fetchNotifications(authContext?.auth?.user?.account_id);
                    }}
                >
                    {t('view_detail')}
                </button>
            </div>

            <div className={cx('doing-infor')}>
                <div className={cx('route-num')}>
                    <div className={cx('route-num-title')}>
                        <FontAwesomeIcon icon={faBus} className={cx('route-num-title-icon')} />
                        <span>
                            {t('vehicle_number')} {bus?.bus_id}
                        </span>
                    </div>
                    {/* Thay thế dữ liệu tĩnh bằng dữ liệu từ props */}
                    <div className={cx('route-num-name')}>{bus?.license_plate}</div>
                </div>
                <div className={cx('driver-infor')}>
                    <div className={cx('driver-infor-title')}>
                        <FontAwesomeIcon icon={faIdCard} className={cx('driver-infor-title-icon')} />
                        <span>{t('Driver')} </span>
                    </div>
                    <div className={cx('driver-infor-name')}>{driver?.driver_name}</div>
                </div>
                <div className={cx('bus-active')}>
                    <div className={cx('bus-active-title')}>
                        <FontAwesomeIcon
                            icon={faSignal}
                            className={cx('bus-active-title-icon', {
                                start: currentAssignment?.status === 'Running',
                                done: currentAssignment?.status !== 'Running',
                            })}
                        />
                        <span>{t('status')}</span>
                    </div>
                    <div className={cx('bus-active-name')}>
                        {currentAssignment?.status === 'Running' ? t('active') : t('completed')}
                    </div>
                </div>
            </div>
            <div className={cx('doing-route')}>
                <div className={cx('doing-route-title')}>
                    <FontAwesomeIcon icon={faMapLocationDot} className={cx('doing-route-title-icon')} />
                    <span>{t('route_name')} </span>
                </div>
                <div className={cx('doing-route-name')}>
                    {stops.map((stop, index) => (
                        <div key={stop.stop_id}>
                            <span>{stop.stop_name}</span>
                            {index < stops.length - 1 && <FontAwesomeIcon icon={faRightLong} />}
                        </div>
                    ))}
                </div>
                <div className={cx('doing-route-location')}>
                    <FontAwesomeIcon icon={faMapPin} className={cx('doing-route-title-icon')} />
                    <span>
                        {t('current_location')} : <p>{currentStop}</p>
                    </span>
                </div>
                <div className={cx('doing-route-location')}>
                    <FontAwesomeIcon icon={faMapPin} className={cx('doing-route-title-icon')} />
                    <span>
                        {t('next_stop')} : <p>{nextStop}</p>
                    </span>
                </div>
                {/* Các phần vị trí hiện tại và điểm tiếp theo sẽ được cập nhật ở Tuần 6 (real-time) */}

                {modalOpen && (
                    <div className={cx('modal-overlay')} onClick={handleCloseModal}>
                        <div className={cx('modal-content')}>
                            <button className={cx('modal-close')} onClick={handleCloseModal}>
                                &times;
                            </button>
                            <h3>{t('notification_detail')}</h3>
                            <div className={cx('table-wrapper')}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t('content')}</th>
                                            <th>{t('sent_time')}</th>
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
        </div>
    );
}

export default Doing;
