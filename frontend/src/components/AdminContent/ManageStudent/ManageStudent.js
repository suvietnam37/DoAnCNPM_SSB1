// src/pages/ManageStudent/ManageStudent.js
import styles from './ManageStudent.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageStudent() {
    const [students, setStudents] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [className, setClassName] = useState('');
    const [parentId, setParentId] = useState('');
    const [stopId, setStopId] = useState('');
    const [isAbsent, setIsAbsent] = useState(0);

    // Lấy danh sách học sinh từ API
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Mở modal
    const handleOpenModal = (type, student = null) => {
        setIsOpenModal(type);
        setSelectedStudent(student);
        setStudentName(student ? student.student_name : '');
        setClassName(student ? student.class_name : '');
        setParentId(student ? student.parent_id : '');
        setStopId(student ? student.stop_id : '');
        setIsAbsent(student ? student.is_absent : 0);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedStudent(null);
        setStudentName('');
        setClassName('');
        setParentId('');
        setStopId('');
        setIsAbsent(0);
    };

    // Thêm học sinh
    const handleAddStudent = async () => {
        if (!studentName.trim() || !className.trim() || !parentId.trim() || !stopId.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/students', {
                student_name: studentName,
                class_name: className,
                parent_id: parentId,
                stop_id: stopId,
                is_absent: isAbsent,
            });
            alert('Thêm học sinh thành công!');
            handleCloseModal();
            fetchStudents();
        } catch (error) {
            console.error('Add student error:', error);
            alert('Lỗi khi thêm học sinh.');
        }
    };

    // Sửa học sinh
    const handleEditStudent = async () => {
        if (!studentName.trim() || !className.trim() || !parentId.trim() || !stopId.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/students/${selectedStudent.student_id}`, {
                student_name: studentName,
                class_name: className,
                parent_id: parentId,
                stop_id: stopId,
                is_absent: isAbsent,
            });
            alert('Cập nhật học sinh thành công!');
            handleCloseModal();
            fetchStudents();
        } catch (error) {
            console.error('Edit student error:', error);
            alert('Lỗi khi sửa học sinh.');
        }
    };

    // Xóa học sinh
    const handleDeleteStudent = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/students/${selectedStudent.student_id}`);
            alert('Xóa học sinh thành công!');
            handleCloseModal();
            fetchStudents();
        } catch (error) {
            console.error('Delete student error:', error);
            alert('Lỗi khi xóa học sinh.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý học sinh</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm học sinh
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã học sinh</th>
                        <th>Tên học sinh</th>
                        <th>Lớp</th>
                        <th>Mã phụ huynh</th>
                        <th>Mã trạm</th>
                        <th>Vắng</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.student_id}>
                            <td>{student.student_id}</td>
                            <td>{student.student_name}</td>
                            <td>{student.class_name}</td>
                            <td>{student.parent_id}</td>
                            <td>{student.stop_id}</td>
                            <td>{student.is_absent}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', student)}>
                                    Sửa
                                </button>
                                <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', student)}>
                                    Xóa
                                </button>
                            </td>
                            <td>
                                <button className={cx('btn', 'details')} onClick={() => handleOpenModal('details', student)}>
                                    ...
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Sửa */}
            {isOpenModal === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Sửa học sinh</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên học sinh"
                                className={cx('input')}
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Lớp"
                                className={cx('input')}
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã phụ huynh"
                                className={cx('input')}
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã trạm"
                                className={cx('input')}
                                value={stopId}
                                onChange={(e) => setStopId(e.target.value)}
                            />
                            <select
                                value={isAbsent}
                                onChange={(e) => setIsAbsent(parseInt(e.target.value))}
                                className={cx('input')}
                            >
                                <option value={0}>Không vắng</option>
                                <option value={1}>Vắng</option>
                            </select>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditStudent}>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Thêm */}
            {isOpenModal === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Thêm học sinh</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên học sinh"
                                className={cx('input')}
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Lớp"
                                className={cx('input')}
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã phụ huynh"
                                className={cx('input')}
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã trạm"
                                className={cx('input')}
                                value={stopId}
                                onChange={(e) => setStopId(e.target.value)}
                            />
                            <select
                                value={isAbsent}
                                onChange={(e) => setIsAbsent(parseInt(e.target.value))}
                                className={cx('input')}
                            >
                                <option value={0}>Không vắng</option>
                                <option value={1}>Vắng</option>
                            </select>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddStudent}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết */}
            {isOpenModal === 'details' && selectedStudent && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Chi tiết học sinh</h3>
                        <div className={cx('form')}>
                            <input type="text" value={selectedStudent.student_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.student_name} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.class_name} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.parent_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.stop_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.is_absent} readOnly className={cx('input')} />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xóa */}
            {isOpenModal === 'delete' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Xác nhận xóa học sinh?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteStudent}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStudent;