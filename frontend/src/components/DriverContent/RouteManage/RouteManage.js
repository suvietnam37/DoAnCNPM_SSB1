import styles from './RouteManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRoute,
    faGraduationCap,
    faBell,
    faBus,
    faIdCard,
    faSignal,
    faMapLocationDot,
    faRightLong,
    faMapPin,
    faExclamation,
} from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function RouteManage() {
    return (
        <div className={cx('route-manage')} id="route-manage">
            <div className={cx('route-manage-title')}>
                <FontAwesomeIcon icon={faRoute} />
                <span>Danh Sách Tuyến Xe</span>
            </div>
            <div className={cx('route-manage-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Xuất Phát</th>
                            <th>Bắt Đầu</th>
                            <th>Trạm 1</th>
                            <th>Trạm 2</th>
                            <th>Trạm 3</th>
                            <th>Kết Thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>4h</td>
                            <td>Trường THPT ABC</td>
                            <td>Cầu Thị Nghè</td>
                            <td>Ngã tư Hàng Xanh</td>
                            <td>Bến xe Miền Đông</td>
                            <td>Trường Tiểu học XYZ</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>17h</td>
                            <td>Trường Tiểu học XYZ</td>
                            <td>Bến xe Miền Đông</td>
                            <td>Ngã tư Hàng Xanh</td>
                            <td>Cầu Thị Nghè</td>
                            <td>Trường THPT ABC</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RouteManage;
