import styles from './ManageAccount.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageAccount() {
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    const handleCloseModal = () => {
        setIsOpenModalOpen('');
    };

    const [items, setItem] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/parents');
                setItem(response.data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);
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
                    <tr>
                        <td>1</td>
                        <td>admin01</td>
                        <td>Quản trị viên</td>
                        <td>
                            Hoạt động
                            <button className={cx('btn', 'lock')} onClick={() => handleOpenModal('lock')}>
                                Khóa tài khoản
                            </button>
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
                    <tr>
                        <td>2</td>
                        <td>driver01</td>
                        <td>Tài xế</td>
                        <td>
                            Đang khóa
                            <button className={cx('btn', 'unlock')} onClick={() => handleOpenModal('lock')}>
                                Mở khóa
                            </button>
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
