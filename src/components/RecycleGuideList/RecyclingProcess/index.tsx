import React from 'react';
import styles from './RecyclingProcess.module.css';

const RecyclingProcess: React.FC = () => {
    return (
        <div className={styles.recyclingProcessContainer}>
            <div className={styles.textSection}>
                <h2 className={styles.title}>QUY TRÌNH TÁI CHẾ</h2>
                <p>
                    GreenHome sẽ xây dựng và phát triển hoạt động gom bao bì vỏ sử dụng để tái chế thành
                    nguyên liệu phục vụ sản xuất, góp phần bảo vệ môi trường và nâng cao
                    chất lượng cuộc sống.
                </p>
            </div>
            <div className={styles.illustrationSection}>
                <img 
                    src="https://provietnam.com.vn/wp-content/themes/provn/dist/images/recycling-process.png"
                    alt="Quy trình tái chế"
                    className={styles.processImage}
                />
            </div>
        </div>
    );
};

export default RecyclingProcess;