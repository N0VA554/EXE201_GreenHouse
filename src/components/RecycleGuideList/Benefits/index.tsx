import React from 'react';
import styles from './Benefits.module.css';

const Benefits: React.FC = () => {
    return (
        <div className={styles.benefitsContainer}>
            <h2 className={styles.title}>LỢI ÍCH CỦA VIỆC TÁI CHẾ</h2>
            <div className={styles.content}>
                <div className={styles.textSection}>
                    <h3>Những lợi ích đối với môi trường</h3>
                    <ul>
                        <li>
                            <span className={styles.icon}>🗑️</span>
                            Làm giảm khối lượng chất thải mà chúng ta tạo ra ở nhà, trường học hoặc văn phòng.
                        </li>
                        <li>
                            <span className={styles.icon}>🌍</span>
                            Giúp tiết kiệm môi trường trong việc sử dụng tài nguyên thiên nhiên.
                        </li>
                        <li>
                            <span className={styles.icon}>☁️</span>
                            Giảm thiểu lượng khí thải gây hiệu ứng nhà kính, góp phần bảo vệ tầng ozone.
                        </li>
                    </ul>
                </div>
                <div className={styles.imageSection}>
                    <img src="https://provietnam.com.vn/wp-content/themes/provn/dist/images/environment.png" alt="Plant in hands" />
                </div>
            </div>
        </div>
    );
};

export default Benefits;