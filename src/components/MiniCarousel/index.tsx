import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './MiniCarousel.module.css';

const MiniCarousel: React.FC = () => {
    
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
        "https://provietnam.com.vn/wp-content/uploads/2023/07/home-slider-1-jpg.webp", // Biển
        "https://provietnam.com.vn/wp-content/uploads/2023/07/home-slider-3-jpg.webp", // Rừng
        "https://provietnam.com.vn/wp-content/uploads/2023/07/home-slider-2-jpg.webp", // Núi
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
            
        </div>
    );
};

export default MiniCarousel;