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

const cx = classNames.bind(styles);

function Doing({ currentAssignment }) {
    // Nếu không có tuyến nào đang chạy, hiển thị thông báo
    if (!currentAssignment) {
        return (
            <div className={cx('doing')} id="doing">
                <div className={cx('doing-title')}>
                    <FontAwesomeIcon icon={faBell} />
                    <span>Tuyến Xe Đang Thực Hiện</span>
                </div>
                <p>Hiện không có tuyến nào đang được thực hiện.</p>
            </div>
        );
    }

    return (
        <div className={cx('doing')} id="doing">
            {/* ... (giữ lại title) */}
            <div className={cx('doing-infor')}>
                <div className={cx('route-num')}>
                    <div className={cx('route-num-title')}>
                        <FontAwesomeIcon icon={faBus} className={cx('route-num-title-icon')} />
                        <span>Xe 01 </span>
                    </div>
                    {/* Thay thế dữ liệu tĩnh bằng dữ liệu từ props */}
                    <div className={cx('route-num-name')}>{currentAssignment.license_plate}</div>
                </div>
                <div className={cx('driver-infor')}>
                    <div className={cx('driver-infor-title')}>
                        <FontAwesomeIcon icon={faIdCard} className={cx('driver-infor-title-icon')} />
                        <span>Tài xế </span>
                    </div>
                    <div className={cx('driver-infor-name')}>{currentAssignment.driver_name}</div>
                </div>
                <div className={cx('bus-active')}>
                    <div className={cx('bus-active-title')}>
                        <FontAwesomeIcon icon={faSignal} className={cx('bus-active-title-icon')} />
                        <span>Trạng thái </span>
                    </div>
                    <div className={cx('bus-active-name')}>{currentAssignment.status}</div>
                </div>
            </div>
            <div className={cx('doing-route')}>
                <div className={cx('doing-route-title')}>
                    <FontAwesomeIcon icon={faMapLocationDot} className={cx('doing-route-title-icon')} />
                    <span>Tuyến đường </span>
                </div>
                <div className={cx('doing-route-name')}>
                    {/* Hiển thị tên tuyến */}
                    <span>{currentAssignment.route_name}</span>
                </div>
                {/* Các phần vị trí hiện tại và điểm tiếp theo sẽ được cập nhật ở Tuần 6 (real-time) */}
            </div>
        </div>
    );
}

export default Doing;
