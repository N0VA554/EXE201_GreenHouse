import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Hazards.module.css';

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

const Hazards: React.FC<Props> = ({ wasteId }) => {
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
        setError('Không thể tải thông tin tác hại');
      })
      .finally(() => setLoading(false));
  }, [wasteId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải thông tin tác hại...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!wasteData) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📋</div>
        <h3>Không có thông tin tác hại</h3>
        <p>Thông tin tác hại chưa được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className={styles.hazardsContainer}>
      <div className={styles.hazardsHeader}>
        <h2 className={styles.hazardsTitle}>Tác hại của {wasteData.name}</h2>
        <div className={styles.wasteType}>
          <span className={styles.wasteTypeLabel}>Loại rác:</span>
          <span className={styles.wasteTypeValue}>{wasteData.wasteTypeName}</span>
        </div>
      </div>
      
      <div className={styles.hazardsContent}>
        <div className={styles.descriptionSection}>
          <h3>Mô tả chi tiết</h3>
          <p>{wasteData.description}</p>
        </div>
        
        <div className={styles.imageSection}>
          {wasteData.imageUrl && (
            <img 
              src={wasteData.imageUrl} 
              alt={wasteData.name} 
              className={styles.wasteImage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Hazards; 