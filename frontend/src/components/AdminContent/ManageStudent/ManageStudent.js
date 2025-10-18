import styles from './ManageStudent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ManageStudent() {
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    const handleCloseModal = () => {
        setIsOpenModalOpen('');
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
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HS01</td>
                        <td> Nguyễn Văn A</td>
                        <td>10A5</td>
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
                        <h3>Sửa thông tin học sinh</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã học sinh" className={cx('input')} />
                            <input type="text" placeholder="Tên học sinh" className={cx('input')} />
                            <input type="text" placeholder="Lớp" className={cx('input')} />
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
                        <h3>Thêm học sinh</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã học sinh" className={cx('input')} />
                            <input type="text" placeholder="Tên học sinh" className={cx('input')} />
                            <input type="text" placeholder="Lớp" className={cx('input')} />
                            <div className={cx('form-container')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã tuyến</th>
                                                <th>Tên tuyến</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>R01</td>
                                                <td>Cầu Ông Lãnh</td>
                                                <td>
                                                    <input type="radio" name="route" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>R01</td>
                                                <td>Cầu Ông Lãnh</td>
                                                <td>
                                                    <input type="radio" name="route" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>R01</td>
                                                <td>Cầu Ông Lãnh</td>
                                                <td>
                                                    <input type="radio" name="route" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

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
                        <h3>Chi tiết học sinh</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã học sinh" className={cx('input')} />
                            <input type="text" placeholder="Tên học sinh" className={cx('input')} />
                            <input type="text" placeholder="Lớp" className={cx('input')} />
                            <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                            <input type="text" placeholder="Mã phụ huynh" className={cx('input')} />
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
                        <h3>Xác nhận xóa học sinh ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStudent;
