import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/logotrang.png';

const Navbar: React.FC = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    const getActiveSection = () => {
        const path = location.pathname;
        if (path === '/') return 'trangchu';
        if (path === '/danhsachphanloai') return 'phanloai';
        if (path.includes('#tongquan')) return 'tongquan';
        if (path.includes('#truyenthong')) return 'truyenthong';
        return '';
    };

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                <li><a href="#truyenthong" className={activeSection === 'truyenthong' ? styles.active : ''}>TRUYỀN THÔNG</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;