import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import showToast from '../../../untils/ShowToast/showToast';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';
const cx = classNames.bind(styles);
function StudentManage({ students, handleConfirmStudent }) {
    const [stopNames, setStopNames] = useState({});
    const { t } = useTranslation();

    const fetchStopByStopId = async (stop_id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/stops/${stop_id}`);
            setStopNames((prev) => ({ ...prev, [stop_id]: res.data.stop_name }));
        } catch (error) {
            console.log('Lỗi fetchStopByStopId: ', error);
        }
    };

    useEffect(() => {
        if (!students) return;

        students.forEach(async (st) => {
            if (!stopNames[st.stop_id]) {
                fetchStopByStopId(st.stop_id);
            }
        });
    }, [students]);

    if (!students) {
        return (
            <div className={cx('student-manage')} id="student-manage">
                <div className={cx('student-manage-title')}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span>{t('student_manage')}</span>
                </div>
                <h2>{t('no_active_route')}.</h2>
            </div>
        );
    }
    return (
        <div className={cx('student-manage')} id="student-manage">
            <div className={cx('student-manage-title')}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>{t('student_manage')}</span>
            </div>
            {students ? (
                <div className={cx('student-manage-table')}>
                    <table>
                        <thead>
                            <tr>
                                <th>{t('student_id')}</th>
                                <th>{t('full_name')}</th>
                                <th>{t('class_name')}</th>
                                <th>{t('stop_name')}</th>
                                <th>{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((st) => {
                                return (
                                    <tr key={st.student_id}>
                                        <td>
                                            <span>{st.student_id}</span>
                                        </td>
                                        <td>{st.student_name}</td>
                                        <td>{st.class_name}</td>
                                        <td>{stopNames[st.stop_id]}</td>
                                        <td>
                                            <div className={cx('student-manage-table-btn')}>
                                                {st.status === 1 ? t('boarded') : t('not_boarded')}
                                                {st.status === 0 && (
                                                    <button
                                                        onClick={() => {
                                                            handleConfirmStudent(
                                                                1,
                                                                st.student_id,
                                                                st.student_name,
                                                                st.parent_id,
                                                            );
                                                        }}
                                                    >
                                                        {t('confirm_boarded')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {students.map((st) => {
                                return (
                                    <tr key={st.student_id}>
                                        <td>
                                            <span>{st.student_id}</span>
                                        </td>
                                        <td>{st.student_name}</td>
                                        <td>{st.class_name}</td>
                                        <td>{stopNames[st.stop_id]}</td>
                                        <td>
                                            <div className={cx('student-manage-table-btn')}>
                                                {st.status === 1 ? t('boarded') : t('not_boarded')}
                                                {st.status === 0 && (
                                                    <button
                                                        onClick={() => {
                                                            handleConfirmStudent(
                                                                1,
                                                                st.student_id,
                                                                st.student_name,
                                                                st.parent_id,
                                                            );
                                                        }}
                                                    >
                                                        {t('confirm_boarded')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h2>{t('no_active_route')}.</h2>
            )}
        </div>
    );
}

export default StudentManage;
