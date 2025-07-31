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
  // imageUrl: string;
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
  // videoUrl: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePostForm>({
    title: '',
    content: '',
    // imageUrl: '',
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
  // const [imageFile, setImageFile] = useState<File | null>(null);
  // const [videoFile, setVideoFile] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string>('');
  // const [videoPreview, setVideoPreview] = useState<string>('');

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
  const username = localStorage.getItem('username') || JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Anonymous';

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchKeyword, viewMode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/posts`;

      if (searchKeyword) {
        url = `${process.env.REACT_APP_API_URL}/posts/search?keyword=${encodeURIComponent(searchKeyword)}`;
      } else if (viewMode === 'my') {
        url = `${process.env.REACT_APP_API_URL}/posts/user/${userId}`;
      } else {
        url = `${process.env.REACT_APP_API_URL}/posts/paging?page=${currentPage}&pageSize=${pageSize}`;
      }

      const response = await axios.get(url, { headers: getAuthHeader() });

      if (searchKeyword || viewMode === 'my') {
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

      // // Append image file if selected
      // if (imageFile) {
      //   formData.append('imageFile', imageFile);
      //   console.log('Adding image file:', imageFile.name, 'Size:', imageFile.size, 'bytes');
      // }

      // // Append video file if selected
      // if (videoFile) {
      //   formData.append('videoFile', videoFile);
      //   console.log('Adding video file:', videoFile.name, 'Size:', videoFile.size, 'bytes');
      // }

      if (file) {
        formData.append('file', file)
      }

      // Log FormData contents for debugging
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
          timeout: 120000, // 2 minutes timeout for file uploads
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
        }
      );

      console.log('Post created successfully:', response.data);

      // Reset form and close modal
      setCreateForm({ title: '', content: '', fileUrl: '' });

      // Clean up preview URLs
      // if (imagePreview) {
      //   URL.revokeObjectURL(imagePreview);
      // }
      // if (videoPreview) {
      //   URL.revokeObjectURL(videoPreview);
      // }
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      // Reset file states
      // setImageFile(null);
      // setVideoFile(null);
      setFile(null);
      // setImagePreview('');
      // setVideoPreview('');
      setFilePreview('');
      setShowCreateForm(false);

      // Refresh posts list
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

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Validate file type
  //     if (!file.type.startsWith('image/')) {
  //       alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, etc.)');
  //       return;
  //     }

  //     // Validate file size (5MB limit)
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert('Kích thước file ảnh không được vượt quá 5MB');
  //       return;
  //     }

  //     // Remove previous image if exists
  //     if (imagePreview) {
  //       URL.revokeObjectURL(imagePreview);
  //     }

  //     setImageFile(file);
  //     setImagePreview(URL.createObjectURL(file));
  //     console.log('Image selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  //   }
  // };

  // const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Validate file type
  //     if (!file.type.startsWith('video/')) {
  //       alert('Vui lòng chọn file video hợp lệ (MP4, AVI, MOV, etc.)');
  //       return;
  //     }

  //     // Validate file size (50MB limit)
  //     if (file.size > 50 * 1024 * 1024) {
  //       alert('Kích thước file video không được vượt quá 50MB');
  //       return;
  //     }

  //     // Remove previous video if exists
  //     if (videoPreview) {
  //       URL.revokeObjectURL(videoPreview);
  //     }

  //     setVideoFile(file);
  //     setVideoPreview(URL.createObjectURL(file));
  //     console.log('Video selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  //   }
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Vui lòng chọn file hợp lệ (JPG, PNG, GIF, MP4, MOV, etc.)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.type.startsWith('video/')) {
        if (file.size > 100 * 1024 * 1024) {
          alert('Kích thước file ảnh không được vượt quá 100MB');
          return;
        }
      } else if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Kích thước file ảnh không được vượt quá 5MB');
          return;
        }
      }

      // Remove previous image if exists
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      setFile(file);
      setFilePreview(URL.createObjectURL(file));
      console.log('Image selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    }
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview('');
  };

  // const removeImage = () => {
  //   if (imagePreview) {
  //     URL.revokeObjectURL(imagePreview);
  //   }
  //   setImageFile(null);
  //   setImagePreview('');
  // };

  // const removeVideo = () => {
  //   if (videoPreview) {
  //     URL.revokeObjectURL(videoPreview);
  //   }
  //   setVideoFile(null);
  //   setVideoPreview('');
  // };

  const isVideo = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      const pathWithoutQuery = decoded.split('?')[0]; // bỏ phần ?token
      return /\.(mp4|webm|ogg)$/i.test(pathWithoutQuery);
    } catch {
      return false;
    }
  };

  const isImage = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      const pathWithoutQuery = decoded.split('?')[0]; // bỏ phần ?token
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
        {/* Header */}
        {/* <div className={styles.header}>
        <h1 className={styles.title}>📰 Bài viết cộng đồng</h1>
        <p className={styles.subtitle}>
          Chia sẻ kiến thức, kinh nghiệm và ý tưởng về môi trường
        </p>
      </div> */}

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

        {/* Create Post Modal */}
        {showCreateForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Tạo bài viết mới</h2>
              <form onSubmit={handleCreatePost}>
                <div className={styles.formGroup}>
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className={styles.input}
                    required
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
                        <span>📷 file đã chọn: {file?.name}</span>
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

                {/* <div className={styles.formGroup}>
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
                          ({((imageFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
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
                          ({((videoFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button type="button" onClick={removeVideo} className={styles.removeButton}>
                        ✕ Xóa video
                      </button>
                    </div>
                  )}
                </div> */}

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

        {/* Posts List */}
        <div className={styles.postsContainer}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Đang tải bài viết...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Chưa có bài viết nào.</p>
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
                        style={{ cursor: 'pointer' }}
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
                        <span className={styles.postStatus}>
                          {post.status === 'Published' ? '✅ Đã xuất bản' : '⏳ Chờ duyệt'}
                        </span>
                      </div>
                      <div className={styles.postActions}>
                        {post.authorId === userId && (
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
              {!searchKeyword && viewMode === 'all' && totalPages > 1 && (
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
    </>
  );
};

export default Posts; 