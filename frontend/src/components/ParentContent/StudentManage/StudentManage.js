import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useRef, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/auth.context';
import { io } from 'socket.io-client';
import axios from 'axios';
const cx = classNames.bind(styles);

function StudentManage({ students, setStudents }) {
    // const authContext = useContext(AuthContext);

    // const socketRef = useRef(null);

    // useEffect(() => {
    //     socketRef.current = io('http://localhost:5000');

    //     socketRef.current.emit('register', authContext?.auth?.user?.account_id);

    //     return () => {
    //         socketRef.current.disconnect();
    //     };
    // }, []);

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
                                        <span>{student.status === 0 ? 'Chưa lên xe' : 'Đã lên xe'}</span>
                                    </td>
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
