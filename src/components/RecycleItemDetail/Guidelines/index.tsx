import React from 'react';
import styles from './Guidelines.module.css';
import { useRecycleGuide } from '../RecycleGuideContext';


const RecyclingGuidelines: React.FC = () => {
    const { data, loading } = useRecycleGuide();

    if (loading) return <div>Đang tải...</div>;
    if (!data) return null;

    return (
        <div className={styles.guidelinesContainer}>
            <div className={styles.coloredSection}>
                <h2 className={styles.sectionTitle}>{data.title}</h2>
                <p>{data.content}</p>
            </div>
        </div>
    );
};

export default RecyclingGuidelines;