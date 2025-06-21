import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Partners.module.css';

interface Brand {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const Partners: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/brands`)
            .then(res => setBrands(res.data.data))
            .catch(() => setBrands([]));
    }, []);

    return (
        <div className={styles.partnersContainer}>
            <h2 className={styles.title}>Thành viên & Đối tác</h2>
            <div className={styles.grid}>
                {brands.map(brand => (
                    <a
                        key={brand.id}
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.partnerCard}
                    >
                        <img src={brand.logoUrl} alt={brand.name} className={styles.logo} />
                        <div className={styles.info}>
                            <h3>{brand.name}</h3>
                            <p>{brand.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Partners;