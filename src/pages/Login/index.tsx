import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

interface LoginFormData {
  username: string;
  password: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    console.log(formData)

    try {
      const response = await fetch(`${apiUrl}/accounts/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      console.log('Login response:', result);

      if (!response.ok ) {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      const { accessToken, refreshToken, users } = result.data;

      // Store user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(users));
      localStorage.setItem('userId', users.id);
      localStorage.setItem('username', users.fullName || users.username);
      localStorage.setItem('roleName', users.roleName);
      
      // Verify data is stored
      console.log('Stored data verification:', {
        accessToken: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        roleName: localStorage.getItem('roleName')
      });
      
      console.log('Login successful:', {
        userId: users.id,
        username: users.fullName || users.username,
        roleName: users.roleName
      });
      
      console.log('Navigating to:', users.roleName === 'Admin' ? '/admin' : '/');
      
      try {
        if (users.roleName === 'Admin') {
          console.log('Navigating to admin page');
          navigate("/admin");
        } else {
          console.log('Navigating to home page');
          navigate("/", { replace: true });
        }
        console.log('Navigation completed');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback navigation
        window.location.href = users.roleName === 'Admin' ? '/admin' : '/';
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Đăng Nhập</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập username của bạn"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Đăng Nhập
          </button>
          <p className={styles.switchText}>
            Chưa có tài khoản?{' '}
            <Link to="/dang-ky" className={styles.switchLink}>
              Đăng Ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;