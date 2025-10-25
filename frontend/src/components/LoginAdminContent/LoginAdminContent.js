import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './LoginAdminContent.module.scss';
import { useNavigate } from 'react-router-dom';
import showToast from '../../untils/ShowToast/showToast';
const cx = classNames.bind(styles);

function LoginAdminContent() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Khi vào trang login => luôn xóa token cũ
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('role');
    }, []);

    const onLogin = async (e) => {
        e.preventDefault(); // Ngăn reload trang

        try {
            const res = await fetch('http://localhost:5000/api/accounts/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Phải có header này để server parse JSON
                },
                body: JSON.stringify({ username: name, password }), // gửi JSON
            });

            const data = await res.json();
            console.log(data);

            if (data.EC !== 0 || data.account.role !== 'Admin') {
                // setError(data.message || 'Login failed');
                showToast('Đăng nhập thất bại', false);
                return;
            }
            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('role', data.account.role);
            showToast('Đăng nhập thành công');
            // console.log('Login successful:', data);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error');
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
                        name="name"
                        className={cx('input')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
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
