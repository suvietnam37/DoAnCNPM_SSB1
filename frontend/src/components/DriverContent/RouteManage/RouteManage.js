import styles from './RouteManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function RouteManage({ assignments, onStartRoute }) {
    const [stopCounts, setStopCounts] = useState({});

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

        if (assignments.length > 0) {
            fetchStopCounts();
        }
    }, [assignments]);

    const today = new Date().toLocaleDateString('vi-VN').split('/').reverse().join('-');
    const todayDisplay = new Date().toLocaleDateString('vi-VN');

    return (
        <div className={cx('route-manage')} id="route-manage">
            <div className={cx('route-manage-title')}>
                <FontAwesomeIcon icon={faRoute} />
                <span>Danh Sách Tuyến Xe Cần Thực Hiện Ngày : {todayDisplay}</span>
            </div>

            <div className={cx('route-manage-table')}>
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
                        {assignments
                            .filter((asm) => asm.run_date_vn.split('T')[0] === today)
                            .map((asm) => (
                                <tr key={asm.assignment_id}>
                                    <td>{asm.run_date_vn.split('T')[0]}</td>
                                    <td>{asm.departure_time}</td>
                                    <td>
                                        <div style={{ alignItems: 'center', marginLeft: '15px' }}>
                                            {stopCounts[asm.assignment_id]}
                                            <button className={cx('btn', 'details')}>chi tiết</button>
                                        </div>
                                    </td>
                                    <td>{asm.status}</td>
                                    <td>
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
