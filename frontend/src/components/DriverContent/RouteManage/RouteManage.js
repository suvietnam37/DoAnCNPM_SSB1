import styles from './RouteManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import showToast from '../../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function RouteManage({ assignments, onStartRoute }) {
    const [stopCounts, setStopCounts] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStops, setModalStops] = useState([]);

    useEffect(() => {
        assignments.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
        async function fetchStopCounts() {
            const result = {};
            for (const asm of assignments) {
                const res = await axios.get(
                    `http://localhost:5000/api/route_assignments/${asm.assignment_id}/stop-count`,
                );
                result[asm.assignment_id] = res.data.stop_count;
            }
            setStopCounts(result);
        }
        if (assignments.length > 0) fetchStopCounts();
    }, [assignments]);

    const today = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    const todayDisplay = new Date().toLocaleDateString('vi-VN');

    // Lọc assignment theo ngày hôm nay
    const todayAssignments = assignments.filter(
        (asm) => new Date(asm.run_date).toLocaleDateString('vi-VN').replace(/\//g, '-') === today,
    );

    const handleOpenModal = async (asm) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/stops?route_id=${asm.route_id}`);
            setModalStops(res.data);
            setModalOpen(true);
        } catch (err) {
            console.error('Lỗi fetch stops:', err);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalStops([]);
    };

    const handleCheck = async (Id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/route_assignments/${Id}`);
            const departure_time_start = res.data.departure_time;
            for (const a of assignments) {
                if (departure_time_start.localeCompare(a.departure_time) > 0 && a.status !== 'Completed') {
                    console.log('hihi');
                    showToast('Vui lòng hoàn thành chuyến xe trước đó', false);
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.log('Lỗi: ', error);
            return false;
        }
    };

    return (
        <div className={cx('route-manage')} id="route-manage">
            <div className={cx('route-manage-title')}>
                <FontAwesomeIcon icon={faRoute} />
                <span>Danh Sách Tuyến Xe Cần Thực Hiện Ngày: {todayDisplay}</span>
            </div>

            {todayAssignments.length > 0 ? (
                <div className={cx('route-manage-table')}>
                    <div className={cx('table-wrapper')}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ngày chạy</th>
                                    <th>Giờ khởi hành</th>
                                    <th>Số trạm</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayAssignments.map((asm) => (
                                    <tr key={asm.assignment_id}>
                                        <td>
                                            {new Date(asm.run_date).toLocaleDateString('vi-VN').replace(/\//g, '-')}
                                        </td>
                                        <td>{asm.departure_time}</td>
                                        <td>
                                            <div className={cx('stop-num')}>
                                                {stopCounts[asm.assignment_id]}
                                                <button
                                                    className={cx('btn', 'details')}
                                                    onClick={() => handleOpenModal(asm)}
                                                >
                                                    chi tiết
                                                </button>
                                            </div>
                                        </td>
                                        <td>{asm.status}</td>
                                        <td>
                                            {asm.status === 'Not Started' && (
                                                <button
                                                    onClick={async () => {
                                                        const c = await handleCheck(asm.assignment_id);
                                                        if (c) {
                                                            onStartRoute(asm.assignment_id, asm.route_id);
                                                        }
                                                    }}
                                                    className={cx('btn', 'add')}
                                                >
                                                    Bắt đầu
                                                </button>
                                            )}
                                            {asm.status === 'Running' && <span>Đang thực hiện</span>}
                                            {asm.status === 'Completed' && <span>Đã hoàn thành</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <h2>Không có tuyến xe cần thực hiện hôm nay</h2>
            )}

            {modalOpen && (
                <div className={cx('modal-overlay')} onClick={handleCloseModal}>
                    <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                        <button className={cx('modal-close')} onClick={handleCloseModal}>
                            &times;
                        </button>
                        <h3>Chi tiết các trạm</h3>
                        <div className={cx('table-wrapper')}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mã trạm</th>
                                        <th>Tên trạm</th>
                                        <th>Địa chỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalStops.map((stop) => (
                                        <tr key={stop.stop_id}>
                                            <td>{stop.stop_id}</td>
                                            <td>{stop.stop_name}</td>
                                            <td>{stop.address}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RouteManage;
