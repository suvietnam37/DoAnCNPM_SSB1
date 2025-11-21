import styles from './StudentManage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import showToast from '../../../untils/ShowToast/showToast';
import axios from 'axios';
const cx = classNames.bind(styles);
function StudentManage({ students, handleConfirmStudent }) {
    const [stopNames, setStopNames] = useState({});

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
                    <span>Quản Lý Học Sinh</span>
                </div>
                <h2>Hiện không có tuyến nào đang được thực hiện.</h2>
            </div>
        );
    }
    return (
        <div className={cx('student-manage')} id="student-manage">
            <div className={cx('student-manage-title')}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>Quản Lý Học Sinh</span>
            </div>
            {students ? (
                <div className={cx('student-manage-table')}>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã học sinh</th>
                                <th>Họ tên</th>
                                <th>Lớp</th>
                                <th>Trạm đón trả</th>
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
                                    <td>{stopNames[st.stop_id]}</td>
                                    <td>
                                        <div className={cx('student-manage-table-btn')}>
                                            {st.status === 1 ? 'Đã lên xe' : 'Chưa lên xe'}
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
            ) : (
                <h2>Hiện không có tuyến nào đang được thực hiện.</h2>
            )}
        </div>
    );
}

export default StudentManage;
