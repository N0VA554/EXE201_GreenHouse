import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Location.module.css';

interface LocationData {
    id: string;
    name: string;
    address: string;
    contactNumber: string;
    description: string;
    openingTime: string;
    closingTime: string;
    latitude: string;
    longitude: string;
}

interface Props {
    wasteId: string;
}

const RecyclingLocation: React.FC<Props> = ({ wasteId }) => {
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${process.env.REACT_APP_API_URL}/recyclelocations/getbywastesid/${wasteId}`)
            .then(res => {
                setLocations(res.data.data || []);
            })
            .finally(() => setLoading(false));
    }, [wasteId]);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Đang tải địa điểm tái chế...</p>
        </div>
    );
    
    if (!locations.length) return (
        <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}>📍</div>
            <h3>Không tìm thấy địa điểm tái chế</h3>
            <p>Hiện tại chưa có địa điểm thu gom cho loại rác thải này.</p>
        </div>
    );

    return (
        <div className={styles.locationContainer}>
            {locations.map(loc => (
                <div key={loc.id} className={styles.locationCard}>
                    <div className={styles.mapSection}>
                        <iframe
                            title={loc.name}
                            width="100%"
                            height="220"
                            style={{ border: 0, borderRadius: 8 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}&hl=vi&z=16&output=embed`}
                        />
                    </div>
                    <div className={styles.detailsSection}>
                        <div>
                            <h3 className={styles.detailsTitle}>{loc.name}</h3>
                            <p>
                                <strong>Địa chỉ:</strong> {loc.address}
                            </p>
                            {loc.description && (
                                <p>
                                    <strong>Mô tả:</strong> {loc.description}
                                </p>
                            )}
                            <p>
                                <strong>Thời gian:</strong> {new Date(loc.openingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(loc.closingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p>
                                <strong>SĐT:</strong> {loc.contactNumber}
                            </p>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mapLink}
                        >
                            Xem trên Google Maps
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecyclingLocation;