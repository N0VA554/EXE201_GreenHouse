import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from '../../utils/auth';
import styles from './PostDetail.module.css';
import MiniCarousel from '../../components/MiniCarousel';

interface Post {
  id: string;
  title: string;
  content: string;
  fileUrl: string;
  authorId: string;
  status: string;
  authorName: string;
  createdTime?: string;
}

interface EditForm {
  title: string;
  content: string;
  fileUrl: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: '',
    content: '',
    fileUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
  const username = localStorage.getItem('username') || JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Anonymous';

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
        headers: getAuthHeader(),
      });
      setPost(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!post) return;

    setEditForm({
      title: post.title,
      content: post.content,
      fileUrl: post.fileUrl || ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('id', post?.id || '');
      formData.append('title', editForm.title.trim());
      formData.append('content', editForm.content.trim());
      formData.append('authorId', userId);
      formData.append('authorName', username);

      if (file) {
        formData.append('file', file);
      }

      formData.forEach((value, key) => {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      });

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/posts`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );

      console.log('Update response:', response.data);

      setIsEditing(false);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFile(null);
      setFilePreview('');
      fetchPost();
    } catch (error: any) {
      console.error('Error updating post:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Lỗi: ${error.response.data.message || 'Không thể cập nhật bài viết'}`);
      } else {
        alert('Không thể cập nhật bài viết. Vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${post.id}`, {
        headers: getAuthHeader(),
      });
      navigate('/baiviet');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Không thể xóa bài viết. Vui lòng thử lại.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ title: '', content: '', fileUrl: '' });
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Vui lòng chọn file hợp lệ (JPG, PNG, GIF, MP4, MOV, etc.)');
        return;
      }

      if (file.type.startsWith('video/')) {
        if (file.size > 100 * 1024 * 1024) {
          alert('Kích thước file video không được vượt quá 100MB');
          return;
        }
      } else if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Kích thước file ảnh không được vượt quá 5MB');
          return;
        }
      }

      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      setFile(file);
      setFilePreview(URL.createObjectURL(file));
      console.log('File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    }
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview('');
  };

  const isVideo = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      const pathWithoutQuery = decoded.split('?')[0];
      return /\.(mp4|webm|ogg)$/i.test(pathWithoutQuery);
    } catch {
      return false;
    }
  };

  const isImage = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      const pathWithoutQuery = decoded.split('?')[0];
      return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(pathWithoutQuery);
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>❌</div>
          <h2>Không tìm thấy bài viết</h2>
          <p>{error || 'Bài viết không tồn tại hoặc đã bị xóa.'}</p>
          <button className={styles.backButton} onClick={() => navigate('/baiviet')}>
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MiniCarousel />
      <div className={styles.mainContent}>
        {/* Header with back button and edit/delete actions */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate('/baiviet')}>
            ← Quay lại danh sách bài viết
          </button>
          {post.authorId === userId && (
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={handleEdit}
              >
                ✏️ Chỉnh sửa
              </button>
              <button
                className={styles.deleteButton}
                onClick={handleDelete}
              >
                🗑️ Xóa bài viết
              </button>
            </div>
          )}
        </div>

        {/* Post Content / Edit Form */}
        <div className={styles.postContainer}>
          {isEditing ? (
            <div className={styles.editFormContainer}>
              <div className={styles.editFormHeader}>
                <h2>✏️ Chỉnh sửa bài viết</h2>
                <p>Cập nhật thông tin bài viết của bạn</p>
              </div>
              <form onSubmit={handleSave} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={styles.input}
                    required
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nội dung *</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className={styles.textarea}
                    rows={12}
                    required
                    placeholder="Nhập nội dung bài viết..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>File (tùy chọn)</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  {filePreview && (
                    <div className={styles.filePreview}>
                      <img src={filePreview} alt="Preview" className={styles.previewImage} />
                      <div className={styles.imagePreviewInfo}>
                        <span>📷 File đã chọn: {file?.name}</span>
                        <span className={styles.fileSize}>
                          ({((file?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button type="button" onClick={removeFile} className={styles.removeButton}>
                        ✕ Xóa file
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={submitting}
                  >
                    {submitting ? '🔄 Đang lưu thay đổi...' : '💾 Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.postContent}>
              {/* Post Header */}
              <div className={styles.postHeader}>
                <div className={styles.postMeta}>
                  <span className={styles.postCategory}>📰 Bài Viết Cộng Đồng</span>
                  {post.createdTime && (
                    <span className={styles.postDate}>
                      📅 {new Date(post.createdTime).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                <h1 className={styles.postTitle}>{post.title}</h1>
                <div className={styles.postAuthor}>
                  <div className={styles.authorAvatar}>
                    <span>👤</span>
                  </div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{post.authorName}</span>
                    <span className={styles.authorRole}>Tác giả</span>
                  </div>
                  {post.authorId === userId && (
                    <div className={styles.postStatus}>
                      {post.status === 'Approved' ? '✅ Đã duyệt' : 
                       post.status === 'Pending' ? '⏳ Chờ duyệt' : 
                       post.status === 'Rejected' ? '❌ Bị từ chối' : 
                       '❓ Không xác định'}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Media */}
              {post.fileUrl && isImage(post.fileUrl) && (
                <div className={styles.postImage}>
                  <div className={styles.imageWrapper}>
                    <img src={post.fileUrl} alt={post.title} />
                    <div className={styles.imageOverlay}></div>
                  </div>
                </div>
              )}

              {post.fileUrl && isVideo(post.fileUrl) && (
                <div className={styles.postVideo}>
                  <video controls className={styles.videoPlayer}>
                    <source src={post.fileUrl} />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
              )}

              {/* Post Content */}
              <div className={styles.contentSection}>
                <div
                  className={styles.contentText}
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetail; 