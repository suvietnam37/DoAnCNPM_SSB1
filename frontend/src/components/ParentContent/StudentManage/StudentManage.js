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
const cx = classNames.bind(styles);

function StudentManage({ routeStatus, students, setStudents }) {
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

                showToast('Xin vắng thành công');
            } catch (error) {
                showToast('Lỗi hệ thống', false);
            }
        });
    };

    return (
        <div className={cx('student-manage')} id="student-manage">
            <div className={cx('student-manage-title')}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>Quản Lý Con Em</span>
            </div>
            <div className={cx('student-manage-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>Mã học sinh</th>
                            <th>Họ tên</th>
                            <th>Lớp</th>
                            <th>Trạng thái</th>
                            {!routeStatus && <th>Hành động</th>}
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
                                                    ? 'Chưa lên xe'
                                                    : 'Đã lên xe'
                                                : 'Vắng mặt'}
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
                                                Xin vắng
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Không có thông tin học sinh.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentManage;
