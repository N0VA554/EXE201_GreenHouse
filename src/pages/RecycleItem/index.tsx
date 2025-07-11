import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecycleGuideProvider, useRecycleGuide } from '../../components/RecycleItemDetail/RecycleGuideContext';
import RecyclingHeader from '../../components/RecycleItemDetail/Header';
import RecyclingGuidelines from '../../components/RecycleItemDetail/Guidelines';
import RecyclingLocation from '../../components/RecycleItemDetail/Location';
import MiniCarousel from '../../components/MiniCarousel';
import AvatarOverlay from '../../components/RecycleItemDetail/Avt';
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

const RecycleItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [editOpen, setEditOpen] = useState(false);

    if (!id) return <div>Không tìm thấy hướng dẫn</div>;

    return (
        <RecycleGuideProvider id={id}>
            <EditGuideModal open={editOpen} onClose={() => setEditOpen(false)} />
            <div style={{ position: 'relative', paddingBottom: 70 }}>
                <MiniCarousel />
                <AvatarOverlay />
            </div>
            <div style={{ paddingTop: 60 }}>
                <RecyclingHeader />
                <RecyclingGuidelines />
                
                
                <button
                    className={styles.editGuideButton}
                    onClick={() => setEditOpen(true)}
                >
                    Chỉnh sửa hướng dẫn
                </button>
                <RecyclingLocationWrapper />
            </div>
        </RecycleGuideProvider>
    );
};

export default RecycleItem;