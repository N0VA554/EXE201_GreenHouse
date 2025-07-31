import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/logotrang.png';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const [userAvatar, setUserAvatar] = useState<string>('https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg'); // Default avatar URL

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsLoggedIn(true);
            const user = JSON.parse(storedUser);
            setUserName(user.fullName || '');
            setUserAvatar(user.avatar || 'https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg');
        } else {
            setIsLoggedIn(false);
            setUserName('');
            setUserAvatar('https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg');
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getActiveSection = () => {
        const path = location.pathname;
        if (path === '/') return 'trangchu';
        if (path === '/danhsachphanloai') return 'phanloai';
        if (path === '/dang-nhap') return 'dangnhap';
        if (path.includes('#tongquan')) return 'tongquan';
        if (path === '/baiviet' || path.startsWith('/posts/')) return 'truyenthong';
        return '';
    };

    const handleLogout = async () => {
        try {
            var data = {
                accessToken: localStorage.getItem("accessToken"),
                refreshToken: localStorage.getItem("refreshToken")
            }
            var result = await axiosInstance.post(`/accounts/logout`, data, { headers: { "Content-Type": "application/json" } })
            if (result.data.code == "Success") {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                localStorage.removeItem('roleName');
                setIsLoggedIn(false);
                setUserName('');
                setUserAvatar('https://example.com/default-avatar.png');
                setIsDropdownOpen(false);
                navigate('/dang-nhap');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const activeSection = getActiveSection();

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navbarLogo}>
                <img src={logo} alt="Logo" />
            </div>
            <ul className={styles.navbarMenu}>
                <li><Link to="/" className={activeSection === 'trangchu' ? styles.active : ''}>TRANG CHỦ</Link></li>
                <li><Link to="/danhsachphanloai" className={activeSection === 'phanloai' ? styles.active : ''}>PHÂN LOẠI</Link></li>
                <li><a href="#tongquan" className={activeSection === 'tongquan' ? styles.active : ''}>TỔNG QUAN</a></li>
                <li><Link to="/baiviet" className={activeSection === 'truyenthong' ? styles.active : ''}>BÀI VIẾT</Link></li>
                <li className={styles.userMenu}>
                    {isLoggedIn ? (
                        <div className={styles.userProfile}>
                            <img
                                src={userAvatar}
                                alt="User Avatar"
                                className={styles.userAvatar}
                                onClick={toggleDropdown}
                            />
                            <span className={styles.userName} onClick={toggleDropdown}>{userName}</span>
                            {isDropdownOpen && (
                                <div className={styles.dropdownMenu}>

                                    <button
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate('/profile');
                                        }}
                                    >
                                        Hồ sơ của tôi
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className={styles.dropdownItem}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className={`${styles.loginButton} ${activeSection === 'dangnhap' ? styles.active : ''}`}
                            onClick={() => navigate('/dang-nhap')}
                            type="button"
                        >
                            ĐĂNG NHẬP
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;