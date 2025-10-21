// src/pages/ManageParent/ManageParent.js
import styles from './ManageParent.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageParent() {
    const [parents, setParents] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState('');
    const [selectedParent, setSelectedParent] = useState(null);
    const [parentName, setParentName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [accountId, setAccountId] = useState('');

    // Lấy danh sách phụ huynh từ API
    const fetchParents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/parents');
            setParents(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    // Mở modal
    const handleOpenModal = (type, parent = null) => {
        setIsOpenModal(type);
        setSelectedParent(parent);
        setParentName(parent ? parent.parent_name : '');
        setPhone(parent ? parent.phone : '');
        setEmail(parent ? parent.email : '');
        setAccountId(parent ? parent.account_id : '');
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsOpenModal('');
        setSelectedParent(null);
        setParentName('');
        setPhone('');
        setEmail('');
        setAccountId('');
    };

    // Thêm phụ huynh
    const handleAddParent = async () => {
        if (!parentName.trim() || !phone.trim() || !email.trim() || !accountId.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/parents', {
                parent_name: parentName,
                phone: phone,
                email: email,
                account_id: accountId,
            });
            alert('Thêm phụ huynh thành công!');
            handleCloseModal();
            fetchParents();
        } catch (error) {
            console.error('Add parent error:', error);
            alert('Lỗi khi thêm phụ huynh.');
        }
    };

    // Sửa phụ huynh
    const handleEditParent = async () => {
        if (!parentName.trim() || !phone.trim() || !email.trim() || !accountId.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/parents/${selectedParent.parent_id}`, {
                parent_name: parentName,
                phone: phone,
                email: email,
                account_id: accountId,
            });
            alert('Cập nhật phụ huynh thành công!');
            handleCloseModal();
            fetchParents();
        } catch (error) {
            console.error('Edit parent error:', error);
            alert('Lỗi khi sửa phụ huynh.');
        }
    };

    // Xóa phụ huynh
    const handleDeleteParent = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/parents/${selectedParent.parent_id}`);
            alert('Xóa phụ huynh thành công!');
            handleCloseModal();
            fetchParents();
        } catch (error) {
            console.error('Delete parent error:', error);
            alert('Lỗi khi xóa phụ huynh.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý phụ huynh</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm phụ huynh
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã phụ huynh</th>
                        <th>Tên phụ huynh</th>
                        <th>SĐT</th>
                        <th>Email</th>
                        <th>Mã tài khoản</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {parents.map((parent) => (
                        <tr key={parent.parent_id}>
                            <td>{parent.parent_id}</td>
                            <td>{parent.parent_name}</td>
                            <td>{parent.phone}</td>
                            <td>{parent.email}</td>
                            <td>{parent.account_id}</td>
                            <td>
                                <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit', parent)}>
                                    Sửa
                                </button>
                                <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete', parent)}>
                                    Xóa
                                </button>
                            </td>
                            <td>
                                <button className={cx('btn', 'details')} onClick={() => handleOpenModal('details', parent)}>
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
                        <h3>Sửa phụ huynh</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên phụ huynh"
                                className={cx('input')}
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="SĐT"
                                className={cx('input')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                className={cx('input')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã tài khoản"
                                className={cx('input')}
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleEditParent}>
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
                        <h3>Thêm phụ huynh</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên phụ huynh"
                                className={cx('input')}
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="SĐT"
                                className={cx('input')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                className={cx('input')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã tài khoản"
                                className={cx('input')}
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            />
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddParent}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết */}
            {isOpenModal === 'details' && selectedParent && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={handleCloseModal}>
                                X
                            </button>
                        </div>
                        <h3>Chi tiết phụ huynh</h3>
                        <div className={cx('form')}>
                            <input type="text" value={selectedParent.parent_id} readOnly className={cx('input')} />
                            <input type="text" value={selectedParent.parent_name} readOnly className={cx('input')} />
                            <input type="text" value={selectedParent.phone} readOnly className={cx('input')} />
                            <input type="text" value={selectedParent.email} readOnly className={cx('input')} />
                            <input type="text" value={selectedParent.account_id} readOnly className={cx('input')} />
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
                        <h3>Xác nhận xóa phụ huynh?</h3>
                        <button className={cx('btn', 'add')} onClick={handleDeleteParent}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageParent;