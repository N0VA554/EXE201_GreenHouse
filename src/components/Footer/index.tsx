import React from 'react';
import styles from './Footer.module.css';
import logo from '../../assets/logotrang.png';
const Footer: React.FC = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <div className={styles.logoSection}>
                    <div className={styles.logo}>
                         <img src={logo} alt="Logo" />
                    </div>
                </div>
                <div className={styles.contactSection}>
                    <h4>LIÊN HỆ CHÚNG TÔI</h4>
                    <div className={styles.socialIcons}>
                        <a href="https://www.facebook.com/people/Green-Home/61577296551076/" >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/1024px-2023_Facebook_icon.svg.png" alt="Facebook" />
                        </a>
                        <a href="https://youtube.com" >
                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
                        </a>
                        
                    </div>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>© 2025 GreenHome. All rights reserved.</p>
                
            </div>
        </footer>
    );
};

export default Footer;