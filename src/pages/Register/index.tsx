import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

interface RegisterFormData {
  fullName: string;
  userName: string;
  email: string;
  address: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    userName: '',
    email: '',
    address: '',
    gender: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('M confirmPassword không khớp!');
      return;
    }
    const { confirmPassword, ...dataToSend } = formData;

    try {
      await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      }).then(response => {
        if (!response.ok || response.status !== 200) {
          console.error("Http Error", response.status);
        }
        return response.json();
      }).then(data => {
        console.log("Data", data);
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Đăng Ký</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tên đăng nhập</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button}>Đăng Ký</button>
          <p className={styles.switchText}>
            Đã có tài khoản?{' '}
            <Link to="/dang-nhap" className={styles.switchLink}>Đăng Nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;