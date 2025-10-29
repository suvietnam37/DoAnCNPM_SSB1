import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './LoginAdminContent.module.scss';
import { useNavigate } from 'react-router-dom';
import showToast from '../../untils/ShowToast/showToast';
import axios from '../../untils/CustomAxios/axios.customize';

const cx = classNames.bind(styles);

function LoginAdminContent() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Khi vào trang login => luôn xóa token cũ
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
    }, []);

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

            // ✅ Lưu token & role
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('role', data.account.role);

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
