import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './LoginAdminContent.module.scss';
import { useNavigate } from 'react-router-dom';
import showToast from '../../untils/ShowToast/showToast';
import axios from '../../untils/CustomAxios/axios.customize';
import { AuthContext } from '../../context/auth.context';

const cx = classNames.bind(styles);

function LoginAdminContent() {
    const authContext = useContext(AuthContext);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
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
        e.preventDefault(); // Ngăn reload trang
        setError('');

        try {
            const res = await axios.post('/accounts/login', {
                username: name,
                password,
            });

            const data = res.data;

            if (data.EC !== 0 || data.account.role !== 'Admin') {
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

            localStorage.setItem('access_token', data.access_token);

            showToast('Đăng nhập thành công');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Đăng nhập thất bại hoặc lỗi mạng');
            showToast('Lỗi đăng nhập', false);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h2 className={cx('title')}>Welcome Admin</h2>
                <p className={cx('subtitle')}>Please login to continue</p>

                <form className={cx('form')} onSubmit={onLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={cx('input')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className={cx('divider')}>
                    <span>or continue as</span>
                </div>
            </div>
        </div>
    );
}

export default LoginAdminContent;
