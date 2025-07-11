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
    try {
      const response = await fetch(`${apiUrl}/accounts/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || result.statusCode !== 200) {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      const { accessToken, refreshToken, users } = result.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(users));
      localStorage.setItem('roleName', users.roleName);
      if (users.roleName === 'Admin') {
        navigate("/admin");
      } else {
        navigate("/");
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