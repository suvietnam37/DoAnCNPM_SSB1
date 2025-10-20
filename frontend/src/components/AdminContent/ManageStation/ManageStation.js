import styles from './ManageStation.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);

function ManageStation() {
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
                const response = await axios.get('http://localhost:5000/api/stops');
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
                <h2 className={cx('title')}>Quản lý trạm</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Thêm trạm
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã trạm</th>
                        <th>Tên trạm</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        return (
                            <tr key={item.stop_id}>
                                <td>{item.stop_id}</td>
                                <td>{item.stop_name}</td>
                                <td>{item.address}</td>
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
                        <h3>Sửa trạm</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã trạm" className={cx('input')} />
                            <input type="text" placeholder="Tên trạm" className={cx('input')} />
                            <input type="text" placeholder="Địa chỉ" className={cx('input')} />
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
                        <h3>Thêm trạm</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Tên trạm" className={cx('input')} />
                            <input type="text" placeholder="Địa chỉ" className={cx('input')} />
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

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')} onClick={() => handleCloseModal()}>
                                    Thêm
                                </button>
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
                        <h3>Xác nhận xóa trạm ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
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
                        <h3>Chi tiết trạm</h3>
                        <div className={cx('form')}>
                            <input type="text" placeholder="Mã trạm" className={cx('input')} />
                            <input type="text" placeholder="Tên trạm" className={cx('input')} />
                            <input type="text" placeholder="Địa chỉ" className={cx('input')} />
                            <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStation;
