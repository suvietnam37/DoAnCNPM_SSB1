import styles from './Report.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import showToast from '../../../untils/ShowToast/showToast';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);
function Report({ driver_name }) {
    const { t } = useTranslation();

    const [txtReport, setTxtReport] = useState('');
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleReport = async () => {
        socketRef.current.emit('report', 'Tài xế ' + driver_name + ': ' + txtReport);
        const roleId = 1;

        let toUserIds = [];

        try {
            const res = await axios.get(`http://localhost:5000/api/accounts/role/${roleId}`);
            toUserIds = res.data;
        } catch (error) {
            console.log(error, 'Lỗi khi thêm notification');
            return;
        }

        toUserIds.forEach(async (i) => {
            try {
                await axios.post('http://localhost:5000/api/notifications/create', {
                    accountId: i.account_id,
                    content: 'Tài xế ' + driver_name + ': ' + txtReport,
                });
            } catch (error) {
                console.log(error, 'Lỗi khi thêm notification');
                return;
            }
        });

        showToast('report_success');
        setTxtReport('');
    };

    return (
        <div className={cx('report')} id="report">
            <div className={cx('report-title')}>
                <FontAwesomeIcon icon={faExclamation} />
                <span>{t('report_issue')}</span>
            </div>
            <div className={cx('report-details')}>
                <label>{t('incident_description')} :</label>
                <textarea
                    value={txtReport}
                    onChange={(e) => {
                        setTxtReport(e.target.value);
                    }}
                ></textarea>
            </div>
            <div className={cx('btn-report')}>
                <button
                    onClick={() => {
                        handleReport();
                    }}
                >
                    {t('send')}
                </button>
            </div>
        </div>
    );
}

export default Report;
