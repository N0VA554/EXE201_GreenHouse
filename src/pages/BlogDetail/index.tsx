import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MiniCarousel from '../../components/MiniCarousel';
import styles from './BlogDetail.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

interface BlogDetailData {
    id?: string;
    title: string;
    content: string;
    imageUrl: string;
    createdTime: string;
    author?: { fullName?: string };
}

// Axios instance with auth header
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

const EditBlogModal: React.FC<{
    open: boolean;
    onClose: () => void;
    data: BlogDetailData | null;
}> = ({ open, onClose, data }) => {
    const [form, setForm] = useState({
        title: data?.title || '',
        content: data?.content || '',
        imageUrl: data?.imageUrl || '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (data) {
            setForm({
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
            });
        }
    }, [data, open]);

    if (!open || !data) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axiosInstance.put('/blogs', {
                id: data.id,
                ...form,
            });
            window.location.reload();
        } catch (error) {
            alert('Lưu thất bại');
            console.error('Lưu thất bại', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;
        try {
            await axiosInstance.delete(`/blogs/${data.id}`);
            window.location.href = '/';
        } catch (error) {
            alert('Xóa thất bại');
            console.error(error);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Chỉnh sửa bài viết</h3>
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
                            onChange={value => setForm(f => ({ ...f, content: value }))}
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

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<BlogDetailData | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const roleName = localStorage.getItem('roleName');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(`/blogs/${id}`);
                setData(res.data.data);
            } catch (error) {
                console.error('Lỗi khi tải blog:', error);
            }
        };
        fetchData();
    }, [id]);

    if (!data) return <div>Đang tải...</div>;

    return (
        <div style={{ background: '#f4faf6', padding: '0 0 40px 0' }}>
            <MiniCarousel />
            <EditBlogModal open={editOpen} onClose={() => setEditOpen(false)} data={data} />
            <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', padding: 32 }}>
                <div style={{ textAlign: 'center', padding: '40px 0 24px 0', background: '#eaf7ee' }}>
                    <h1 style={{ color: '#2e7d32', fontWeight: 700, fontSize: 36, margin: 0 }}>{data.title}</h1>
                </div>
                {data.imageUrl && (
                    <div style={{ textAlign: 'center', margin: '24px 0' }}>
                        <img src={data.imageUrl} alt={data.title} style={{ maxWidth: '100%', borderRadius: 8 }} />
                    </div>
                )}
                <div
                    style={{ fontSize: 18, color: '#222', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
                {roleName === 'Staff' && (
                    <button
                        className={styles.editGuideButton}
                        onClick={() => setEditOpen(true)}
                    >
                        Chỉnh sửa bài viết
                    </button>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;
