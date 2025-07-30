import React from 'react';
import styles from './Guidelines.module.css';
import { useRecycleGuide } from '../RecycleGuideContext';


const RecyclingGuidelines: React.FC = () => {
    const { data, loading } = useRecycleGuide();

    if (loading) return <div>Đang tải...</div>;
    if (!data) return null;

    // Function to extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Function to render video if URL exists
    const renderVideo = (videoUrl: string | null) => {
        if (!videoUrl) return null;
        
        const videoId = getYouTubeVideoId(videoUrl);
        if (!videoId) return null;

        return (
            <div className={styles.videoSection}>
                {/* <h3 className={styles.videoTitle}>Video hướng dẫn</h3> */}
                <div className={styles.videoContainer}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Video hướng dẫn"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.videoFrame}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.guidelinesContainer}>
            <div className={styles.coloredSection}>
                <h2 className={styles.sectionTitle}>{data.title}</h2>
                
                {/* Video Section - Top */}
                {renderVideo(data.videoUrl)}
                
                {/* Content and Image Section - Side by side */}
                <div className={styles.contentImageSection}>
                    {/* Content Section */}
                    <div className={styles.contentSection}>
                        <div
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    </div>
                    
                    {/* Image Section - Right side */}
                    {data.imageUrl && (
                        <div className={styles.imageSection}>
                            <img 
                                src={data.imageUrl} 
                                alt={data.title} 
                                className={styles.guidelineImage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecyclingGuidelines;