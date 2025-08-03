import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

interface BookingForm {
    location: string;
    bookingDate: string;
    description: string;
    contactPersonName: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    status: string;
    userId: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (bookingData: BookingForm) => void;
    eventDescription?: string;
    isExistingEvent?: boolean;
    eventTitle?: string;
    isDateBooked?: (date: string) => boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    eventDescription = '', 
    isExistingEvent = false,
    eventTitle = '',
    isDateBooked
}) => {
    const [formData, setFormData] = useState<BookingForm>({
        location: '',
        bookingDate: '',
        description: eventDescription,
        contactPersonName: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        status: 'PENDING',
        userId: ''
    });

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('09:00');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setFormData(prev => ({ ...prev, userId }));
        }
    }, []);

    useEffect(() => {
        if (eventDescription && isExistingEvent) {
            setFormData(prev => ({ ...prev, description: eventDescription }));
        } else if (!isExistingEvent) {
            setFormData(prev => ({ ...prev, description: '' }));
        }
    }, [eventDescription, isExistingEvent]);

    const handleDateSelect = (date: string) => {
        if (isDateBooked && isDateBooked(date)) {
            return; // Không cho phép chọn ngày đã được đặt
        }
        setSelectedDate(date);
        const dateTimeString = `${date}T${selectedTime}`;
        setFormData(prev => ({ ...prev, bookingDate: dateTimeString }));
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const dateTimeString = `${selectedDate}T${time}`;
            setFormData(prev => ({ ...prev, bookingDate: dateTimeString }));
        }
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
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
            const isBooked = isDateBooked ? isDateBooked(dateString) : false;
            const isSelected = selectedDate === dateString;

            days.push({
                date: dateString,
                day: date.getDate(),
                isCurrentMonth,
                isPast,
                isBooked,
                isSelected
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>{isExistingEvent ? `Đăng ký sự kiện: ${eventTitle}` : 'Đặt sự kiện mới'}</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.bookingForm}>
                    <div className={styles.formLeft}>
                        <div className={styles.formGroup}>
                            <label>Ngày tổ chức *</label>
                            <div className={styles.calendarContainer}>
                                <div className={styles.calendarHeader}>
                                    <button onClick={() => changeMonth('prev')}>&lt;</button>
                                    <h4>{formatMonthYear(currentMonth)}</h4>
                                    <button onClick={() => changeMonth('next')}>&gt;</button>
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
                                        <div
                                            key={day.date}
                                            className={`${styles.calendarDay} ${day.isCurrentMonth ? '' : styles.otherMonthDay} ${day.isPast ? styles.pastDay : ''} ${day.isBooked ? styles.bookedDay : ''} ${day.isSelected ? styles.selectedDay : ''}`}
                                            onClick={() => handleDateSelect(day.date)}
                                        >
                                            <span>{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.timeSelect}>
                                    <label>Giờ tổ chức *</label>
                                    <select value={selectedTime} onChange={(e) => handleTimeSelect(e.target.value)}>
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="11:00">11:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                    </select>
                                </div>
                                <div className={styles.calendarNote}>
                                    <p>⚠️ Bạn không thể đặt các ngày đã có người đặt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.formRight}>
                        <div className={styles.formGroup}>
                            <label>Địa điểm *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Nhập địa điểm tổ chức sự kiện"
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Mô tả sự kiện *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết về sự kiện"
                                rows={4}
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Họ tên người liên hệ *</label>
                            <input
                                type="text"
                                name="contactPersonName"
                                value={formData.contactPersonName}
                                onChange={handleChange}
                                placeholder="Nhập họ tên người liên hệ"
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Số điện thoại *</label>
                            <input
                                type="tel"
                                name="contactPersonPhone"
                                value={formData.contactPersonPhone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input
                                type="email"
                                name="contactPersonEmail"
                                value={formData.contactPersonEmail}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ email"
                                required
                            />
                        </div>
                        
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.cancelButton} onClick={onClose}>
                                Hủy
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                {isExistingEvent ? 'Đăng ký sự kiện' : 'Đặt sự kiện'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};



const Events: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isNewEventBooking, setIsNewEventBooking] = useState<boolean>(false);
    const [allBookings, setAllBookings] = useState<BookingData[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('roleName');
        if (token) {
            setIsLoggedIn(true);
            setUserRole(role || '');
        }
    }, []);

    const fetchAllBookingsForCalendar = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 200) {
                const bookingResponse: BookingResponse = response.data;
                setAllBookings(bookingResponse.data);
            }
        } catch (error) {
            console.error('Error fetching bookings for calendar:', error);
        }
    };

    const getBookedDates = () => {
        return allBookings.map(booking => {
            const date = new Date(booking.bookingDate);
            return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        });
    };

    const isDateBooked = (date: string) => {
        const bookedDates = getBookedDates();
        return bookedDates.includes(date);
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

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return '#28a745'; // Xanh lá - Thành công
            case 'PENDING':
                return '#ffc107'; // Vàng - Chờ xử lý
            case 'REJECTED':
                return '#dc3545'; // Đỏ - Từ chối
            case 'COMPLETED':
                return '#17a2b8'; // Xanh dương - Hoàn thành
            case 'CANCELLED':
                return '#6c757d'; // Xám - Đã hủy
            case 'IN_PROGRESS':
                return '#fd7e14'; // Cam - Đang thực hiện
            default:
                return '#6c757d'; // Xám mặc định
        }
    };

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

    const handleBookEvent = (event: Event) => {
        if (!isLoggedIn) {
            navigate('/dang-nhap');
            return;
        }
        setSelectedEvent(event);
        setIsNewEventBooking(false);
        setIsBookingModalOpen(true);
    };

    const handleNewEventBooking = async () => {
        if (!isLoggedIn) {
            navigate('/dang-nhap');
            return;
        }
        await fetchAllBookingsForCalendar();
        setSelectedEvent(null);
        setIsNewEventBooking(true);
        setIsBookingModalOpen(true);
    };

    const handleBookingSubmit = async (bookingData: BookingForm) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 200) { // Assuming 201 Created for successful booking
                alert(isNewEventBooking ? 'Đặt sự kiện thành công!' : 'Đăng ký sự kiện thành công!');
                setIsBookingModalOpen(false);
                setSelectedEvent(null);
            } else {
                const errorData = response.data;
                alert(`Lỗi: ${errorData.message || 'Có lỗi xảy ra khi đặt sự kiện'}`);
            }
        } catch (error) {
            console.error('Error booking event:', error);
            alert('Có lỗi xảy ra khi đặt sự kiện. Vui lòng thử lại.');
        }
    };

    const handleViewMyBookings = () => {
        if (!isLoggedIn) {
            navigate('/dang-nhap');
            return;
        }
        
        if (userRole === 'Staff') {
            navigate('/quan-ly-lich-dat');
        } else {
            navigate('/lich-dat');
        }
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
                        {isLoggedIn && userRole !== 'Staff' && (
                            <button 
                                className={styles.primaryButton}
                                onClick={handleNewEventBooking}
                            >
                                Đặt sự kiện mới
                            </button>
                        )}
                        <div className={styles.secondaryButtons}>
                            <button 
                                className={styles.secondaryButton}
                                onClick={() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Khám phá sự kiện
                            </button>
                            {isLoggedIn && (
                                <button 
                                    className={styles.secondaryButton}
                                    onClick={handleViewMyBookings}
                                >
                                    {userRole === 'Staff' ? 'Xem lịch đặt sự kiện' : 'Xem lịch đặt của tôi'}
                                </button>
                            )}
                        </div>
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
                <h2 className={styles.sectionTitle}>Các Sự Kiện Chúng Tôi Đã Tổ Chức</h2>
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
                                    onClick={() => handleBookEvent(event)}
                                    disabled={event.registeredCount >= event.capacity}
                                >
                                    {event.registeredCount >= event.capacity ? 'Đã hết chỗ' : 'Đặt sự kiện này ngay'}
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

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => {
                    setIsBookingModalOpen(false);
                    setSelectedEvent(null);
                }}
                onSubmit={handleBookingSubmit}
                eventDescription={selectedEvent?.description || ''}
                isExistingEvent={!isNewEventBooking}
                eventTitle={selectedEvent?.title || ''}
                isDateBooked={isDateBooked}
            />


        </div>
    );
};

export default Events; 