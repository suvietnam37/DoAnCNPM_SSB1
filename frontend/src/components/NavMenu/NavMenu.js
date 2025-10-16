import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRectangleList } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './NavMenu.module.scss';
const cx = classNames.bind(styles);
function NavMenu({ menus = [], role }) {
    const scrollTo = (id, offset = 0) => {
        const e = document.getElementById(id);
        if (e) {
            const y = e.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
    return (
        <div className={cx('menu')}>
            <div className={cx('menu-logo')}>
                <FontAwesomeIcon icon={faRectangleList}></FontAwesomeIcon>
                <span>Menu</span>
            </div>
            <div className={cx('menu-nav-list')}>
                {menus.map((menu, index) => {
                    return (
                        <div
                            key={index}
                            className={cx('menu-nav-list-item')}
                            onClick={() => scrollTo(menu.id, menu.offset)}
                        >
                            <span>{menu.name}</span>
                            <FontAwesomeIcon icon={faLocationDot} className={cx('icon-location')} />
                        </div>
                    );
                })}
            </div>
            <div className={cx('menu-role')}>{role}</div>
        </div>
    );
}

export default NavMenu;
