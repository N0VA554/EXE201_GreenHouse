import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from '../../utils/auth';
import styles from './PostDetail.module.css';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  authorId: string;
  status: string;
  authorName: string;
  createdTime?: string;
}

interface EditForm {
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
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
    imageUrl: '',
    videoUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');

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
      imageUrl: post.imageUrl || '',
      videoUrl: post.videoUrl || ''
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
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
      if (videoFile) {
        formData.append('videoFile', videoFile);
      }

      console.log('Sending update formData:', {
        id: post?.id,
        title: editForm.title.trim(),
        content: editForm.content.trim(),
        authorId: userId,
        authorName: username,
        hasImage: !!imageFile,
        hasVideo: !!videoFile,
        imageName: imageFile?.name,
        videoName: videoFile?.name
      });

      // Log FormData contents for debugging
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
          timeout: 60000, // 60 seconds timeout
        }
      );

      console.log('Update response:', response.data);

      setIsEditing(false);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      setImageFile(null);
      setVideoFile(null);
      setImagePreview('');
      setVideoPreview('');
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
    setEditForm({ title: '', content: '', imageUrl: '', videoUrl: '' });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setImageFile(null);
    setVideoFile(null);
    setImagePreview('');
    setVideoPreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Kích thước file ảnh không được vượt quá 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('Kích thước file video không được vượt quá 50MB');
        return;
      }
      if (!file.type.startsWith('video/')) {
        alert('Vui lòng chọn file video hợp lệ');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview('');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
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
    <div className={styles.container}>
      {/* Header with back button and edit/delete actions */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/baiviet')}>
          ← Quay lại
        </button>
        {post.authorId === userId && (
          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={handleEdit}
            >
              ✏️ Sửa
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              🗑️ Xóa
            </button>
          </div>
        )}
      </div>

      {/* Post Content / Edit Form */}
      <div className={styles.postContainer}>
        {isEditing ? (
          <form onSubmit={handleSave} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Tiêu đề *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className={styles.input}
                required
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
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Hình ảnh (tùy chọn)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {imagePreview && (
                <div className={styles.filePreview}>
                  <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                  <div className={styles.imagePreviewInfo}>
                    <span>📷 Ảnh đã chọn: {imageFile?.name}</span>
                    <span className={styles.fileSize}>
                      ({(imageFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button type="button" onClick={removeImage} className={styles.removeButton}>
                    ✕ Xóa ảnh
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label>Video (tùy chọn)</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className={styles.fileInput}
              />
              {videoPreview && (
                <div className={styles.filePreview}>
                  <div className={styles.videoPreviewInfo}>
                    <span>📹 Video đã chọn: {videoFile?.name}</span>
                    <span className={styles.fileSize}>
                      ({(videoFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button type="button" onClick={removeVideo} className={styles.removeButton}>
                    ✕ Xóa video
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
                {submitting ? '🔄 Đang lưu thay đổi...' : 'Lưu thay đổi'}
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
        ) : (
          <>
            <div className={styles.postHeader}>
              <h1 className={styles.postTitle}>{post.title}</h1>
              <div className={styles.postMeta}>
                <span className={styles.postAuthor}>👤 {post.authorName}</span>
                {post.createdTime && (
                  <span className={styles.postDate}>
                    📅 {new Date(post.createdTime).toLocaleDateString('vi-VN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                )}
                <span className={styles.postStatus}>
                  {post.status === 'Published' ? '✅ Đã xuất bản' : '⏳ Chờ duyệt'}
                </span>
              </div>
            </div>

            {post.imageUrl && (
              <div className={styles.postImage}>
                <img src={post.imageUrl} alt={post.title} />
              </div>
            )}

            {post.videoUrl && (
              <div className={styles.postVideo}>
                <video controls className={styles.videoPlayer}>
                  <source src={post.videoUrl} />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              </div>
            )}

            <div className={styles.postContent}>
              <div
                className={styles.contentText}
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail; 