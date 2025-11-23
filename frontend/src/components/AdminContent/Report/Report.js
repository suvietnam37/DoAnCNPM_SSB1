import styles from './Report.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import io from 'socket.io-client';
import { AuthContext } from '../../../context/auth.context';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function Report() {
    const { t } = useTranslation();

    const socketRef = useRef(null);

    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
    const [parents, setParents] = useState([]);
    const [studentParents, setStudentParents] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedParents, setSelectedParents] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [noti, setNoti] = useState('');

    const authContext = useContext(AuthContext);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register', authContext?.auth?.user?.account_id);

        return () => {
            console.log('Ngắt kết nối socket');
            socketRef.current.disconnect();
        };
    }, []);

    const send = async () => {
        const toUserIds = isOpenModalOpen === 'driver' ? selectedDrivers : selectedParents;
        toUserIds.forEach(async (i) => {
            try {
                await axios.post('http://localhost:5000/api/notifications/create', {
                    accountId: i,
                    content: noti,
                });
            } catch (error) {
                console.log(error, 'Lỗi khi thêm notification');
            }
        });

        if (!noti.trim() || toUserIds.length < 1) {
            showToast('please_enter_notification_or_recipient', false);
            return;
        }

        socketRef.current.emit('sendNotification', {
            toUserIds,
            message: noti,
        });

        showToast('send_notification_success');
        setNoti('');
        setSelectedDrivers([]);
        setSelectedParents([]);
    };

    useEffect(() => {
        fetchDrivers();
        fetchParents();
        fetchStudentParent();
    }, []);

    useEffect(() => {
        if (isOpenModalOpen !== 'parent') return;

        // new set loai bo trung lap
        const uniqueParentIds = [...new Set(studentParents.map((p) => p.account_id))];

        setSelectAll(uniqueParentIds.length > 0 && selectedParents.length === uniqueParentIds.length);
    }, [selectedParents, studentParents, isOpenModalOpen]);

    useEffect(() => {
        if (isOpenModalOpen !== 'driver') return;

        setSelectAll(drivers.length > 0 && drivers.length === selectedDrivers.length);
    }, [selectedDrivers, drivers, isOpenModalOpen]);

    const fetchStudentParent = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/with-parent/list');
            setStudentParents(response.data);
        } catch (err) {
            showToast('load_student_parent_failed', false);
        }
    };

    const fetchParents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/parents');
            setParents(response.data);
        } catch (error) {
            showToast('load_parent_failed', false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            showToast('load_driver_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>{t('report_issue')}</h2>

            <textarea
                placeholder={t('report_placeholder')}
                className={cx('textarea')}
                value={noti}
                onChange={(e) => setNoti(e.target.value)}
            />

            <div className={cx('report-content')}>
                <label>{t('recipient')}:</label>

                <select
                    className={cx('report-select')}
                    onChange={(e) => {
                        handleOpenModal(e.target.value);
                        setSelectAll(false);
                        setSelectedDrivers([]);
                        setSelectedParents([]);
                    }}
                >
                    <option value="">{t('select')}</option>
                    <option value="parent">{t('Parent')}</option>
                    <option value="driver">{t('Driver')}</option>
                </select>

                {isOpenModalOpen && (
                    <div className={cx('select-all')}>
                        <label htmlFor="checkall">{t('select_all')}</label>
                        <input
                            type="checkbox"
                            id="checkall"
                            checked={selectAll}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectAll(checked);

                                if (checked) {
                                    if (isOpenModalOpen === 'parent') {
                                        const uniqueParentIds = [...new Set(studentParents.map((p) => p.account_id))];
                                        setSelectedParents(uniqueParentIds);
                                    } else if (isOpenModalOpen === 'driver') {
                                        setSelectedDrivers(drivers.map((d) => d.account_id));
                                    }
                                } else {
                                    setSelectedParents([]);
                                    setSelectedDrivers([]);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {isOpenModalOpen === 'parent' && (
                <div className={cx('form-container')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>{t('student_code')}</th>
                                <th>{t('student_name')}</th>
                                <th>{t('parent_name')}</th>
                                <th>{t('phone')}</th>
                                <th>{t('select')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentParents.map((sp) => (
                                <tr key={sp.student_id}>
                                    <td>{sp.student_id}</td>
                                    <td>{sp.student_name}</td>
                                    <td>{sp.parent_name}</td>
                                    <td>{sp.phone}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            value={sp.account_id}
                                            checked={selectedParents.includes(sp.account_id)}
                                            onChange={() => {
                                                const id = sp.account_id;
                                                setSelectedParents((prev) =>
                                                    prev.includes(id)
                                                        ? prev.filter((item) => item !== id)
                                                        : [...prev, id],
                                                );
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpenModalOpen === 'driver' && (
                <div className={cx('form-container')}>
                    <div className={cx('table-wrapper')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>{t('driver_id')}</th>
                                    <th>{t('driver_name')}</th>
                                    <th>{t('select')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((driver) => (
                                    <tr key={driver.driver_id}>
                                        <td>{driver.driver_id}</td>
                                        <td>{driver.driver_name}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedDrivers.includes(driver.account_id)}
                                                onChange={() => {
                                                    const id = driver.account_id;
                                                    setSelectedDrivers((prev) =>
                                                        prev.includes(id)
                                                            ? prev.filter((item) => item !== id)
                                                            : [...prev, id],
                                                    );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className={cx('send-btn')}>
                <button className={cx('btn', 'danger')} onClick={send}>
                    {t('send')}
                </button>
            </div>
        </div>
    );
}

export default Report;
