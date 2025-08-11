import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './BookingsManagement.module.css';

interface BookingData {
    id: string;
    location: string;
    bookingDate: string;
    description: string;
    contactPersonName: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    status: string;
    userName: string;
    userId?: string;
}

interface BookingResponse {
    data: BookingData[];
    message: string | null;
    statusCode: string;
    code: string;
}

const BookingsManagement: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        checkAuthAndRole();
    }, []);

    useEffect(() => {
        if (bookings.length > 0) {
            setLoading(false);
        }
    }, [bookings]);

    const checkAuthAndRole = () => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('roleName');

        if (!token) {
            navigate('/dang-nhap');
            return;
        }

        if (role !== 'Staff') {
            navigate('/');
            return;
        }

        fetchBookings();
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 200) {
                const bookingResponse: BookingResponse = response.data;
                setBookings(bookingResponse.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId: string, status: string) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const confirmMessage = `Bạn có chắc chắn muốn thay đổi trạng thái lịch đặt của ${booking.contactPersonName} thành "${getStatusText(status)}"?`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/update_status?status=${status}&id=${bookingId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 200) {
                alert('Cập nhật trạng thái thành công!');
                fetchBookings();
                setIsDetailModalOpen(false);
                setSelectedBooking(null);
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return '#28a745';
            case 'PENDING':
                return '#ffc107';
            case 'REJECTED':
                return '#dc3545';
            case 'COMPLETED':
                return '#17a2b8';
            case 'CANCELLED':
                return '#6c757d';
            case 'IN_PROGRESS':
                return '#fd7e14';
            default:
                return '#6c757d';
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

    const getAvailableStatuses = (currentStatus: string) => {
        const status = currentStatus.toUpperCase();
        switch (status) {
            case 'PENDING':
                return ['APPROVED', 'REJECTED'];
            case 'APPROVED':
            case 'REJECTED':
                return ['COMPLETED'];
            case 'COMPLETED':
                return [];
            default:
                return ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateString = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const isPast = date < today;

            const dayBookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.bookingDate);
                return bookingDate.toISOString().split('T')[0] === dateString;
            });

            days.push({
                date: dateString,
                day: date.getDate(),
                isCurrentMonth,
                isPast,
                bookings: dayBookings
            });
        }
        return days;
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };
    const [newStatus, setNewStatus] = useState<string>("");
    const handleBookingClick = (booking: BookingData) => {
        setSelectedBooking(booking);
        setNewStatus(""); // reset khi mở popup
        setIsDetailModalOpen(true);
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'ALL' || booking.status.toUpperCase() === filterStatus;
        const matchesSearch = searchTerm === '' ||
            booking.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStats = () => {
        const total = bookings.length;
        const pending = bookings.filter(b => b.status.toUpperCase() === 'PENDING').length;
        const approved = bookings.filter(b => b.status.toUpperCase() === 'APPROVED').length;
        const completed = bookings.filter(b => b.status.toUpperCase() === 'COMPLETED').length;
        const rejected = bookings.filter(b => b.status.toUpperCase() === 'REJECTED').length;

        return { total, pending, approved, completed, rejected };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Quản Lý Lịch Đặt Sự Kiện</h1>
                    <p>Quản lý và duyệt các lịch đặt sự kiện của người dùng</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.total}</h3>
                        <p>Tổng số lịch đặt</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.pending}</h3>
                        <p>Chờ duyệt</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.approved}</h3>
                        <p>Đã duyệt</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎯</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.completed}</h3>
                        <p>Hoàn thành</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>❌</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.rejected}</h3>
                        <p>Từ chối</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersContainer}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, địa điểm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.statusFilter}>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="REJECTED">Từ chối</option>
                        <option value="COMPLETED">Hoàn thành</option>
                    </select>
                </div>
            </div>

            {/* Calendar */}
            <div className={styles.calendarContainer}>
                <div className={styles.calendarHeader}>
                    <button onClick={() => changeMonth('prev')} className={styles.monthButton}>
                        &lt;
                    </button>
                    <h2>{formatMonthYear(currentMonth)}</h2>
                    <button onClick={() => changeMonth('next')} className={styles.monthButton}>
                        &gt;
                    </button>
                </div>

                <div className={styles.calendarGrid}>
                    <div className={styles.calendarWeekday}>CN</div>
                    <div className={styles.calendarWeekday}>T2</div>
                    <div className={styles.calendarWeekday}>T3</div>
                    <div className={styles.calendarWeekday}>T4</div>
                    <div className={styles.calendarWeekday}>T5</div>
                    <div className={styles.calendarWeekday}>T6</div>
                    <div className={styles.calendarWeekday}>T7</div>

                    {generateCalendarDays().map((day) => (
                        <div key={day.date} className={styles.calendarDay}>
                            <div className={styles.dayNumber}>{day.day}</div>
                            {day.bookings.length > 0 && (
                                <div className={styles.bookingsForDay}>
                                    {day.bookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className={styles.bookingItem}
                                            onClick={() => handleBookingClick(booking)}
                                        >
                                            <div className={styles.bookingHeader}>
                                                <h4>{booking.contactPersonName}</h4>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{ backgroundColor: getStatusColor(booking.status) }}
                                                >
                                                    {getStatusText(booking.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Detail Modal */}
            {isDetailModalOpen && selectedBooking && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Chi tiết lịch đặt</h3>
                            <button className={styles.closeButton} onClick={() => {
                                setIsDetailModalOpen(false);
                                setSelectedBooking(null);
                            }}>×</button>
                        </div>
                        <div className={styles.bookingDetailContent}>
                            <div className={styles.bookingDetailItem}>
                                <strong>Người đặt:</strong> {selectedBooking.userName}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Người liên hệ:</strong> {selectedBooking.contactPersonName}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Địa điểm:</strong> {selectedBooking.location}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Ngày giờ:</strong> {formatDate(selectedBooking.bookingDate)}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Mô tả:</strong> {selectedBooking.description}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Email:</strong> {selectedBooking.contactPersonEmail}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>SĐT:</strong> {selectedBooking.contactPersonPhone}
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Trạng thái:</strong>
                                <span
                                    className={styles.statusBadge}
                                    style={{ backgroundColor: getStatusColor(selectedBooking.status) }}
                                >
                                    {getStatusText(selectedBooking.status)}
                                </span>
                            </div>
                            <div className={styles.bookingDetailItem}>
                                <strong>Cập nhật trạng thái:</strong>
                                <select
                                    className={styles.statusSelect}
                                    value={newStatus}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (!selected) return; // nếu chọn option trống thì bỏ qua

                                        if (window.confirm(`Bạn có chắc chắn muốn chuyển sang trạng thái "${getStatusText(selected)}"?`)) {
                                            updateBookingStatus(selectedBooking.id, selected);
                                        } else {
                                            setNewStatus(""); // hủy thì quay lại option trống
                                        }
                                    }}
                                >
                                    <option value="">-- Chọn trạng thái mới --</option>
                                    {getAvailableStatuses(selectedBooking.status).map(status => (
                                        <option key={status} value={status}>
                                            {getStatusText(status)}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsManagement; 