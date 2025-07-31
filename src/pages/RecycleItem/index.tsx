import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecycleGuideProvider, useRecycleGuide } from '../../components/RecycleItemDetail/RecycleGuideContext';
import RecyclingHeader from '../../components/RecycleItemDetail/Header';
import RecyclingGuidelines from '../../components/RecycleItemDetail/Guidelines';
import RecyclingLocation from '../../components/RecycleItemDetail/Location';
import Hazards from '../../components/RecycleItemDetail/Hazards';
import MiniCarousel from '../../components/MiniCarousel';
import AvatarOverlay from '../../components/RecycleItemDetail/Avt';
import Breadcrumb from '../../components/Breadcrumb';
import axios from 'axios';
import styles from './RecycleItem.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const { data } = useRecycleGuide();
    const [form, setForm] = useState({
        title: data?.title || '',
        content: data?.content || '',
        imageUrl: data?.imageUrl || '',
        videoUrl: data?.videoUrl || '',
        wasteId: data?.wasteId || '',
    });
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (data) {
            setForm({
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
                videoUrl: data.videoUrl || '',
                wasteId: data.wasteId,
            });
        }
    }, [data, open]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleContentChange = (value: string) => {
        setForm(f => ({ ...f, content: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/recycleguides`, {
                id: data?.id,
                ...form,
            });
            window.location.reload();
        } catch {
            alert('Lưu thất bại');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa hướng dẫn này?')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/recycleguides/${data?.id}`);
            window.location.href = '/';
        } catch {
            alert('Xóa thất bại');
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Chỉnh sửa hướng dẫn tái chế</h3>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className={styles.formGroup}>
                        <label>Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Nội dung (Richtext)</label>
                        <ReactQuill
                            theme="snow"
                            value={form.content}
                            onChange={handleContentChange}
                            style={{ background: 'white' }}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>URL hình ảnh</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>URL video</label>
                        <input
                            type="text"
                            name="videoUrl"
                            value={form.videoUrl}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Waste ID</label>
                        <input
                            type="text"
                            name="wasteId"
                            value={form.wasteId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={saving}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={handleDelete}
                        >
                            Xóa
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RecyclingLocationWrapper: React.FC = () => {
    const { data, loading } = useRecycleGuide();
    if (loading) return null;
    if (!data) return null;
    return <RecyclingLocation wasteId={data.wasteId} />;
};

const BreadcrumbWrapper: React.FC = () => {
    const { data, loading } = useRecycleGuide();
    if (loading) return null;
    return <Breadcrumb wasteName={data?.wasteName} />;
};

const AvatarOverlayWrapper: React.FC = () => {
    const { data, loading } = useRecycleGuide();
    if (loading) return null;
    if (!data) return null;
    return <AvatarOverlay wasteId={data.wasteId} />;
};

const HazardsWrapper: React.FC = () => {
    const { data, loading } = useRecycleGuide();
    if (loading) return null;
    if (!data) return null;
    return <Hazards wasteId={data.wasteId} />;
};

const RecycleItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [editOpen, setEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('hazards');
    const roleName = localStorage.getItem('roleName');

    if (!id) return <div>Không tìm thấy hướng dẫn</div>;

    return (
        <>
            <EditGuideModal open={editOpen} onClose={() => setEditOpen(false)} />
            <div style={{ position: 'relative', paddingBottom: 70 }}>
                <MiniCarousel />
            </div>
            <RecycleGuideProvider id={id}>
                <div style={{ paddingTop: 0 }}>
                    <AvatarOverlayWrapper />
                    <BreadcrumbWrapper />
                    <RecyclingHeader />

                    {/* Tab Navigation */}
                    <div className={styles.tabContainer}>
                        <div className={styles.tabNavigation}>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'hazards' ? styles.active : ''}`}
                                onClick={() => setActiveTab('hazards')}
                            >
                                <span className={styles.tabIcon}>⚠️</span>
                                Tác hại
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'guidelines' ? styles.active : ''}`}
                                onClick={() => setActiveTab('guidelines')}
                            >
                                <span className={styles.tabIcon}>📋</span>
                                Hướng dẫn tái chế
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'locations' ? styles.active : ''}`}
                                onClick={() => setActiveTab('locations')}
                            >
                                <span className={styles.tabIcon}>📍</span>
                                Nơi tái chế
                            </button>

                            <button
                                className={`${styles.tabButton} ${activeTab === 'regulations' ? styles.active : ''}`}
                                onClick={() => setActiveTab('regulations')}
                            >
                                <span className={styles.tabIcon}>⚖️</span>
                                Quy định nhà nước
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className={styles.tabContent}>
                            {activeTab === 'guidelines' && (
                                <div className={styles.tabPanel}>
                                    <RecyclingGuidelines />
                                    {roleName === 'Staff' && (
                                        <button
                                            className={styles.editGuideButton}
                                            onClick={() => setEditOpen(true)}
                                        >
                                            Chỉnh sửa hướng dẫn
                                        </button>
                                    )}
                                </div>
                            )}
                            {activeTab === 'locations' && (
                                <div className={styles.tabPanel}>
                                    <RecyclingLocationWrapper />
                                </div>
                            )}
                            {activeTab === 'hazards' && (
                                <div className={styles.tabPanel}>
                                    <HazardsWrapper />
                                </div>
                            )}
                            {activeTab === 'regulations' && (
                                <div className={styles.tabPanel}>
                                    <div className={styles.regulationsContent}>
                                        <h2>Quy định của Nhà nước về tái chế</h2>
                                        <p>Nội dung quy định sẽ được cập nhật sớm...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </RecycleGuideProvider>
        </>
    );
};

export default RecycleItem;