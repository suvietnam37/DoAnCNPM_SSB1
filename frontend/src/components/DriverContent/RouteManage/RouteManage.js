import styles from './RouteManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function RouteManage({ assignments, onStartRoute, pauseTest, resumeTest }) {
    const [stopCounts, setStopCounts] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStops, setModalStops] = useState([]);
    const [checked, setChecked] = useState(false);
    const { t } = useTranslation();

    const handleCheckboxChange = (e) => {
        setChecked(e.target.checked);
    };

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
                    showToast('finish_previous_trip', false);
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
                <span>
                    {t('route_list_to_run')}: {todayDisplay}
                </span>
                <div className={cx('simulator')}>
                    <div>
                        <input type="checkbox" value="test" checked={checked} onChange={handleCheckboxChange} />
                        <label>Test</label>
                    </div>
                    {checked && (
                        <>
                            <button
                                className={cx('btn', 'danger')}
                                onClick={() => {
                                    pauseTest();
                                }}
                            >
                                Pause
                            </button>
                            <button
                                className={cx('btn', 'add')}
                                onClick={() => {
                                    resumeTest();
                                }}
                            >
                                Continue
                            </button>
                        </>
                    )}
                </div>
            </div>

            {todayAssignments.length > 0 ? (
                <div className={cx('route-manage-table')}>
                    <div className={cx('table-wrapper')}>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('run_date')}</th>
                                    <th>{t('departure_time')}</th>
                                    <th>{t('stop_count')}</th>
                                    <th>{t('status')}</th>
                                    <th>{t('action')}</th>
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
                                                    {t('detail')}
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
                                                    {t('start')}
                                                </button>
                                            )}
                                            {asm.status === 'Running' && <span>{t('in_progress')}</span>}
                                            {asm.status === 'Completed' && <span>{t('completed')}</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <h2>{t('no_route_today')}</h2>
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
                                        <th>{t('stop_id')}</th>
                                        <th>{t('stop_name')}</th>
                                        <th>{t('stop_address')}</th>
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
