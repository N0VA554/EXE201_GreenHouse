import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Events.module.css';

interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    capacity: number;
    registeredCount: number;
}

const Events: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('roleName');
        if (token) {
            setIsLoggedIn(true);
            setUserRole(role || '');
        }
    }, []);

    // Mock data for events
    const events: Event[] = [
        {
            id: 1,
            title: "Hội thảo Phân loại Rác thải tại Trường Tiểu học",
            description: "Chương trình giáo dục về phân loại rác thải cho học sinh tiểu học, giúp các em hiểu rõ tầm quan trọng của việc bảo vệ môi trường và cách phân loại rác đúng cách.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            date: "15/12/2024",
            location: "Trường Tiểu học ABC, Quận 1, TP.HCM",
            capacity: 100,
            registeredCount: 45
        },
        {
            id: 2,
            title: "Workshop Tái chế Sáng tạo cho Trường THCS",
            description: "Workshop thực hành tái chế các vật dụng hàng ngày thành những sản phẩm hữu ích, khuyến khích học sinh phát triển tư duy sáng tạo và ý thức bảo vệ môi trường.",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80",
            date: "20/12/2024",
            location: "Trường THCS XYZ, Quận 3, TP.HCM",
            capacity: 80,
            registeredCount: 62
        },
        {
            id: 3,
            title: "Cuộc thi Sáng tạo Xanh cho Trường THPT",
            description: "Cuộc thi thiết kế và thực hiện các dự án bảo vệ môi trường, tạo cơ hội cho học sinh THPT thể hiện khả năng sáng tạo và đóng góp tích cực cho cộng đồng.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2013&q=80",
            date: "25/12/2024",
            location: "Trường THPT DEF, Quận 7, TP.HCM",
            capacity: 120,
            registeredCount: 78
        }
    ];

    const handleBookEvent = (eventId: number) => {
        if (!isLoggedIn) {
            navigate('/dang-nhap');
            return;
        }
        // TODO: Implement booking logic
        alert(`Đã đăng ký sự kiện ${eventId} thành công!`);
    };

    const handleViewMyBookings = () => {
        if (!isLoggedIn) {
            navigate('/dang-nhap');
            return;
        }
        navigate('/lich-dat');
    };

    return (
        <div className={styles.eventsContainer}>
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Sự Kiện Giáo Dục Môi Trường</h1>
                    <p className={styles.heroDescription}>
                        Tham gia các sự kiện giáo dục về phân loại rác thải và tái chế tại các trường học. 
                        Chúng tôi cam kết mang đến những kiến thức bổ ích và thực hành thiết thực cho thế hệ trẻ.
                    </p>
                    <div className={styles.heroButtons}>
                        <button 
                            className={styles.primaryButton}
                            onClick={() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Khám phá sự kiện
                        </button>
                        {isLoggedIn && (
                            <button 
                                className={styles.secondaryButton}
                                onClick={handleViewMyBookings}
                            >
                                Xem lịch đặt của tôi
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <img 
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80" 
                        alt="Environmental Education" 
                    />
                </div>
            </div>

            <div id="events-list" className={styles.eventsList}>
                <h2 className={styles.sectionTitle}>Các Sự Kiện Sắp Tới</h2>
                <div className={styles.eventsGrid}>
                    {events.map((event) => (
                        <div key={event.id} className={styles.eventCard}>
                            <div className={styles.eventImage}>
                                <img src={event.image} alt={event.title} />
                                <div className={styles.eventStatus}>
                                    <span className={styles.eventDate}>{event.date}</span>
                                    <span className={styles.eventLocation}>{event.location}</span>
                                </div>
                            </div>
                            <div className={styles.eventContent}>
                                <h3 className={styles.eventTitle}>{event.title}</h3>
                                <p className={styles.eventDescription}>{event.description}</p>
                                <div className={styles.eventStats}>
                                    <span className={styles.capacity}>
                                        Sức chứa: {event.registeredCount}/{event.capacity}
                                    </span>
                                    <div className={styles.progressBar}>
                                        <div 
                                            className={styles.progressFill} 
                                            style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <button 
                                    className={`${styles.bookButton} ${event.registeredCount >= event.capacity ? styles.disabled : ''}`}
                                    onClick={() => handleBookEvent(event.id)}
                                    disabled={event.registeredCount >= event.capacity}
                                >
                                    {event.registeredCount >= event.capacity ? 'Đã hết chỗ' : 'Đặt sự kiện ngay'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h2>Về Chương Trình Giáo Dục Môi Trường</h2>
                    <div className={styles.aboutGrid}>
                        <div className={styles.aboutItem}>
                            <div className={styles.aboutIcon}>🌱</div>
                            <h3>Mục Tiêu</h3>
                            <p>Nâng cao nhận thức về bảo vệ môi trường và thúc đẩy hành động tích cực trong cộng đồng học sinh.</p>
                        </div>
                        <div className={styles.aboutItem}>
                            <div className={styles.aboutIcon}>🎓</div>
                            <h3>Đối Tượng</h3>
                            <p>Học sinh từ cấp tiểu học đến THPT, giáo viên và phụ huynh quan tâm đến môi trường.</p>
                        </div>
                        <div className={styles.aboutItem}>
                            <div className={styles.aboutIcon}>🏫</div>
                            <h3>Địa Điểm</h3>
                            <p>Các trường học trên địa bàn TP.HCM và các tỉnh lân cận.</p>
                        </div>
                        <div className={styles.aboutItem}>
                            <div className={styles.aboutIcon}>📚</div>
                            <h3>Nội Dung</h3>
                            <p>Kiến thức về phân loại rác, tái chế, và các hoạt động thực hành sáng tạo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events; 