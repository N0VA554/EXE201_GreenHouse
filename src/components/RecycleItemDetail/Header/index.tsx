import React from 'react';
import styles from './Header.module.css';
import { useRecycleGuide } from '../RecycleGuideContext';


const RecyclingHeader: React.FC = () => {
    const { data, loading } = useRecycleGuide();

    if (loading) return <div>Đang tải...</div>;
    if (!data) return null;

    return (
        <div className={styles.headerContainer}>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.description}>{data.waste?.description}</p>
        </div>
    );
};

export default RecyclingHeader;