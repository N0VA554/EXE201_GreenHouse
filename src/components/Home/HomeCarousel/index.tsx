import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './HomeCarousel.module.css';

const HomeCarousel: React.FC = () => {
    
    // Cài đặt cho carousel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Danh sách hình ảnh (thay thế bằng URL hình ảnh của bạn)
    const images = [
        "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-viet-nam.jpg", // Biển
        "https://nangluongvietnam.vn/stores/news_dataimages/Maithang/052022/04/15/3909_k2.jpg", // Rừng
        "https://azmotorbikes.com/wp-content/uploads/2023/12/anh-dep-viet-nam-7.jpg", // Núi
    ];

    return (
        <div className={styles['carousel-container']}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className={styles['carousel-slide']}>
                        <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </Slider>
            <div className={styles['overlay-text']}>
                <p>#GREENHOME</p>
                <h1>VÌ MỘT VIỆT NAM XANH - SẠCH - ĐẸP</h1>
            </div>
            <div className={styles['scroll-indicator']}>
                <img 
                    src="https://provietnam.com.vn/wp-content/themes/provn/dist/images/mouse.svg" 
                    alt="Scroll down"
                />
                <span className={styles['scroll-text']}>Cuộn xuống</span>
            </div>
        </div>
    );
};

export default HomeCarousel;