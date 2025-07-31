import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from '../../utils/auth';
import styles from './Posts.module.css';
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

interface CreatePostForm {
  title: string;
  content: string;
  fileUrl: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePostForm>({
    title: '',
    content: '',
    fileUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
  const username = localStorage.getItem('username') || JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Anonymous';

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchKeyword, viewMode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/posts/status`;

      if (searchKeyword) {
        url = `${process.env.REACT_APP_API_URL}/posts/search?keyword=${encodeURIComponent(searchKeyword)}`;
      } else if (viewMode === 'my') {
        url = `${process.env.REACT_APP_API_URL}/posts/user/${userId}?pageNumber=${currentPage}&pageSize=${pageSize}`;
      } else {
        url = `${process.env.REACT_APP_API_URL}/posts/status?pageNumber=${currentPage}&pageSize=${pageSize}`;
      }

      const response = await axios.get(url, { headers: getAuthHeader() });

      if (searchKeyword) {
        setPosts(response.data.data || []);
        setTotalPages(1);
      } else {
        setPosts(response.data.data?.items || response.data.data || []);
        setTotalPages(response.data.data?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', createForm.title.trim());
      formData.append('content', createForm.content.trim());
      formData.append('authorId', userId);
      formData.append('authorName', username);

      if (file) {
        formData.append('file', file)
      }

      console.log('FormData contents:');
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
        }
      );

      console.log('Post created successfully:', response.data);

      setCreateForm({ title: '', content: '', fileUrl: '' });

      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      setFile(null);
      setFilePreview('');
      setShowCreateForm(false);

      fetchPosts();

      alert('Bài viết đã được tạo thành công!');
    } catch (error: any) {
      console.error('Error creating post:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Lỗi: ${error.response.data.message || 'Không thể tạo bài viết'}`);
      } else if (error.code === 'ECONNABORTED') {
        alert('Yêu cầu bị timeout. Vui lòng thử lại với file nhỏ hơn.');
      } else {
        alert('Không thể tạo bài viết. Vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        headers: getAuthHeader(),
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Không thể xóa bài viết. Vui lòng thử lại.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setViewMode('all');
    fetchPosts();
  };

  const handleViewModeChange = (mode: 'all' | 'my') => {
    setViewMode(mode);
    setCurrentPage(1);
    setSearchKeyword('');
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Vui lòng đăng nhập</h2>
          <p>Bạn cần đăng nhập để xem và tạo bài viết.</p>
          <button
            className={styles.loginButton}
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MiniCarousel />
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bài Viết Cộng Đồng</h2>
            <p className={styles.sectionSubtitle}>
              Chia sẻ kiến thức, kinh nghiệm và ý tưởng về môi trường
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className={styles.viewModeTabs}>
            <button
              className={`${styles.tabButton} ${viewMode === 'all' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('all')}
            >
              📰 Tất cả bài viết
            </button>
            <button
              className={`${styles.tabButton} ${viewMode === 'my' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('my')}
            >
              👤 Bài viết của tôi
            </button>
          </div>

          {/* Search and Create */}
          <div className={styles.actions}>
            {viewMode === 'all' && (
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  🔍 Tìm kiếm
                </button>
              </form>
            )}
            <button className={styles.createButton} onClick={() => setShowCreateForm(true)}>
              ✏️ Tạo bài viết mới
            </button>
          </div>

          {/* Posts List */}
          <div className={styles.postsContainer}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Đang tải bài viết...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <h3>Chưa có bài viết nào</h3>
                <p>{searchKeyword ? 'Không tìm thấy bài viết phù hợp.' : 'Hãy tạo bài viết đầu tiên để chia sẻ kiến thức!'}</p>
                {!searchKeyword && (
                  <button
                    className={styles.createFirstButton}
                    onClick={() => setShowCreateForm(true)}
                  >
                    Tạo bài viết đầu tiên
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={styles.postsList}>
                  {posts.map((post) => (
                    <div key={post.id} className={styles.postCard}>
                      {post.fileUrl && isImage(post.fileUrl) && (
                        <div className={styles.postImage}>
                          <img src={post.fileUrl} alt={post.title} />
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

                      <div className={styles.postContent}>
                        <h3
                          className={styles.postTitle}
                          onClick={() => navigate(`/posts/${post.id}`)}
                        >
                          {post.title}
                        </h3>
                        <p className={styles.postExcerpt}>
                          {post.content.length > 200
                            ? `${post.content.substring(0, 200)}...`
                            : post.content}
                        </p>
                        <div className={styles.postMeta}>
                          <span className={styles.postAuthor}>👤 {post.authorName}</span>
                          {post.createdTime && (
                            <span className={styles.postDate}>
                              📅 {new Date(post.createdTime).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                          {viewMode === 'my' && (
                            <span className={styles.postStatus}>
                              {post.status === 'Approved' ? '✅ Đã duyệt' : 
                               post.status === 'Pending' ? '⏳ Chờ duyệt' : 
                               post.status === 'Rejected' ? '❌ Bị từ chối' : 
                               '❓ Không xác định'}
                            </span>
                          )}
                        </div>
                        <div className={styles.postActions}>
                          {viewMode === 'my' && post.authorId === userId && (
                            <>
                              <button
                                className={styles.editButton}
                                onClick={() => navigate(`/posts/${post.id}`)}
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDeletePost(post.id)}
                              >
                                🗑️ Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {!searchKeyword && totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageButton}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Trước
                    </button>
                    <span className={styles.pageInfo}>
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      className={styles.pageButton}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreateForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Tạo bài viết mới</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowCreateForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreatePost} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className={styles.input}
                    required
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nội dung *</label>
                  <textarea
                    value={createForm.content}
                    onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                    className={styles.textarea}
                    rows={8}
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

                <div className={styles.modalActions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting}
                  >
                    {submitting ? '🔄 Đang tạo bài viết...' : 'Tạo bài viết'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowCreateForm(false)}
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Posts; 