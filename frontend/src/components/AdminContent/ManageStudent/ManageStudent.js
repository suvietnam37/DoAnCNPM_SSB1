// src/components/AdminContent/ManageStudent/ManageStudent.js
import styles from './ManageStudent.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../../untils/CustomAxios/axios.customize';
import showToast from '../../../untils/ShowToast/showToast';
import { useTranslation } from 'react-i18next';
import '../../../untils/ChangeLanguage/i18n';

const cx = classNames.bind(styles);

function ManageStudent() {
    const { t } = useTranslation();

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
                axios.get('http://localhost:5000/api/stops'),
            ]);
            setStudents(studentsRes.data);
            setParents(parentsRes.data);
            setRoutes(routesRes.data);
            setAllStops(stopsRes.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            showToast('load_student_failed', false);
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
        const stopsForRoute = allStops.filter((stop) => String(stop.route_id) === String(selectedRouteId));
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

                const currentStop = allStops.find((stop) => String(stop.stop_id) === String(student.stop_id));
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
            showToast('please_enter_student_full_info', false);
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
            showToast('add_student_success');
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Add student error:', error);
            showToast('add_student_failed', false);
        }
    };

    const handleEditStudent = async () => {
        if (!studentName.trim() || !className.trim() || !selectedParentId || !selectedStopId) {
            showToast('please_enter_student_full_info', false);
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
            showToast('update_student_success');

            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Edit student error:', error);
            showToast('update_student_failed', false);
        }
    };

    const handleDeleteStudent = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/students/${selectedStudent.student_id}`);
            showToast('delete_student_success');
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Delete student error:', error);
            showToast('delete_student_failed', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>{t('student_management')}</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    {t('add_student')}
                </button>
            </div>
            <div className={cx('table-wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>{t('student_code')}</th>
                            <th>{t('student_name')}</th>
                            <th>{t('class')}</th>
                            <th>{t('absent_status')}</th>
                            <th>{t('action')}</th>
                            <th>{t('details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.student_id}>
                                <td>{student.student_id}</td>
                                <td>{student.student_name}</td>
                                <td>{student.class_name}</td>
                                <td>{student.is_absent ? t('yes') : t('no')}</td>
                                <td>
                                    <button
                                        className={cx('btn', 'change')}
                                        onClick={() => handleOpenModal('edit', student)}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        className={cx('btn', 'danger')}
                                        onClick={() => handleOpenModal('delete', student)}
                                    >
                                        {t('delete')}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={cx('btn', 'details')}
                                        onClick={() => handleOpenModal('details', student)}
                                    >
                                        ...
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL THÊM */}
            {isOpenModal === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content-large')}>
                        <div className={cx('modal-header')}>
                            <h3>{t('add_student_title')}</h3>

                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>

                        <div className={cx('form')}>
                            <div className={cx('input-group')}>
                                <input
                                    type="text"
                                    placeholder={t('student_name')}
                                    className={cx('input')}
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder={t('class_name')}
                                    className={cx('input')}
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                />
                            </div>

                            <div className={cx('selection-container')}>
                                {/* Bus Route */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>{t('select_route')}</h4>
                                    <table className={cx('selection-table')}>
                                        <thead>
                                            <tr>
                                                <th>{t('route_id')}</th>
                                                <th>{t('route_name')}</th>
                                                <th>{t('select')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routes.map((route) => (
                                                <tr
                                                    key={route.route_id}
                                                    className={
                                                        selectedRouteId === String(route.route_id)
                                                            ? cx('selectedRow')
                                                            : ''
                                                    }
                                                >
                                                    <td>{route.route_id}</td>
                                                    <td>{route.route_name}</td>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            name="route"
                                                            value={route.route_id}
                                                            checked={selectedRouteId === String(route.route_id)}
                                                            onChange={(e) => {
                                                                setSelectedRouteId(e.target.value);
                                                                setSelectedStopId(null);
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Stop */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>{t('select_stop')}</h4>
                                    <table className={cx('selection-table')}>
                                        <thead>
                                            <tr>
                                                <th>{t('stop_id')}</th>
                                                <th>{t('stop_name')}</th>
                                                <th>{t('select')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStops.length > 0 ? (
                                                filteredStops.map((stop) => (
                                                    <tr
                                                        key={stop.stop_id}
                                                        className={
                                                            selectedStopId === String(stop.stop_id)
                                                                ? cx('selectedRow')
                                                                : ''
                                                        }
                                                    >
                                                        <td>{stop.stop_id}</td>
                                                        <td>{stop.stop_name}</td>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name="stop"
                                                                value={stop.stop_id}
                                                                checked={selectedStopId === String(stop.stop_id)}
                                                                onChange={(e) => setSelectedStopId(e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">{t('select_route_to_view_stop')}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Parents */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>{t('select_parent')}</h4>
                                    <table className={cx('selection-table')}>
                                        <thead>
                                            <tr>
                                                <th>{t('parent_id')}</th>
                                                <th>{t('parent_name')}</th>
                                                <th>{t('select')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parents.map((parent) => (
                                                <tr
                                                    key={parent.parent_id}
                                                    className={
                                                        selectedParentId === String(parent.parent_id)
                                                            ? cx('selectedRow')
                                                            : ''
                                                    }
                                                >
                                                    <td>{parent.parent_id}</td>
                                                    <td>{parent.parent_name}</td>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            name="parent"
                                                            value={parent.parent_id}
                                                            checked={selectedParentId === String(parent.parent_id)}
                                                            onChange={(e) => setSelectedParentId(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')} style={{ justifyContent: 'center', marginTop: '20px' }}>
                                <button className={cx('btn', 'add')} onClick={handleAddStudent}>
                                    {t('add_student_button')}
                                </button>
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
                            <h3>{t('edit_student_title', { name: selectedStudent.student_name })}</h3>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>

                        <div className={cx('form')}>
                            <div className={cx('input-group')}>
                                <div className={cx('flex-input')}>
                                    <label>{t('student_name_label')}: </label>
                                    <input
                                        type="text"
                                        placeholder={t('student_name_placeholder')}
                                        className={cx('input')}
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                    />
                                </div>
                                <div className={cx('flex-input')}>
                                    <label>{t('class_name_label')}: </label>
                                    <input
                                        type="text"
                                        placeholder={t('class_name_placeholder')}
                                        className={cx('input')}
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={cx('selection-container')}>
                                {/* Tuyến xe */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>{t('select_route')}</h4>
                                    <table className={cx('selection-table')}>
                                        <thead>
                                            <tr>
                                                <th>{t('route_id')}</th>
                                                <th>{t('route_name')}</th>
                                                <th>{t('select')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routes.map((route) => (
                                                <tr
                                                    key={route.route_id}
                                                    className={
                                                        selectedRouteId === String(route.route_id)
                                                            ? cx('selectedRow')
                                                            : ''
                                                    }
                                                >
                                                    <td>{route.route_id}</td>
                                                    <td>{route.route_name}</td>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            name="route"
                                                            value={route.route_id}
                                                            checked={selectedRouteId === String(route.route_id)}
                                                            onChange={(e) => {
                                                                setSelectedRouteId(e.target.value);
                                                                setSelectedStopId(null);
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Trạm dừng */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>{t('select_stop')}</h4>
                                    <table className={cx('selection-table')}>
                                        <thead>
                                            <tr>
                                                <th>{t('stop_id')}</th>
                                                <th>{t('stop_name')}</th>
                                                <th>{t('select')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStops.length > 0 ? (
                                                filteredStops.map((stop) => (
                                                    <tr
                                                        key={stop.stop_id}
                                                        className={
                                                            selectedStopId === String(stop.stop_id)
                                                                ? cx('selectedRow')
                                                                : ''
                                                        }
                                                    >
                                                        <td>{stop.stop_id}</td>
                                                        <td>{stop.stop_name}</td>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name="stop"
                                                                value={stop.stop_id}
                                                                checked={selectedStopId === String(stop.stop_id)}
                                                                onChange={(e) => setSelectedStopId(e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">{t('select_route_to_view_stop')}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Phụ huynh */}
                                <div className={cx('selection-table-wrapper')}>
                                    <h4>{t('select_parent')}</h4>
                                    <table className={cx('selection-table')}>
                                        <thead>
                                            <tr>
                                                <th>{t('parent_id')}</th>
                                                <th>{t('parent_name')}</th>
                                                <th>{t('select')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parents.map((parent) => (
                                                <tr
                                                    key={parent.parent_id}
                                                    className={
                                                        selectedParentId === String(parent.parent_id)
                                                            ? cx('selectedRow')
                                                            : ''
                                                    }
                                                >
                                                    <td>{parent.parent_id}</td>
                                                    <td>{parent.parent_name}</td>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            name="parent"
                                                            value={parent.parent_id}
                                                            checked={selectedParentId === String(parent.parent_id)}
                                                            onChange={(e) => setSelectedParentId(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')} style={{ justifyContent: 'center', marginTop: '20px' }}>
                                <button className={cx('btn', 'add')} onClick={handleEditStudent}>
                                    {t('update')}
                                </button>
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
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>{t('student_details_title')}</h3>

                        <div className={cx('form')}>
                            <div className={cx('flex-input')}>
                                <label>{t('student_code_label')}: </label>
                                <input
                                    type="text"
                                    value={selectedStudent.student_id}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('student_name_label')}: </label>
                                <input
                                    type="text"
                                    value={selectedStudent.student_name}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('class_name_label')}: </label>
                                <input
                                    type="text"
                                    value={selectedStudent.class_name}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('parent_id_label')}: </label>
                                <input type="text" value={selectedStudent.parent_id} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('stop_id_label')}: </label>
                                <input type="text" value={selectedStudent.stop_id} readOnly className={cx('input')} />
                            </div>
                            <div className={cx('flex-input')}>
                                <label>{t('absent_status_label')}: </label>
                                <input
                                    type="text"
                                    value={selectedStudent.is_absent ? t('yes') : t('no')}
                                    readOnly
                                    className={cx('input')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpenModal === 'delete' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>{t('confirm_delete_student')} ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteStudent}>
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStudent;
