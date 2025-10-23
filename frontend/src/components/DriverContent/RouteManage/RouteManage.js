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
function RouteManage({ assignments, onStartRoute }) {
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
                            <th>Mã tuyến</th>
                            <th>Ngày chạy</th>
                            <th>Giờ khởi hành</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dùng map để render dữ liệu động */}
                        {assignments.map((asm) => (
                            <tr key={asm.assignment_id}>
                                <td>{asm.route_id}</td>
                                <td>{new Date(asm.run_date).toLocaleDateString('vi-VN')}</td>
                                <td>{asm.departure_time}</td>
                                <td>{asm.status}</td>
                                <td>
                                    {/* Chỉ hiển thị nút Bắt đầu nếu tuyến chưa bắt đầu */}
                                    {asm.status === 'Not Started' && (
                                        <button 
                                            onClick={() => onStartRoute(asm.assignment_id, asm.route_id)}
                                            className={cx('start-button')}
                                        >
                                            Bắt đầu
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RouteManage;
