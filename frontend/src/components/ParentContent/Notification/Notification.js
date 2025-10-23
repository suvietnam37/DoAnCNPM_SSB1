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

function Notification({ notifications }) {
    return (
        <div className={cx('notification')} id="notification">
            <div className={cx('notification-title')}>
                <FontAwesomeIcon icon={faBell} />
                <span>Thông Báo Hệ Thống</span>
                </div>
            {/* Thay thế phần tĩnh bằng dữ liệu động */}
            {notifications.length > 0 ? (
                notifications.map(notif => (
                    <div key={notif.notification_id} className={cx('notification-item')}>
                        <h4>{notif.title} ({notif.type})</h4>
                        <p>{notif.content}</p>
                        <small>{new Date(notif.created_at).toLocaleString('vi-VN')}</small>
                    </div>
                ))
            ) : (
                <p>Không có thông báo mới.</p>
            )}
            
            {/* Phần thông tin chi tiết về tuyến xe bên dưới có thể xóa hoặc ẩn đi,
               vì đã có component RouteStatus đảm nhiệm */}
        </div>
    );
}

export default Notification;
