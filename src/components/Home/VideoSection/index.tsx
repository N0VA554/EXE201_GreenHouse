import React, { useEffect, useRef, useState } from 'react';
import styles from './VideoSection.module.css';

const VideoSection: React.FC = () => {
    const videoRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once the video is visible
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the component is visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const videoId = 'PHS1IgZXylY';
    // Add autoplay=1 when visible
    const embedUrl = `https://www.youtube.com/embed/${videoId}?${isVisible ? 'autoplay=1&' : ''}rel=0&modestbranding=1&mute=1`;
    
    return (
        <div className={styles.videoSectionContainer} ref={videoRef}>
            <div className={styles.videoWrapper}>
                <iframe
                    className={styles.videoIframe}
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <p>
                Tìm hiểu cách tái chế rác thải hiệu quả qua video hướng dẫn chi tiết của chúng tôi. Hãy cùng hành động vì một môi trường xanh hơn!
            </p>
        </div>
    );
};

export default VideoSection;