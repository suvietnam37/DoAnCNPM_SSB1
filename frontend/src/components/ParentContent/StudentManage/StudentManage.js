import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function StudentManage({ students }) {
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
                            <th>Họ tên</th>
                            <th>Lớp</th>
                            <th>Mã học sinh</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.student_id}>
                                    <td>{student.student_name}</td>
                                    <td>{student.class_name}</td>
                                    <td>HS{student.student_id}</td>
                                    <td>
                                        {/* Trạng thái này sẽ được cập nhật real-time sau */}
                                        <span>Đang cập nhật...</span>
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
