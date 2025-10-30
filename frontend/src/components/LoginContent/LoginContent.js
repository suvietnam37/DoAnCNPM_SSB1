import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './LoginContent.module.scss';
import showToast from '../../untils/ShowToast/showToast';
import axios from '../../untils/CustomAxios/axios.customize';
import { AuthContext } from '../../context/auth.context';

const cx = classNames.bind(styles);

function LoginContent() {
    const authContext = useContext(AuthContext);

    const [role, setRole] = useState('parent'); // default
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     // Khi vào trang login => luôn xóa token cũ
    //     localStorage.removeItem('access_token');
    // }, []);

    useEffect(() => {
        if (authContext.auth.isAuthenticated && authContext.auth.user.role === 'Admin') {
            navigate('/admin/dashboard');
        }
        if (authContext.auth.isAuthenticated && authContext.auth.user.role === 'Parent') {
            navigate('/parent');
        }
        if (authContext.auth.isAuthenticated && authContext.auth.user.role === 'Driver') {
            navigate('/driver');
        }
    }, [authContext.auth, navigate]);

    const onLogin = async (e) => {
        e.preventDefault();

        // Kiểm tra username/password
        if (!username || !password) {
            showToast('Please enter username and password', false);
            return;
        }

        try {
            const res = await axios.post('/accounts/login', {
                username,
                password,
            });

            const data = res.data;

            if (data.EC !== 0 || (data.account.role !== 'Driver' && data.account.role !== 'Parent')) {
                // Login thất bại
                showToast('Đăng nhập thất bại', false);
                return;
            }

            authContext.setAuth({
                isAuthenticated: true,
                user: {
                    username: data.account.username,
                    account_id: data.account.account_id,
                    role: data.account.role,
                },
            });

            // Login thành công
            localStorage.setItem('access_token', data.access_token);
            showToast('Đăng nhập thành công');

            // Điều hướng theo role
            if (role === 'parent' && data.account.role == 'Parent') navigate('/parent');
            else if (role === 'driver' && data.account.role == 'Driver') navigate('/driver');
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h2 className={cx('title')}>Welcome Back</h2>
                <p className={cx('subtitle')}>Please login to continue</p>

                <div className={cx('roles')}>
                    <label className={cx('role-label')}>
                        <input
                            type="radio"
                            name="role"
                            className={cx('radio', 'parent')}
                            value="parent"
                            checked={role === 'parent'}
                            onChange={() => setRole('parent')}
                        />
                        <span>Parent</span>
                    </label>

                    <label className={cx('role-label')}>
                        <input
                            type="radio"
                            name="role"
                            className={cx('radio', 'driver')}
                            value="driver"
                            checked={role === 'driver'}
                            onChange={() => setRole('driver')}
                        />
                        <span>Driver</span>
                    </label>
                </div>

                <form className={cx('form')} onSubmit={onLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={cx('input')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={cx('input')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
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
