import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './MyBookings.module.css';

interface Booking {
    id: string;
    location: string;
    bookingDate: string;
    description: string;
    contactPersonName: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    status: string; // PENDING, APPROVED, REJECTED...
    userName: string;
}

const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            navigate('/dang-nhap');
            return;
        }
        setIsLoggedIn(true);
        fetchMyBookings(userId, token);
    }, [navigate]);

    const fetchMyBookings = async (userId: string, token: string) => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                setBookings(res.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return 'Đã duyệt';
            case 'PENDING':
                return 'Chờ duyệt';
            case 'REJECTED':
                return 'Từ chối';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'IN_PROGRESS':
                return 'Đang thực hiện';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return styles.confirmed;
            case 'PENDING':
                return styles.pending;
            case 'CANCELLED':
            case 'REJECTED':
                return styles.cancelled;
            default:
                return '';
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đặt sự kiện này?')) {
            try {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}/cancel`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );
                setBookings(prev =>
                    prev.map(b =>
                        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
                    )
                );
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('Không thể hủy sự kiện. Vui lòng thử lại.');
            }
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
                                <div className={styles.bookingContent}>
                                    <h3 className={styles.eventTitle}>{booking.location}</h3>
                                    {/* <div className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                        {getStatusText(booking.status)}
                                    </div> */}
                                    <div className={styles.bookingDetails}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>📅 Ngày đặt:</span>
                                            <span className={styles.detailValue}>
                                                {new Date(booking.bookingDate).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>📍 Người liên hệ:</span>
                                            <span className={styles.detailValue}>{booking.contactPersonName}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>📧 Email:</span>
                                            <span className={styles.detailValue}>{booking.contactPersonEmail}</span>
                                        </div>
                                    </div>
                                    <div className={styles.bookingActions}>
                                        {booking.status.toUpperCase() === 'PENDING' && (
                                            <button
                                                className={styles.cancelButton}
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Hủy đặt
                                            </button>
                                        )}
                                        {booking.status.toUpperCase() === 'APPROVED' && (
                                            <div className={styles.confirmedMessage}>
                                                ✅ Sự kiện đã được duyệt
                                            </div>
                                        )}
                                        {(booking.status.toUpperCase() === 'CANCELLED' ||
                                          booking.status.toUpperCase() === 'REJECTED') && (
                                            <div className={styles.cancelledMessage}>
                                                ❌ Sự kiện đã bị hủy/từ chối
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
