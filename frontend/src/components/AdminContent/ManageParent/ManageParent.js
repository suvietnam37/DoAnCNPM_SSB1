import styles from './ManageParent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ManageParent() {
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
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>PH01</td>
                        <td>Nguyễn Văn Nam</td>
                        <td>0353221672</td>
                        <td>abc@gmail.com</td>
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
                        <h3>Sửa thông tin phụ huynh</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã phụ huynh" className={cx('input')} />
                            <input type="text" placeholder="Tên phụ huynh" className={cx('input')} />
                            <input type="text" placeholder="SĐT" className={cx('input')} />
                            <input type="text" placeholder="Email" className={cx('input')} />
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
                        <h3>Thêm phụ huynh</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã phụ huynh" className={cx('input')} />
                            <input type="text" placeholder="Tên phụ huynh" className={cx('input')} />
                            <input type="text" placeholder="SĐT" className={cx('input')} />
                            <input type="text" placeholder="Email" className={cx('input')} />
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
                        <h3>Chi tiết phụ huynh</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã phụ huynh" className={cx('input')} />
                            <input type="text" placeholder="Tên phụ huynh" className={cx('input')} />
                            <input type="text" placeholder="SĐT" className={cx('input')} />
                            <input type="text" placeholder="Email" className={cx('input')} />
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
                        <h3>Xác nhận xóa phụ huynh ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageParent;
