import classNames from 'classnames/bind';
import styles from './LoginAdminContent.module.scss';
const cx = classNames.bind(styles);

function LoginContent() {
    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h2 className={cx('title')}>Welcome Admin</h2>
                <p className={cx('subtitle')}>Please login to continue</p>
                <form className={cx('form')}>
                    <input type="text" placeholder="Username" className={cx('input')} />
                    <input type="password" placeholder="Password" className={cx('input')} />
                    <button type="submit" className={cx('login-btn')}>
                        Login
                    </button>
                </form>

                <div className={cx('divider')}>
                    <span>or continue as</span>
                </div>
            </div>
        </div>
    );
}

export default LoginContent;
