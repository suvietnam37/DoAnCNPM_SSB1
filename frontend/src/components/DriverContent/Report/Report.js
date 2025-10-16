import styles from './Report.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function Report() {
    return (
        <div className={cx('report')} id="report">
            <div className={cx('report-title')}>
                <FontAwesomeIcon icon={faExclamation} />
                <span>Báo Cáo Sự Cố</span>
            </div>
            <div className={cx('report-content')}>
                <label>Loại Sự Cố:</label>
                <select className={cx('report-select')}>
                    <option value="heavytraffic">Kẹt xe</option>
                    <option value="student">Học sinh</option>
                    <option value="Technical">Kỹ Thuật</option>
                </select>
                <select className={cx('report-select')}>
                    <option value="HS01">Lê Hoàng N</option>
                    <option value="HS02">Nguyễn Văn A</option>
                    <option value="HS03">Kim Thị T</option>
                </select>
            </div>
            <div className={cx('report-details')}>
                <label>Mô Tả Sự Cố:</label>
                <textarea></textarea>
            </div>
            <div className={cx('btn-report')}>
                <button>Gửi</button>
            </div>
        </div>
    );
}

export default Report;
