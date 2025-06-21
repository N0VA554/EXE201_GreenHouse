import React from 'react';
import styles from './WasteStatus.module.css';

const WasteStatus: React.FC = () => {
    return (
        <div className={styles.wasteStatusContainer}>
            <div className={styles.overlay}>
                <h2>THỰC TRẠNG RÁC THẢI TỪ BAO BÌ Ở VIỆT NAM</h2>
                <p>
                    Thời gian gần đây, quá trình đô thị hóa và tiêu dùng hóa nhanh chóng, cùng với việc vận chuyển, gom và tái chế rác thải còn chưa đáp ứng triệt để các vấn đề sinh thái và rác thải trong nước ở Việt Nam.
                </p>
                <a href="#learn-more" className={styles.learnMoreButton}>
                    TÌM HIỂU THÊM →
                </a>
            </div>
        </div>
    );
};

export default WasteStatus;