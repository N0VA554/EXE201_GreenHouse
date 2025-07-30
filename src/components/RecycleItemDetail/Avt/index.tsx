import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AvatarOverlay.module.css';

interface WasteData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  wasteTypeId: string;
  wasteTypeName: string;
}

interface Props {
  wasteId: string;
}

const AvatarOverlay: React.FC<Props> = ({ wasteId }) => {
    const [wasteData, setWasteData] = useState<WasteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${process.env.REACT_APP_API_URL}/wastes/${wasteId}`)
            .then(res => {
                setWasteData(res.data.data);
                setError(null);
            })
            .catch(err => {
                console.error('Error fetching waste data:', err);
                setError('Không thể tải thông tin');
            })
            .finally(() => setLoading(false));
    }, [wasteId]);

    if (loading) return <div>Đang tải...</div>;
    if (error || !wasteData) return null;

    return (
        <div className={styles.avatarOverlay}>
            <img src={wasteData.imageUrl} alt={wasteData.name} className={styles.avatarImage} />
        </div>
    );
};

export default AvatarOverlay;