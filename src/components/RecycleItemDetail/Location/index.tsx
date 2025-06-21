import React from 'react';
import styles from './Location.module.css';

const RecyclingLocation: React.FC = () => {
    return (
        <div className={styles.locationContainer}>
            <div className={styles.mapSection}>
                <img src="https://cafefcdn.com/thumb_w/640/203337114487263232/2022/2/28/photo1646035428299-16460354285181819837363.png" alt="Map" className={styles.mapImage} />
            </div>
            <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Địa chỉ thu gom</h3>
                <p>
                    ANH GOURMET Café <br />
                    38 Hai Bà Trưng, Q.1, TP.HCM <br />
                    Thời gian: 8h - 20h <br />
                    SĐT: 0909 123 456
                </p>
                <a href="https://goo.gl/maps/abc123" target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                    Google Maps
                </a>
            </div>
        </div>
    );
};

export default RecyclingLocation;