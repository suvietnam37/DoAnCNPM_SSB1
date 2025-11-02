import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import showToast from '../../../untils/ShowToast/showToast';
import axios from 'axios';
const cx = classNames.bind(styles);
function StudentManage({ students, handleConfirmStudent }) {
    return (
        <div className={cx('student-manage')} id="student-manage">
            <div className={cx('student-manage-title')}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>Quản Lý Học Sinh</span>
            </div>
            <div className={cx('student-manage-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>Mã học sinh</th>
                            <th>Họ tên</th>
                            <th>Lớp</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((st) => (
                            <tr key={st.student_id}>
                                <td>
                                    <span>{st.student_id}</span>
                                </td>
                                <td>{st.student_name}</td>
                                <td>{st.class_name}</td>
                                <td>
                                    <div className={cx('student-manage-table-btn')}>
                                        {st.status == 1 ? 'Đã lên xe' : 'Chưa lên xe'}
                                        {st.status == 0 && (
                                            <button
                                                onClick={() => {
                                                    handleConfirmStudent(1, st.student_id);
                                                }}
                                            >
                                                Xác nhận đã lên xe
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentManage;
