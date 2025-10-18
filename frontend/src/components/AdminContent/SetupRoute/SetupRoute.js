import styles from './SetupRoute.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
const cx = classNames.bind(styles);

function SetupRoute() {
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
                <h2 className={cx('title')}>Quản Lý Phân Tuyến</h2>
                <button className={cx('btn', 'add')} onClick={() => handleOpenModal('add')}>
                    Phân tuyến
                </button>
            </div>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Mã tuyến</th>
                        <th>Mã tài xế</th>
                        <th>Thời gian khởi hành</th>
                        <th>Hành động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>R01</td>
                        <td>TX01</td>
                        <td>4h</td>
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

            {isOpenModalOpen === 'add' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Phân công tuyến</h3>
                        <div className={cx('form')}>
                            <div className={cx('form-container')}>
                                <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                                <input type="text" placeholder="Thời gian khởi hành" className={cx('input')} />
                            </div>
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
                                                <th>Mã tài xế</th>
                                                <th>Tên tài xế</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>TX01</td>
                                                <td>Nguyễn Thị Lựu</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>TX02</td>
                                                <td>Nguyễn Ánh Lực</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>TX01</td>
                                                <td>Nguyễn Thị Lựu</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Số xe</th>
                                                <th>Biển số</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>01</td>
                                                <td>59-123456</td>
                                                <td>
                                                    <input type="radio" name="bus" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>02</td>
                                                <td>59-972456</td>
                                                <td>
                                                    <input type="radio" name="bus" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>01</td>
                                                <td>59-123456</td>
                                                <td>
                                                    <input type="radio" name="bus" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')}>Thêm</button>
                            </div>
                        </div>
                        <div className={cx('form')}>
                            <div className={cx('form-container-choose-student')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã tuyến</th>
                                                <th>Mã tài xế</th>
                                                <th>Thời gian khởi hành</th>
                                                <th>Chọn</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>R01</td>
                                                <td>TX01</td>
                                                <td>7h</td>
                                                <td>
                                                    <input type="radio" name="ready-route" />
                                                </td>
                                                <td>
                                                    <button className={cx('btn', 'danger')}>Xóa</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>R01</td>
                                                <td>TX01</td>
                                                <td>7h</td>
                                                <td>
                                                    <input type="radio" name="ready-route" />
                                                </td>
                                                <td>
                                                    <button className={cx('btn', 'danger')}>Xóa</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã học sinh</th>
                                                <th>Tên học sinh</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>HS01</td>
                                                <td>Nguyễn Văn A</td>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>HS02</td>
                                                <td>Trần Văn X</td>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'add')}>Thêm học sinh</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpenModalOpen === 'edit' && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-overlay-close')}>
                            <button className={cx('btn', 'danger', 'radius')} onClick={() => handleCloseModal()}>
                                X
                            </button>
                        </div>
                        <h3>Sửa phân công tuyến</h3>
                        <div className={cx('form')}>
                            <div className={cx('form-container')}>
                                <input type="text" placeholder="Mã tuyến" className={cx('input')} />
                                <input type="text" placeholder="Thời gian khởi hành" className={cx('input')} />
                            </div>
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
                                                <th>Mã tài xế</th>
                                                <th>Tên tài xế</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>TX01</td>
                                                <td>Nguyễn Thị Lựu</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>TX02</td>
                                                <td>Nguyễn Ánh Lực</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>TX01</td>
                                                <td>Nguyễn Thị Lựu</td>
                                                <td>
                                                    <input type="radio" name="driver" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Số xe</th>
                                                <th>Biển số</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>01</td>
                                                <td>59-123456</td>
                                                <td>
                                                    <input type="radio" name="bus" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>02</td>
                                                <td>59-972456</td>
                                                <td>
                                                    <input type="radio" name="bus" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>01</td>
                                                <td>59-123456</td>
                                                <td>
                                                    <input type="radio" name="bus" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'change')}>Sửa</button>
                            </div>
                        </div>
                        <div className={cx('form')}>
                            <div className={cx('form-container-choose-student', 'edit')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã học sinh</th>
                                                <th>Tên học sinh</th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>HS01</td>
                                                <td>Nguyễn Văn A</td>
                                                <td>
                                                    <input type="checkbox" name="bus" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>HS02</td>
                                                <td>Trần Văn X</td>
                                                <td>
                                                    <input type="checkbox" name="bus" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={cx('buttons')}>
                                <button className={cx('btn', 'change')}>Sửa học sinh</button>
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
                        <h3>Thông tin chi tiết tuyến</h3>

                        <div className={cx('form')}>
                            <div className={cx('form-container-choose-student')}>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã tuyến</th>
                                                <th>Mã tài xế</th>
                                                <th>Thời gian khởi hành</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>R01</td>
                                                <td>TX01</td>
                                                <td>4h</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={cx('table-wrapper')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Mã học sinh</th>
                                                <th>Tên học sinh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>HS01</td>
                                                <td>Nguyễn Văn A</td>
                                            </tr>
                                            <tr>
                                                <td>HS02</td>
                                                <td>Trần Văn X</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
                        <h3>Xác nhận xóa phân công tuyến ?</h3>
                        <button className={cx('btn', 'add')} onClick={handleCloseModal}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SetupRoute;
