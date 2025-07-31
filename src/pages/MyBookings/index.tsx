import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyBookings.module.css';

interface Booking {
    id: number;
    eventId: number;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    bookingDate: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    eventImage: string;
}

const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/dang-nhap');
            return;
        }
        setIsLoggedIn(true);
        
        // Mock data for bookings
        const mockBookings: Booking[] = [
            {
                id: 1,
                eventId: 1,
                eventTitle: "Hội thảo Phân loại Rác thải tại Trường Tiểu học",
                eventDate: "15/12/2024",
                eventLocation: "Trường Tiểu học ABC, Quận 1, TP.HCM",
                bookingDate: "10/12/2024",
                status: 'confirmed',
                eventImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 2,
                eventId: 2,
                eventTitle: "Workshop Tái chế Sáng tạo cho Trường THCS",
                eventDate: "20/12/2024",
                eventLocation: "Trường THCS XYZ, Quận 3, TP.HCM",
                bookingDate: "12/12/2024",
                status: 'pending',
                eventImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80"
            }
        ];
        
        setTimeout(() => {
            setBookings(mockBookings);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Đã xác nhận';
            case 'pending':
                return 'Đang chờ';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'confirmed':
                return styles.confirmed;
            case 'pending':
                return styles.pending;
            case 'cancelled':
                return styles.cancelled;
            default:
                return '';
        }
    };

    const handleCancelBooking = (bookingId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đặt sự kiện này?')) {
            setBookings(bookings.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'cancelled' as const }
                    : booking
            ));
        }
    };

    const handleBackToEvents = () => {
        navigate('/su-kien');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Đang tải lịch đặt sự kiện...</p>
            </div>
        );
    }

    return (
        <div className={styles.bookingsContainer}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Lịch Đặt Sự Kiện Của Tôi</h1>
                    <p className={styles.subtitle}>
                        Quản lý các sự kiện bạn đã đăng ký tham gia
                    </p>
                    <button 
                        className={styles.backButton}
                        onClick={handleBackToEvents}
                    >
                        ← Quay lại trang sự kiện
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📅</div>
                        <h2>Chưa có đặt sự kiện nào</h2>
                        <p>Bạn chưa đăng ký tham gia sự kiện nào. Hãy khám phá các sự kiện sắp tới!</p>
                        <button 
                            className={styles.exploreButton}
                            onClick={handleBackToEvents}
                        >
                            Khám phá sự kiện
                        </button>
                    </div>
                ) : (
                    <div className={styles.bookingsList}>
                        {bookings.map((booking) => (
                            <div key={booking.id} className={styles.bookingCard}>
                                <div className={styles.bookingImage}>
                                    <img src={booking.eventImage} alt={booking.eventTitle} />
                                    <div className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                        {getStatusText(booking.status)}
                                    </div>
                                </div>
                                <div className={styles.bookingContent}>
                                    <h3 className={styles.eventTitle}>{booking.eventTitle}</h3>
                                    <div className={styles.bookingDetails}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>📅 Ngày sự kiện:</span>
                                            <span className={styles.detailValue}>{booking.eventDate}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>📍 Địa điểm:</span>
                                            <span className={styles.detailValue}>{booking.eventLocation}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>📝 Ngày đặt:</span>
                                            <span className={styles.detailValue}>{booking.bookingDate}</span>
                                        </div>
                                    </div>
                                    <div className={styles.bookingActions}>
                                        {booking.status === 'pending' && (
                                            <button 
                                                className={styles.cancelButton}
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Hủy đặt
                                            </button>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <div className={styles.confirmedMessage}>
                                                ✅ Sự kiện đã được xác nhận
                                            </div>
                                        )}
                                        {booking.status === 'cancelled' && (
                                            <div className={styles.cancelledMessage}>
                                                ❌ Sự kiện đã bị hủy
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings; 