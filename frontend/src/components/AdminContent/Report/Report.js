import styles from './Report.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
const cx = classNames.bind(styles);

function Report() {
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);

    const handleOpenModal = (type) => {
        setIsOpenModalOpen(type);
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Báo cáo sự cố</h2>
            <textarea placeholder="Nhập nội dung báo cáo..." className={cx('textarea')} />
            <div className={cx('report-content')}>
                <label>Người nhận:</label>
                <select className={cx('report-select')} onChange={(e) => handleOpenModal(e.target.value)}>
                    <option value="">-- Chọn người nhận --</option>
                    <option value="parent">Phụ huynh</option>
                    <option value="driver">Tài xế</option>
                </select>
                <input type="text" placeholder="tìm kiếm ..." className={cx('input')} />
            </div>
            {isOpenModalOpen === 'parent' && (
                <div className={cx('form-container')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>SDT</th>
                                <th>Mã học sinh</th>
                                <th>Tên học sinh</th>
                                <th>Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>0353221283</td>
                                <td>Cầu Ông Lãnh</td>
                                <td>Cầu Ông Kẹo</td>
                                <td>
                                    <input type="checkbox" />
                                </td>
                            </tr>
                            <tr>
                                <td>0353221283</td>
                                <td>Cầu Ông Lãnh</td>
                                <td>Cầu Ông Giẩ</td>
                                <td>
                                    <input type="checkbox" />
                                </td>
                            </tr>
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
                                <tr>
                                    <td>TX01</td>
                                    <td>Nguyễn Ông Lãnh</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>TX01</td>
                                    <td>Nguyễn Kim Lãnh</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                </tr>
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
