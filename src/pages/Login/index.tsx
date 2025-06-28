import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }
    console.log('Đăng nhập:', formData.email, formData.password);
    // Add your login API call here
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Đăng Nhập</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập email của bạn"
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