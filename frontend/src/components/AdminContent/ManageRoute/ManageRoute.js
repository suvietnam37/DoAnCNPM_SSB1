import styles from './ManageRoute.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ManageRoute() {
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
                <h2 className={cx('title')}>Quản lý tuyến</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm tuyến
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã tuyến</th>
                        <th>Tên tuyến</th>
                        <th>Số trạm</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>R01</td>
                        <td>Tuyến A</td>
                        <td>10</td>
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
                        <h3>Sửa thông tin tuyến </h3>
                        <div className={cx('form')}>
                            <div className={cx('form-container')}>
                                <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                                <input type="text" placeholder="Tên tuyến" className={cx('input')} />
                            </div>
                            <div className={cx('form-container')}>
                                {/* <label>Trạm 1: </label> */}
                                <select>
                                    <option>Trạm 1</option>
                                </select>
                                <input type="text" placeholder="Vị trí" className={cx('input')} />
                                <button className={cx('btn', 'change')}>sửa</button>
                            </div>
                            <div className={cx('form-container')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Số trạm</th>
                                            <th>Vị trí</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>01</td>
                                            <td>Cầu Ông Lãnh</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')}>Cập nhật</button>
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
                        <h3>Thêm tuyến </h3>
                        <div className={cx('form')}>
                            <div className={cx('form-container')}>
                                <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                                <input type="text" placeholder="Tên tuyến" className={cx('input')} />
                            </div>
                            <div className={cx('form-container')}>
                                <label>Trạm 1: </label>
                                <input type="text" placeholder="Vị trí" className={cx('input')} />
                                <button className={cx('btn', 'add')}>Thêm trạm</button>
                            </div>
                            <div className={cx('form-container')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Số trạm</th>
                                            <th>Vị trí</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>01</td>
                                            <td>Cầu Ông Lãnh</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')}>Thêm</button>
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
                        <h3>Chi tiết tuyến</h3>
                        <div className={cx('form')}>
                            <div className={cx('form-container')}>
                                <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                                <input type="text" placeholder="Tên tuyến" className={cx('input')} />
                            </div>
                            <div className={cx('form-container')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Số trạm</th>
                                            <th>Vị trí</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>01</td>
                                            <td>Cầu Ông Lãnh</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                        <h3>Xác nhận xóa tuyến ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRoute;
