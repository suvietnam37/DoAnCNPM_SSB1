import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useRef, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/auth.context';
import { io } from 'socket.io-client';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
import showConfirm from '../../../untils/ShowConfirm/showConfirm';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';
const cx = classNames.bind(styles);

function StudentManage({ routeStatus, students, setStudents }) {
    const { t } = useTranslation();

    // const authContext = useContext(AuthContext);

    // const socketRef = useRef(null);

    // useEffect(() => {
    //     socketRef.current = io('http://localhost:5000');

    //     socketRef.current.emit('register', authContext?.auth?.user?.account_id);

    //     return () => {
    //         socketRef.current.disconnect();
    //     };
    // }, []);
    const handleAbsent = (student_id, student_name, newAbsent) => {
        showConfirm(`Xác nhận xin vắng học sinh ${student_name}`, 'Xác nhận', async () => {
            try {
                await axios.put('http://localhost:5000/api/students/absent', {
                    id: student_id,
                    is_absent: newAbsent,
                });

                setStudents((prev) =>
                    prev.map((s) => (s.student_id === student_id ? { ...s, is_absent: newAbsent } : s)),
                );

                showToast('absent_success');
            } catch (error) {
                showToast('system_error', false);
            }
        });
    };

    return (
        <div className={cx('student-manage')} id="student-manage">
            <div className={cx('student-manage-title')}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>{t('student_management')}</span>
            </div>
            <div className={cx('student-manage-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>{t('student_id')}</th>
                            <th>{t('full_name')}</th>
                            <th>{t('class_name')}</th>
                            <th>{t('status')}</th>
                            {!routeStatus && <th>{t('action')}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.student_id}>
                                    <td>{student.student_id}</td>
                                    <td>{student.student_name}</td>
                                    <td>{student.class_name}</td>

                                    <td>
                                        <span>
                                            {student.is_absent === 0
                                                ? student.status === 0
                                                    ? t('not_boarded')
                                                    : t('boarded')
                                                : t('absent')}
                                        </span>
                                    </td>
                                    {!routeStatus && (
                                        <td>
                                            <button
                                                className={cx('btn', { disabled: student.is_absent === 1 })}
                                                onClick={() => {
                                                    handleAbsent(student.student_id, student.student_name, 1);
                                                }}
                                            >
                                                {t('excused')}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">{t('no_student_info')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentManage;
