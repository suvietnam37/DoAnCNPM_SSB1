import styles from './RouteStatus.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRightLong, faRoute } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function RouteStatus() {
    return (
        <div className={cx('route-status')} id="route-status">
            <div className={cx('route-status-title')}>
                <FontAwesomeIcon icon={faRoute} />
                <span>Trạng Thái Tuyến Xe</span>
            </div>
            <div className={cx('route-status-container')}>
                <div className={cx('route-num-container')}>
                    <div className={cx('route-num')}>
                        <div className={cx('active-color')}></div>
                        <div className={cx('num')}>Tuyến 01 </div>
                        <div className={cx('active')}>Đang hoạt động</div>
                    </div>
                    <div className={cx('start-end')}>THPT ABC - TRUONG CONG DINH</div>
                </div>
                <div className={cx('route-location')}>
                    <div className={cx('location-title')}>
                        <FontAwesomeIcon icon={faLocationDot} className={cx('location-title-icon')} />
                        <span> Vị trí hiện tại </span>
                    </div>
                    <div className={cx('location-name')}>Cầu thị nghè</div>
                </div>
                <div className={cx('route-next-location')}>
                    <div className={cx('next-location-title')}>
                        <FontAwesomeIcon icon={faRightLong} className={cx('next-location-title-icon')} />
                        <span> Điểm dừng tiếp theo </span>
                    </div>
                    <div className={cx('next-location-name')}>Cầu thị nghè</div>
                </div>
            </div>
        </div>
    );
}

export default RouteStatus;
