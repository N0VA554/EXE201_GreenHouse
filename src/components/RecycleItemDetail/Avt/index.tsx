import React from 'react';
import styles from './AvatarOverlay.module.css';
import { useRecycleGuide } from '../RecycleGuideContext';


const AvatarOverlay: React.FC = () => {
    const { data, loading } = useRecycleGuide();

    if (loading) return <div>Đang tải...</div>;
    if (!data) return null;

    return (
        <div className={styles.avatarOverlay}>
            <img src={data.imageUrl} alt={data.title} className={styles.avatarImage} />
        </div>
    );
};

export default AvatarOverlay;