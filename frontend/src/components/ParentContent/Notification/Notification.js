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
const cx = classNames.bind(styles);

function Notification() {
    return (
        <div className={cx('notification')} id="notification">
            <div className={cx('notification-title')}>
                <FontAwesomeIcon icon={faBell} />
                <span>Thông Báo Hệ Thống</span>
            </div>
            <div className={cx('notification-realtime')}>
                <p>Xe Đã Khởi Hành Từ Cầu Thị Nghè Lúc 7:00 AM</p>
                <button className={cx('notification-realtime-details')}>Xem chi tiết</button>
            </div>
            <div className={cx('notification-infor')}>
                <div className={cx('route-num')}>
                    <div className={cx('route-num-title')}>
                        <FontAwesomeIcon icon={faBus} className={cx('route-num-title-icon')} />
                        <span>Tuyến xe </span>
                    </div>
                    <div className={cx('route-num-name')}>Tuyến 01</div>
                </div>
                <div className={cx('driver-infor')}>
                    <div className={cx('driver-infor-title')}>
                        <FontAwesomeIcon icon={faIdCard} className={cx('driver-infor-title-icon')} />
                        <span>Tài xế </span>
                    </div>
                    <div className={cx('driver-infor-name')}>Nguyễn Văn Lựu</div>
                </div>
                <div className={cx('bus-active')}>
                    <div className={cx('bus-active-title')}>
                        <FontAwesomeIcon icon={faSignal} className={cx('bus-active-title-icon')} />
                        <span>Trạng thái </span>
                    </div>
                    <div className={cx('bus-active-name')}>Đang hoạt động</div>
                </div>
            </div>
            <div className={cx('notification-route')}>
                <div className={cx('notification-route-title')}>
                    <FontAwesomeIcon icon={faMapLocationDot} className={cx('notification-route-title-icon')} />
                    <span>Tuyến đường </span>
                </div>
                <div className={cx('notification-route-name')}>
                    <span>Q8</span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span>Cầu Thị Nghè</span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span>Cầu Chữ Y</span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span>THPT Nguyễn Thị Lựu</span>
                </div>
                <div className={cx('notification-route-location')}>
                    <FontAwesomeIcon icon={faMapPin} className={cx('notification-route-title-icon')} />
                    <span>
                        Vị trí hiện tại / đã qua : <p>Q8</p>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Notification;
