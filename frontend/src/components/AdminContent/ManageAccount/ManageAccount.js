import styles from './ManageAccount.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function ManageAccount() {
    const [accounts, setAccounts] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [parents, setParents] = useState([]);
    const [selectedRole, setSelectedRole] = useState(''); // '' | 'Parent' | 'Driver' | 'Admin'
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [selectedDriverId, setSelectedDriverId] = useState(null);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    const handleCloseModal = () => {
        setIsOpenModalOpen('');
    };

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/accounts');
            setAccounts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

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

    const handleAddAccount = async () => {
        try {
            let role_id;
            let relatedId = null;

            if (selectedRole === 'Driver') {
                role_id = 2;
                relatedId = selectedDriverId;
            } else if (selectedRole === 'Parent') {
                role_id = 3;
                relatedId = selectedParentId;
            } else {
                role_id = 1; // Admin
            }

            await axios.post('http://localhost:5000/api/accounts/create', {
                username,
                password,
                roleid: role_id,
                related_id: relatedId, // parent_id hoặc driver_id
            });
            showToast('Thêm tài khoản thành công');
            fetchAccounts(); // reload danh sách
            handleCloseModal();

            // reset state
            setUsername('');
            setPassword('');
            setSelectedRole('');
            setSelectedParentId(null);
            setSelectedDriverId(null);
        } catch (error) {
            console.error(error);
            showToast('Lỗi khi tạo tài khoản', false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Quản lý tài khoản</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm tài khoản
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên đăng nhập</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc) => {
                        return (
                            <tr key={acc.account_id}>
                                <td>{acc.account_id}</td>
                                <td>{acc.username}</td>
                                <td>{acc.role_name}</td>
                                <td>
                                    {acc.status === 'Active' ? (
                                        <div className={cx('status-container')}>
                                            <p>Hoạt động</p>
                                            <button
                                                className={cx('btn', 'lock')}
                                                onClick={() => handleOpenModal('lock')}
                                            >
                                                Khóa
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={cx('status-container')}>
                                            <p>Đã khóa</p>
                                            <button
                                                className={cx('btn', 'unlock')}
                                                onClick={() => handleOpenModal('unlock')}
                                            >
                                                Mở khóa
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button className={cx('btn', 'change')} onClick={() => handleOpenModal('edit')}>
                                        Sửa
                                    </button>
                                    <button className={cx('btn', 'danger')} onClick={() => handleOpenModal('delete')}>
                                        Xóa
                                    </button>
                                </td>
                                <td>
                                    <button className={cx('btn', 'details')} onClick={() => handleOpenModal('details')}>
                                        ...
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {isOpenModalOpen === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Sửa thông tin tài khoản</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Tên tài khoản" className={cx('input')} />
                            <input type="text" placeholder="Mật khẩu" className={cx('input')} />
                            <div className={cx('roles')}>
                                <label className={cx('role-label')}>
                                    <input type="radio" name="role" className={cx('radio')} />
                                    <span>Parent</span>
                                </label>
                                <label className={cx('role-label')}>
                                    <input type="radio" name="role" className={cx('radio')} />
                                    <span>Driver</span>
                                </label>
                                <label className={cx('role-label')}>
                                    <input type="radio" name="role" className={cx('radio')} />
                                    <span>Admin</span>
                                </label>
                            </div>
                            <input type="text" placeholder="Tên tài xế / phụ huynh cần tìm" className={cx('input')} />
                            <div className={cx('form-container')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã phụ huynh</th>
                                                <th>Tên phụ huynh</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>PH01</td>
                                                <td>Nguyễn Thị Lựu</td>
                                                <td>
                                                    <input type="radio" name="parent" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>PH02</td>
                                                <td>Nguyễn Ánh Lực</td>
                                                <td>
                                                    <input type="radio" name="parent" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>PH01</td>
                                                <td>Nguyễn Thị Lựu</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={() => handleCloseModal()}>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpenModalOpen === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Thêm tài khoản</h3>
                        <div className={cx('form')}>
                            <input
                                type="text"
                                placeholder="Tên tài khoản"
                                className={cx('input')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Mật khẩu"
                                className={cx('input')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className={cx('roles')}>
                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Parent"
                                        checked={selectedRole === 'Parent'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>Parent</span>
                                </label>

                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Driver"
                                        checked={selectedRole === 'Driver'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>Driver</span>
                                </label>

                                <label className={cx('role-label')}>
                                    <input
                                        type="radio"
                                        name="role"
                                        className={cx('radio')}
                                        value="Admin"
                                        checked={selectedRole === 'Admin'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>Admin</span>
                                </label>
                            </div>
                            <input type="text" placeholder="Tên tài xế / phụ huynh cần tìm" className={cx('input')} />
                            <div className={cx('form-container')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    Mã{' '}
                                                    {selectedRole === 'Parent'
                                                        ? 'Phụ huynh'
                                                        : selectedRole === 'Driver'
                                                        ? 'Tài xế'
                                                        : ''}
                                                </th>
                                                <th>
                                                    Tên{' '}
                                                    {selectedRole === 'Parent'
                                                        ? 'Phụ huynh'
                                                        : selectedRole === 'Driver'
                                                        ? 'Tài xế'
                                                        : ''}
                                                </th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRole === 'Parent' &&
                                                parents.map((parent) => {
                                                    if (parent.account_id == null)
                                                        return (
                                                            <tr key={parent.parent_id}>
                                                                <td>{parent.parent_id}</td>
                                                                <td>{parent.parent_name}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name="parent"
                                                                        value={parent.parent_id}
                                                                        onChange={(e) =>
                                                                            setSelectedParentId(e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                })}

                                            {selectedRole === 'Driver' &&
                                                drivers.map((driver) => {
                                                    if (driver.account_id == null)
                                                        return (
                                                            <tr key={driver.driver_id}>
                                                                <td>{driver.driver_id}</td>
                                                                <td>{driver.driver_name}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name="driver"
                                                                        value={driver.driver_id}
                                                                        onChange={(e) =>
                                                                            setSelectedDriverId(e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={handleAddAccount}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpenModalOpen === 'details' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Chi tiết tài khoản</h3>
                        <div className={cx('form')}>
                            <div className={cx('input-container')}>
                                <label>Mã tài khoản: </label>
                                <input type="text" placeholder="Mã tài khoản" className={cx('input')} />
                            </div>
                            <div className={cx('input-container')}>
                                <label>Tên tài khoản: </label>
                                <input type="text" placeholder="Tên tài khoản" className={cx('input')} />
                            </div>

                            <div className={cx('input-container')}>
                                <label>Mật khẩu: </label>
                                <input type="text" placeholder="Mật khẩu" className={cx('input')} />
                            </div>

                            <div className={cx('input-container')}>
                                <label>Vai trò: </label>
                                <input type="text" placeholder="Vai trò" className={cx('input')} />
                            </div>
                            <div className={cx('input-container')}>
                                <label>Trạng thái: </label>
                                <input type="text" placeholder="Trạng thái" className={cx('input')} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpenModalOpen === 'delete' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Xác nhận xóa tài khoản ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
            {isOpenModalOpen === 'lock' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Xác nhận khóa tài khoản ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageAccount;
