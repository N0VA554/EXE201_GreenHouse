import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Media.module.css';
import { useNavigate } from 'react-router-dom';
interface BlogType {
    id: string;
    name: string;
    description: string;
}

interface MediaItem {
    id: number | string;
    image: string;
    title: string;
    description: string;
    date: string;
}

const Media: React.FC = () => {
    const sliderRef = useRef<Slider>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [categories, setCategories] = useState<BlogType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    // Fetch categories on mount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/blogtypes`)
            .then(res => res.json())
            .then(data => {
                setCategories(data.data);
                if (data.data.length > 0) {
                    setSelectedCategory(data.data[0].id);
                }
            });
    }, []);

    // Fetch blogs when selectedCategory changes
    useEffect(() => {
        if (!selectedCategory) return;
        fetch(`${process.env.REACT_APP_API_URL}/blogs/getbyblogtypeid/${selectedCategory}`)
            .then(res => res.json())
            .then(data => {
                let items = [];
                if (Array.isArray(data.data)) {
                    items = data.data;
                } else if (data.data) {
                    items = [data.data];
                }
                setMediaItems(
                    items.map((item: any) => ({
                        id: item.id,
                        image: item.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image',
                        title: item.title,
                        description: item.content,
                        date: item.createdTime ? new Date(item.createdTime).toLocaleDateString() : '',
                    }))
                );
                setCurrentIndex(0);
            });
    }, [selectedCategory]);

    const settings = {
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: mediaItems.length > 3,
        speed: 500,
        slidesToShow: Math.min(3, mediaItems.length || 1),
        slidesToScroll: 1,
        beforeChange: (_: number, next: number) => setCurrentIndex(next),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };

    const handlePrev = () => {
        sliderRef.current?.slickPrev();
    };

    const toggleExpand = (id: string | number) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const navigate = useNavigate();
    const getShortDescription = (html: string, maxLength = 120) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    return (
        <div className={styles.mediaContainer}>
            <div className={styles.header}>
                <h2>TRUYỀN THÔNG</h2>
                <div className={styles.tabs}>
                    {categories.map(cat => (
                        <span
                            key={cat.id}
                            className={selectedCategory === cat.id ? styles.active : ''}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.mediaList}>
                <Slider ref={sliderRef} {...settings}>
                    {mediaItems.map((item) => (
                        <div
                            key={item.id}
                            className={styles.mediaItem}
                            onClick={() => navigate(`/blog/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.mediaImageWrap}>
                                <img src={item.image} alt={item.title} className={styles.mediaImage} />
                            </div>
                            <div className={styles.mediaContent}>
                                <span className={styles.category}>
                                    {categories.find(c => c.id === selectedCategory)?.name || ''}
                                </span>
                                <h3 className={styles.mediaItemTitle}>{item.title}</h3>
                                <div className={styles.mediaDesc}>
                                    {getShortDescription(item.description)}
                                </div>
                                <div className={styles.mediaFooter}>
                                    <span className={styles.date}>{item.date}</span>
                                    <span className={styles.arrow}>→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
            <div className={styles.navigation}>
                <button className={styles.navButton} onClick={handlePrev}>
                    ←
                </button>
                <button className={styles.navButton} onClick={handleNext}>
                    →
                </button>
            </div>
            <div className={styles.viewAll}>
                <a href="#view-all">XEM TẤT CẢ →</a>
            </div>
        </div>
    );
};

export default Media;