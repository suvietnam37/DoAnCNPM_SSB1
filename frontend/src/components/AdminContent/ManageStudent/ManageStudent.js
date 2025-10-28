// src/components/AdminContent/ManageStudent/ManageStudent.js
import styles from './ManageStudent.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function ManageStudent() {
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [allStops, setAllStops] = useState([]);
    const [filteredStops, setFilteredStops] = useState([]);

    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [studentName, setStudentName] = useState('');
    const [className, setClassName] = useState('');
    const [isAbsent, setIsAbsent] = useState(0);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [selectedStopId, setSelectedStopId] = useState(null);
    const [selectedParentId, setSelectedParentId] = useState(null);

    const fetchData = async () => {
        try {
            const [studentsRes, parentsRes, routesRes, stopsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/students'),
                axios.get('http://localhost:5000/api/parents'),
                axios.get('http://localhost:5000/api/routes'),
                axios.get('http://localhost:5000/api/stops')
            ]);
            setStudents(studentsRes.data);
            setParents(parentsRes.data);
            setRoutes(routesRes.data);
            setAllStops(stopsRes.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            showToast("Không thể tải dữ liệu trang.", false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedRouteId) {
            setFilteredStops([]);
            return;
        }
        const stopsForRoute = allStops.filter(stop => String(stop.route_id) === String(selectedRouteId));
        setFilteredStops(stopsForRoute);
    }, [selectedRouteId, allStops]);

    const resetFormState = () => {
        setStudentName('');
        setClassName('');
        setIsAbsent(0);
        setSelectedRouteId(null);
        setSelectedStopId(null);
        setSelectedParentId(null);
        setSelectedStudent(null);
        setFilteredStops([]);
    };

    const handleOpenModal = (type, student = null) => {
        resetFormState();
        setIsOpenModal(type);

        if (student) {
            setSelectedStudent(student);
            if (type === 'edit') {
                setStudentName(student.student_name);
                setClassName(student.class_name);
                setSelectedParentId(String(student.parent_id));
                setSelectedStopId(String(student.stop_id));
                setIsAbsent(student.is_absent);

                const currentStop = allStops.find(stop => String(stop.stop_id) === String(student.stop_id));
                if (currentStop) {
                    setSelectedRouteId(String(currentStop.route_id));
                }
            }
        }
    };

    const handleCloseModal = () => {
        setIsOpenModal('');
        resetFormState();
    };

    const handleAddStudent = async () => {
        if (!studentName.trim() || !className.trim() || !selectedParentId || !selectedStopId) {
            showToast('Vui lòng điền đủ thông tin và chọn tuyến, trạm, phụ huynh!', false);
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/students', {
                student_name: studentName,
                class_name: className,
                parent_id: selectedParentId,
                stop_id: selectedStopId,
                is_absent: isAbsent,
            });
            showToast('Thêm học sinh thành công!', true);
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Add student error:', error);
            showToast('Lỗi khi thêm học sinh.', false);
        }
    };

    const handleEditStudent = async () => {
        if (!studentName.trim() || !className.trim() || !selectedParentId || !selectedStopId) {
            showToast('Vui lòng điền đủ thông tin!', false);
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/students/${selectedStudent.student_id}`, {
                student_name: studentName,
                class_name: className,
                parent_id: selectedParentId,
                stop_id: selectedStopId,
                is_absent: isAbsent,
            });
            showToast('Cập nhật học sinh thành công!', true);
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Edit student error:', error);
            showToast('Lỗi khi cập nhật học sinh.', false);
        }
    };

    const handleDeleteStudent = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/students/${selectedStudent.student_id}`);
            showToast('Xóa học sinh thành công!', true);
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Delete student error:', error);
            showToast('Lỗi khi xóa học sinh.', false);
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
                        <th>Mã HS</th>
                        <th>Tên học sinh</th>
                        <th>Lớp</th>
                        <th>Mã PH</th>
                        <th>Mã trạm</th>
                        <th>Vắng mặt</th>
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
                            <td>{student.is_absent ? 'Có' : 'Không'}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', student)}>Sửa</button>
                                <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', student)}>Xóa</button>
                            </td>
                            <td>
                                <button className={cx('btn', 'details')} onClick={() => handleOpenModal('details', student)}>...</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL THÊM */}
            {isOpenModal === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content-large')}>
                        <div className={cx('modal-header')}>
                            <h3>Thêm học sinh mới</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>

                        <div className={cx('form')}>
                            <div className={cx('input-group')}>
                                <input type="text" placeholder="Tên học sinh" className={cx('input')} value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                                <input type="text" placeholder="Lớp" className={cx('input')} value={className} onChange={(e) => setClassName(e.target.value)} />
                            </div>

                            <div className={cx('selection-container')}>
                                {/* Tuyến xe */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>Chọn Tuyến Xe</h4>
                                    <table className={cx('selection-table')}>
                                        <thead><tr><th>Mã tuyến</th><th>Tên tuyến</th><th>Chọn</th></tr></thead>
                                        <tbody>
                                            {routes.map(route => (
                                                <tr key={route.route_id} className={selectedRouteId === String(route.route_id) ? cx('selectedRow') : ''}>
                                                    <td>{route.route_id}</td>
                                                    <td>{route.route_name}</td>
                                                    <td>
                                                        <input type="radio" name="route" value={route.route_id} checked={selectedRouteId === String(route.route_id)} onChange={(e) => { setSelectedRouteId(e.target.value); setSelectedStopId(null); }} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Trạm dừng */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>Chọn Trạm Dừng</h4>
                                    <table className={cx('selection-table')}>
                                        <thead><tr><th>Mã trạm</th><th>Tên trạm</th><th>Chọn</th></tr></thead>
                                        <tbody>
                                            {filteredStops.length > 0 ? filteredStops.map(stop => (
                                                <tr key={stop.stop_id} className={selectedStopId === String(stop.stop_id) ? cx('selectedRow') : ''}>
                                                    <td>{stop.stop_id}</td>
                                                    <td>{stop.stop_name}</td>
                                                    <td>
                                                        <input type="radio" name="stop" value={stop.stop_id} checked={selectedStopId === String(stop.stop_id)} onChange={(e) => setSelectedStopId(e.target.value)} />
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="3">Vui lòng chọn một tuyến xe để xem trạm dừng.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Phụ huynh */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>Chọn Phụ Huynh</h4>
                                    <table className={cx('selection-table')}>
                                        <thead><tr><th>Mã PH</th><th>Tên Phụ huynh</th><th>Chọn</th></tr></thead>
                                        <tbody>
                                            {parents.map(parent => (
                                                <tr key={parent.parent_id} className={selectedParentId === String(parent.parent_id) ? cx('selectedRow') : ''}>
                                                    <td>{parent.parent_id}</td>
                                                    <td>{parent.parent_name}</td>
                                                    <td>
                                                        <input type="radio" name="parent" value={parent.parent_id} checked={selectedParentId === String(parent.parent_id)} onChange={(e) => setSelectedParentId(e.target.value)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')} style={{ justifyContent: 'center', marginTop: '20px' }}>
                                <button className={cx('btn', 'add')} onClick={handleAddStudent}>Thêm Học Sinh</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SỬA */}
            {isOpenModal === 'edit' && selectedStudent && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content-large')}>
                        <div className={cx('modal-header')}>
                            <h3>Sửa thông tin học sinh: {selectedStudent.student_name}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>

                        <div className={cx('form')}>
                            <div className={cx('input-group')}>
                                <input type="text" placeholder="Tên học sinh" className={cx('input')} value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                                <input type="text" placeholder="Lớp" className={cx('input')} value={className} onChange={(e) => setClassName(e.target.value)} />
                            </div>

                            <div className={cx('selection-container')}>
                                {/* Tuyến xe */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>Chọn Tuyến Xe</h4>
                                    <table className={cx('selection-table')}>
                                        <thead><tr><th>Mã tuyến</th><th>Tên tuyến</th><th>Chọn</th></tr></thead>
                                        <tbody>
                                            {routes.map(route => (
                                                <tr key={route.route_id} className={selectedRouteId === String(route.route_id) ? cx('selectedRow') : ''}>
                                                    <td>{route.route_id}</td>
                                                    <td>{route.route_name}</td>
                                                    <td>
                                                        <input type="radio" name="route" value={route.route_id} checked={selectedRouteId === String(route.route_id)} onChange={(e) => { setSelectedRouteId(e.target.value); setSelectedStopId(null); }} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Trạm dừng */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>Chọn Trạm Dừng</h4>
                                    <table className={cx('selection-table')}>
                                        <thead><tr><th>Mã trạm</th><th>Tên trạm</th><th>Chọn</th></tr></thead>
                                        <tbody>
                                            {filteredStops.length > 0 ? filteredStops.map(stop => (
                                                <tr key={stop.stop_id} className={selectedStopId === String(stop.stop_id) ? cx('selectedRow') : ''}>
                                                    <td>{stop.stop_id}</td>
                                                    <td>{stop.stop_name}</td>
                                                    <td>
                                                        <input type="radio" name="stop" value={stop.stop_id} checked={selectedStopId === String(stop.stop_id)} onChange={(e) => setSelectedStopId(e.target.value)} />
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="3">Vui lòng chọn một tuyến xe để xem trạm dừng.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Phụ huynh */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>Chọn Phụ Huynh</h4>
                                    <table className={cx('selection-table')}>
                                        <thead><tr><th>Mã PH</th><th>Tên Phụ huynh</th><th>Chọn</th></tr></thead>
                                        <tbody>
                                            {parents.map(parent => (
                                                <tr key={parent.parent_id} className={selectedParentId === String(parent.parent_id) ? cx('selectedRow') : ''}>
                                                    <td>{parent.parent_id}</td>
                                                    <td>{parent.parent_name}</td>
                                                    <td>
                                                        <input type="radio" name="parent" value={parent.parent_id} checked={selectedParentId === String(parent.parent_id)} onChange={(e) => setSelectedParentId(e.target.value)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')} style={{ justifyContent: 'center', marginTop: '20px' }}>
                                <button className={cx('btn', 'add')} onClick={handleEditStudent}>Cập nhật</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT */}
            {isOpenModal === 'details' && selectedStudent && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>
                        <h3>Chi tiết học sinh</h3>
                        <div className={cx('form')}>
                            <input type="text" value={selectedStudent.student_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.student_name} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.class_name} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.parent_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.stop_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedStudent.is_absent ? 'Có' : 'Không'} readOnly className={cx('input')} />
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {isOpenModal === 'delete' && selectedStudent && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>X</button>
                        </div>
                    <h3>Xác nhận xóa</h3>
                    <p>Bạn có chắc muốn xóa học sinh "<strong>{selectedStudent.student_name}</strong>"?</p>
                        <div className={cx('buttons')}>
                            <button className={cx('btn', 'cancel')} onClick={handleCloseModal}>
                                Hủy
                            </button>
                            <button className={cx('btn', 'danger')} onClick={handleDeleteStudent}>
                                Xác nhận Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStudent;