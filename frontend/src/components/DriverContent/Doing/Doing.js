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
function Doing() {
    return (
        <div className={cx('doing')} id="doing">
            <div className={cx('doing-title')}>
                <FontAwesomeIcon icon={faBell} />
                <span>Tuyến Xe Đang Thực Hiện</span>
            </div>
            <div className={cx('doing-realtime')}>
                {/* <button className={cx('doing-realtime-details')}>Bắt Đầu</button> */}
                <button className={cx('doing-realtime-details')}>Đến Trạm Dừng</button>
                {/* <button className={cx('doing-realtime-details')}>Kết Thúc</button> */}
            </div>
            <div className={cx('doing-infor')}>
                <div className={cx('route-num')}>
                    <div className={cx('route-num-title')}>
                        <FontAwesomeIcon icon={faBus} className={cx('route-num-title-icon')} />
                        <span>Xe 01 </span>
                    </div>
                    <div className={cx('route-num-name')}>59A - 123455</div>
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
            <div className={cx('doing-route')}>
                <div className={cx('doing-route-title')}>
                    <FontAwesomeIcon icon={faMapLocationDot} className={cx('doing-route-title-icon')} />
                    <span>Tuyến đường </span>
                </div>
                <div className={cx('doing-route-name')}>
                    <span>Q8</span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span>Cầu Thị Nghè</span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span>Cầu Chữ Y</span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span>THPT Nguyễn Thị Lựu</span>
                </div>
                <div className={cx('doing-route-location')}>
                    <FontAwesomeIcon icon={faMapPin} className={cx('doing-route-title-icon')} />
                    <span>
                        Vị trí hiện tại : <p>Q7</p>
                    </span>
                </div>
                <div className={cx('doing-route-location')}>
                    <FontAwesomeIcon icon={faMapPin} className={cx('doing-route-title-icon')} />
                    <span>
                        Điểm tiếp theo : <p>Cầu Chữ Y</p>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Doing;
