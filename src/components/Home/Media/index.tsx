import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Media.module.css';
import { useNavigate } from 'react-router-dom';
import AddBlog from './AddBlog';

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
    const [showAddBlog, setShowAddBlog] = useState(false);
    const roleName = localStorage.getItem('roleName');

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

    // Fetch blogs when selectedCategory changes or new blog added
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
    }, [selectedCategory, showAddBlog]);

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

    const handleBlogAdded = () => {
        setShowAddBlog(false);
        // Trigger re-fetch of blogs
        setSelectedCategory(selectedCategory);
    };

    return (
        <div className={styles.mediaContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Truyền Thông</h2>
                    <p className={styles.sectionSubtitle}>
                        Khám phá những bài viết mới nhất về môi trường và tái chế
                    </p>
                    {roleName === 'Staff' && (
                        <div className={styles.staffButtons}>
                            <button
                                className={styles.primaryButton}
                                onClick={() => setShowAddBlog(true)}
                            >
                                Thêm bài viết
                            </button>
                        </div>
                    )}
                </div>

                {/* Category Tabs */}
                <div className={styles.categoryTabs}>
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.active : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span className={styles.categoryName}>{cat.name}</span>
                        </div>
                    ))}
                </div>

                {/* Media Carousel */}
                <div className={styles.mediaCarousel}>
                    <Slider ref={sliderRef} {...settings}>
                        {mediaItems.map((item) => (
                            <div key={item.id}>
                                <div
                                    className={styles.mediaCard}
                                    onClick={() => navigate(`/blog/${item.id}`)}
                                >
                                    <div className={styles.mediaImageWrapper}>
                                        <img src={item.image} alt={item.title} className={styles.mediaImage} />
                                        <div className={styles.mediaOverlay}>
                                            <span className={styles.readMore}>Đọc thêm</span>
                                        </div>
                                    </div>
                                    <div className={styles.mediaContent}>
                                        <div className={styles.mediaHeader}>
                                            <span className={styles.category}>
                                                {categories.find(c => c.id === selectedCategory)?.name || ''}
                                            </span>
                                            <span className={styles.date}>{item.date}</span>
                                        </div>
                                        <h3 className={styles.mediaTitle}>{item.title}</h3>
                                        <p className={styles.mediaDescription}>
                                            {getShortDescription(item.description)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Navigation Controls */}
                <div className={styles.carouselControls}>
                    <button className={styles.navButton} onClick={handlePrev}>
                        ←
                    </button>
                    <div className={styles.dots}>
                        {mediaItems.map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.dot} ${currentIndex === index ? styles.active : ''}`}
                                onClick={() => sliderRef.current?.slickGoTo(index)}
                            />
                        ))}
                    </div>
                    <button className={styles.navButton} onClick={handleNext}>
                        →
                    </button>
                </div>

                {/* View All Link */}
                <div className={styles.viewAllSection}>
                    {/* <button 
                        className={styles.viewAllButton}
                        onClick={() => navigate('/baiviet')}
                    >
                        Xem tất cả bài viết →
                    </button> */}
                </div>
            </div>

            {/* Add Blog Modal */}
            {showAddBlog && selectedCategory && (
                <AddBlog
                    blogTypeId={selectedCategory}
                    onClose={() => setShowAddBlog(false)}
                    onBlogAdded={handleBlogAdded}
                />
            )}
        </div>
    );
};

export default Media;