import styles from './ManageDriver.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);

function ManageDriver() {
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
                const response = await axios.get('http://localhost:5000/api/drivers');
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
                <h2 className={cx('title')}>Quản lý tài xế</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm tài xế
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã tài xế</th>
                        <th>Tên tài xế</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        return (
                            <tr>
                                <td>{item.driver_id}</td>
                                <td>{item.driver_name}</td>
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
                        <h3>Sửa thông tin tài xế</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã tài xế" className={cx('input')} />
                            <input type="text" placeholder="Tên tài xế" className={cx('input')} />
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
                        <h3>Thêm tài xế</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Tên tài xế" className={cx('input')} />
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
                        <h3>Chi tiết tài xế</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã tài xế" className={cx('input')} />
                            <input type="text" placeholder="Tên tài xế" className={cx('input')} />
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
                        <h3>Xác nhận xóa tài xế ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageDriver;
