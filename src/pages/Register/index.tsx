import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('M confirmerPassword không khớp!');
      return;
    }
    console.log('Đăng ký:', formData.email, formData.password);
    // Add your registration API call here
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Đăng Ký</h2>
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
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Xác Nhận Mật Khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Đăng Ký
          </button>
          <p className={styles.switchText}>
            Đã có tài khoản?{' '}
            <Link to="/dang-nhap" className={styles.switchLink}>
              Đăng Nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;