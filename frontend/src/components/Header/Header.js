import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './Header.module.scss';
const cx = classNames.bind(styles);
function Header() {
    return (
        <div className={cx('header')}>
            <div className={cx('header-logo-container')}>
                <FontAwesomeIcon icon={faBus} className={cx('header-logo')} />
                <span className={cx('header-title')}>Bus System Tracking</span>
            </div>
            <div className={cx('header-login')}>
                <button className={cx('header-logout-btn')}>
                    <span>Đăng Xuất</span>
                </button>
            </div>
        </div>
    );
}

export default Header;
