import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { useNavigate } from 'react-router-dom';
import showToast from '../../untils/ShowToast/showToast';

const cx = classNames.bind(styles);

function Header() {
    const username = localStorage.getItem('username');

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        const role = localStorage.getItem('role');
        localStorage.clear();
        if (role === 'Admin') {
            navigate('/admin');
            showToast('Đăng xuất thành công');
        } else {
            navigate('/');
            showToast('Đăng xuất thành công');
        }
    };

    return (
        <div className={cx('header')}>
            <div className={cx('header-logo-container')}>
                <FontAwesomeIcon icon={faBus} className={cx('header-logo')} />
                <span className={cx('header-title')}>Bus System Tracking</span>
            </div>

            <div className={cx('header-login')} ref={menuRef}>
                <div className={cx('header-acc-infor')} onClick={() => setMenuOpen(!menuOpen)}>
                    <FontAwesomeIcon icon={faChevronDown} className={cx('dropdown-icon', { open: menuOpen })} />
                    <p>{username}</p>
                    <FontAwesomeIcon icon={faUser} />
                </div>

                {menuOpen && (
                    <div className={cx('dropdown-menu')}>
                        <button className={cx('dropdown-item')}>Đổi mật khẩu</button>
                    </div>
                )}

                <button
                    className={cx('header-logout-btn')}
                    onClick={() => {
                        handleLogout();
                    }}
                >
                    <span>Đăng Xuất</span>
                </button>
            </div>
        </div>
    );
}

export default Header;
