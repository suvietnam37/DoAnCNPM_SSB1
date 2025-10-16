import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function StudentManage() {
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
                            <th>Họ tên</th>
                            <th>Lớp</th>
                            <th>Mã học sinh</th>
                            <th>Trạng thái</th>
                            <th>Đã lên xe</th>
                            {/* <th>Trạng thái tiếp theo</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nguyễn Văn A</td>
                            <td>10A1</td>
                            <td>
                                <span>HS001</span>
                            </td>
                            <td>
                                <span>Đã lên xe</span>
                            </td>
                            <td>
                                <button>Xác Nhận</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Trần Thị B</td>
                            <td>10B2</td>
                            <td>
                                <span>HS002</span>
                            </td>
                            <td>
                                <span>Đang ở trường</span>
                            </td>
                            <td>
                                <button>Xác Nhận</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentManage;
