import styles from './RouteStatus.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRightLong, faRoute } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);
function RouteStatus({ routeStatus }) {
    const [stops, setStops] = useState([]);
    const [currentStop, setCurrentStop] = useState('');
    const [nextStop, setNextStop] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (routeStatus) {
            fetchStopByRouteId(routeStatus.route_id);
            if (routeStatus.current_stop_id) {
                fetchNameCurrentNextStop(routeStatus.current_stop_id, 'current');
            } else {
                setCurrentStop(stops[0]?.stop_name);
            }
            if (routeStatus.next_stop_id) {
                fetchNameCurrentNextStop(routeStatus.next_stop_id, 'next');
            } else {
                setNextStop(stops[1]?.stop_name);
            }
        }
    }, [routeStatus, stops]);

    const fetchStopByRouteId = async (ROUTE_ID) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/stops?route_id=${ROUTE_ID}`);
            setStops(res.data);
        } catch (err) {
            console.error('Lỗi fetch stops:', err);
        }
    };

    const fetchNameCurrentNextStop = async (STOP_ID, type) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/stops/${STOP_ID}`);
            if (type === 'next') {
                setNextStop(response.data.stop_name);
            } else {
                setCurrentStop(response.data.stop_name);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className={cx('route-status')} id="route-status">
            <div className={cx('route-status-title')}>
                <FontAwesomeIcon icon={faRoute} />
                <span>{t('route_status')}</span>
            </div>
            {routeStatus ? (
                <div className={cx('route-status-container')}>
                    <div className={cx('route-num-container')}>
                        <div className={cx('route-num')}>
                            <div
                                className={cx(
                                    'active-color',
                                    { active: routeStatus?.status === 'Running' },
                                    { unactive: routeStatus?.status !== 'Running' },
                                )}
                            ></div>
                            <div className={cx('num')}>
                                {t('vehicle_route')} {routeStatus?.route_name}
                            </div>
                            <div className={cx('active')}>
                                {routeStatus?.status === 'Running' ? t('active') : t('unactive')}
                            </div>
                        </div>
                        <div className={cx('start-end')}>
                            {stops?.[0]?.stop_name} {routeStatus?.status === 'Running' && '-'}{' '}
                            {stops?.[stops.length - 1]?.stop_name}
                        </div>
                    </div>
                    <div className={cx('route-location')}>
                        <div className={cx('location-title')}>
                            <FontAwesomeIcon icon={faLocationDot} className={cx('location-title-icon')} />
                            <span> {t('current_location')} </span>
                        </div>
                        <div className={cx('location-name')}>{currentStop || t('updating_location') + ' ...'}</div>
                    </div>
                    <div className={cx('route-next-location')}>
                        <div className={cx('next-location-title')}>
                            <FontAwesomeIcon icon={faRightLong} className={cx('next-location-title-icon')} />
                            <span> {t('next_stop')} </span>
                        </div>
                        <div className={cx('next-location-name')}>{nextStop || t('updating') + ' ...'}</div>
                    </div>
                </div>
            ) : (
                <h2>{t('no_trip_started')}</h2>
            )}
        </div>
    );
}

export default RouteStatus;
