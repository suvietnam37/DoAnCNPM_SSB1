import styles from './Report.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';
const cx = classNames.bind(styles);

function Report() {
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
    const [parents, setParents] = useState([]);
    const [studentParents, setStudentParents] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedParents, setSelectedParents] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    useEffect(() => {
        fetchDrivers();
        fetchParents();
        fetchStudentParent();
    }, []);

    useEffect(() => {
        if (isOpenModalOpen === 'parent') {
            setSelectAll(selectedParents.length === studentParents.length);
        }
    }, [selectedParents, studentParents, isOpenModalOpen]);

    useEffect(() => {
        if (isOpenModalOpen === 'driver') {
            setSelectAll(selectedDrivers.length === drivers.length);
        }
    }, [selectedDrivers, drivers, isOpenModalOpen]);

    const fetchStudentParent = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/with-parent/list');
            setStudentParents(response.data);
        } catch (err) {
            showToast('Không thể tải danh sách học sinh + phụ huynh', false);
        }
    };

    const fetchParents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/parents');
            setParents(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách phụ huynh:', error);
            showToast('Không thể tải danh sách phụ huynh.', false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            showToast('Không thể tải danh sách tài xế.', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Báo cáo sự cố</h2>
            <textarea placeholder="Nhập nội dung báo cáo..." className={cx('textarea')} />
            <div className={cx('report-content')}>
                <label>Người nhận:</label>
                <select
                    className={cx('report-select')}
                    onChange={(e) => {
                        handleOpenModal(e.target.value);
                        setSelectAll(false);
                        setSelectedDrivers([]);
                        setSelectedParents([]);
                    }}
                >
                    <option value="">-- Chọn người nhận --</option>
                    <option value="parent">Phụ huynh</option>
                    <option value="driver">Tài xế</option>
                </select>
                <input type="text" placeholder="tìm kiếm ..." className={cx('input')} />
                {isOpenModalOpen && (
                    <div className={cx('select-all')}>
                        <label htmlFor="checkall">Chọn tất cả</label>
                        <input
                            type="checkbox"
                            id="checkall"
                            checked={selectAll}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectAll(checked);
                                if (checked) {
                                    if (isOpenModalOpen === 'parent') {
                                        setSelectedParents(studentParents.map((sp) => sp.parent_id));
                                    }
                                    if (isOpenModalOpen === 'driver') {
                                        setSelectedDrivers(drivers.map((d) => d.driver_id));
                                    }
                                } else {
                                    setSelectedParents([]);
                                    setSelectedDrivers([]);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
            {isOpenModalOpen === 'parent' && (
                <div className={cx('form-container')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã học sinh</th>
                                <th>Tên học sinh</th>
                                <th>Tên phụ huynh</th>
                                <th>SDT</th>
                                <th>Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentParents.map((sp) => (
                                <tr key={sp.student_id}>
                                    <td>{sp.student_id}</td>
                                    <td>{sp.student_name}</td>
                                    <td>{sp.parent_name}</td>
                                    <td>{sp.phone}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            value={sp.parent_id}
                                            checked={selectedParents.includes(sp.parent_id)}
                                            onChange={() => {
                                                const id = sp.parent_id;
                                                setSelectedParents((prev) =>
                                                    prev.includes(id)
                                                        ? prev.filter((item) => item !== id)
                                                        : [...prev, id],
                                                );
                                            }} // để React không warning
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isOpenModalOpen === 'driver' && (
                <div className={cx('form-container')}>
                    <div className={cx('table-wrapper')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Mã tài xế</th>
                                    <th>Tên tài xế </th>
                                    <th>Chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((driver) => {
                                    return (
                                        <tr key={driver.driver_id}>
                                            <td>{driver.driver_id}</td>
                                            <td>{driver.driver_name}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    value={driver.driver_id}
                                                    checked={selectedDrivers.includes(driver.driver_id)}
                                                    onChange={() => {
                                                        const id = driver.driver_id;
                                                        setSelectedDrivers((prev) =>
                                                            prev.includes(id)
                                                                ? prev.filter((item) => item !== id)
                                                                : [...prev, id],
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className={cx('send-btn')}>
                <button className={cx('btn', 'danger')}>Gửi báo cáo</button>
            </div>
        </div>
    );
}

export default Report;
