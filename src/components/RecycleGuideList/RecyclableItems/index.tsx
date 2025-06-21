import React, { useEffect, useState } from 'react';
import styles from './RecyclableItems.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

interface GuideItem {
    id: string;
    image: string;
    name: string;
}

const RecyclableItems: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<GuideItem[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/recycleguides`)
            .then(res => {
                const guides = res.data.data.map((item: any) => ({
                    id: item.id,
                    image: item.imageUrl,
                    name: item.waste?.name || '',
                }));
                setItems(guides);
            })
            .catch(err => {
                setItems([]);
            });
    }, []);

    const handleItemClick = (id: string) => {
        navigate(`/danhsachphanloai/${id}`);
    };

    return (
        <div className={styles.recyclableItemsContainer}>
            <h2 className={styles.title}>NHỮNG GÌ CÓ THỂ ĐƯỢC TÁI CHẾ?</h2>
            <p className={styles.subtitle}>
                Theo hướng dẫn trong sạch mà GREENHOME chúng tôi cung cấp :
            </p>
            <div className={styles.itemsGrid}>
                {items.map((item) => (
                    <div 
                        key={item.id} 
                        className={styles.item}
                        onClick={() => handleItemClick(item.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.name} className={styles.itemImage} />
                        </div>
                        <p className={styles.itemLabel}>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecyclableItems;