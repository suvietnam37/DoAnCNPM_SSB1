import styles from './RouteManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function RouteManage({ assignments, onStartRoute }) {
    const [stopCounts, setStopCounts] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStops, setModalStops] = useState([]);

    // Lấy số trạm cho từng assignment
    useEffect(() => {
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

    return (
        <div className={cx('route-manage')} id="route-manage">
            <div className={cx('route-manage-title')}>
                <FontAwesomeIcon icon={faRoute} />
                <span>Danh Sách Tuyến Xe Cần Thực Hiện Ngày: {todayDisplay}</span>
            </div>

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
                            {assignments.map((asm) => {
                                if (new Date(asm.run_date).toLocaleDateString('vi-VN').replace(/\//g, '-') === today) {
                                    return (
                                        <tr key={asm.assignment_id}>
                                            <td>
                                                {new Date(asm.run_date).toLocaleDateString('vi-VN').replace(/\//g, '-')}
                                            </td>
                                            <td>{asm.departure_time}</td>
                                            <td>
                                                <div
                                                    className={cx('stop-num')}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
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
                                                        onClick={() => onStartRoute(asm.assignment_id, asm.route_id)}
                                                        className={cx('btn', 'add')}
                                                    >
                                                        Bắt đầu
                                                    </button>
                                                )}
                                                {asm.status === 'Running' && <span>Đang thực hiện</span>}
                                                {asm.status === 'Completed' && <span>Đã hoàn thành</span>}
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
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
