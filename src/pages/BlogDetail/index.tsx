import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MiniCarousel from '../../components/MiniCarousel';
import Breadcrumb from '../../components/Breadcrumb';
import styles from './BlogDetail.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { getAuthHeader } from '../../utils/auth'; 


interface BlogDetailData {
  id?: string;
  title: string;
  content: string;
  imageUrl: string;
  createdTime: string;
  author?: { fullName?: string };
}

interface Comment {
  id: string;
  blogId: string;
  userId: string;
  content: string;
  username: string;
  createdTime?: string;
}

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

  // Force update CSS after ReactQuill renders
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const quillContainers = document.querySelectorAll('.quillEditor .ql-container');
        const quillEditors = document.querySelectorAll('.quillEditor .ql-editor');
        
        quillContainers.forEach((container: any) => {
          container.style.minHeight = '200px';
          container.style.maxHeight = '400px';
          container.style.height = '400px';
          container.style.overflowY = 'auto';
        });
        
        quillEditors.forEach((editor: any) => {
          editor.style.minHeight = '200px';
          editor.style.maxHeight = '350px';
          editor.style.height = '350px';
          editor.style.overflowY = 'auto';
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open || !data) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/blogs`,
        {
          id: data.id,
          ...form,
        },
        {
          headers: getAuthHeader(),
        }
      );
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/blogs/${data.id}`, {
        headers: getAuthHeader(),
      });
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
            <div style={{ height: '400px' }}>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={value => setForm(f => ({ ...f, content: value }))}
                className={styles.quillEditor}
                style={{ height: '350px' }}
              />
            </div>
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const roleName = localStorage.getItem('roleName');
  const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;
  const username = localStorage.getItem('username') || JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Anonymous';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/blogs/${id}`,
          {
            headers: getAuthHeader(),
          }
        );
        setData(res.data.data);
      } catch (error) {
        console.error('Lỗi khi tải blog:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/comments/blog/${id}`,
          {
            headers: getAuthHeader(),
          }
        );
        setComments(res.data.data || []);
      } catch (error) {
        console.error('Lỗi khi tải bình luận:', error);
      }
    };

    fetchData();
    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }
    
    if (!userId) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        blogId: id,
        userId: userId,
        content: newComment.trim(),
        username: username
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        commentData,
        {
          headers: getAuthHeader(),
        }
      );

      setNewComment('');
      // Refresh comments
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/comments/blog/${id}`,
        {
          headers: getAuthHeader(),
        }
      );
      setComments(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editCommentContent.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/comments`,
        {
          id: commentId,
          content: editCommentContent.trim()
        },
        {
          headers: getAuthHeader(),
        }
      );

      // Refresh comments
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/comments/blog/${id}`,
        {
          headers: getAuthHeader(),
        }
      );
      setComments(res.data.data || []);
      setEditingComment(null);
      setEditCommentContent('');
    } catch (error) {
      console.error('Lỗi khi sửa bình luận:', error);
      alert('Không thể sửa bình luận. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    setSubmitting(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          headers: getAuthHeader(),
        }
      );

      // Refresh comments
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/comments/blog/${id}`,
        {
          headers: getAuthHeader(),
        }
      );
      setComments(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error);
      alert('Không thể xóa bình luận. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditCommentContent(comment.content);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent('');
  };

  if (!data) return <div>Đang tải...</div>;

  return (
    <>
      <EditBlogModal open={editOpen} onClose={() => setEditOpen(false)} data={data} />
      <div style={{ position: 'relative', paddingBottom: 70 }}>
        <MiniCarousel />
      </div>
      
      <div style={{ paddingTop: 0 }}>
        {/* Breadcrumb
        <Breadcrumb wasteName={data.title} /> */}
        
        {/* Header */}
        <div className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>{data.title}</h1>
          {data.author && (
            <p className={styles.blogAuthor}>Tác giả: {data.author.fullName}</p>
          )}
        </div>
        
        {/* Content Container */}
        <div className={styles.blogContainer}>
          {/* Image Section */}
          {data.imageUrl && (
            <div className={styles.imageSection}>
              <img 
                src={data.imageUrl} 
                alt={data.title} 
                className={styles.blogImage}
              />
            </div>
          )}
          
          {/* Content Section */}
          <div className={styles.contentSection}>
            <div
              className={styles.blogContent}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
        
        {/* Edit Button */}
        {roleName === 'Staff' && (
          <button
            className={styles.editGuideButton}
            onClick={() => setEditOpen(true)}
          >
            Chỉnh sửa bài viết
          </button>
        )}

        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>Bình luận ({comments.length})</h3>
          
          {/* Comment Form */}
          {userId ? (
            <form onSubmit={handleSubmitComment} className={styles.commentForm}>
              <div className={styles.commentFormHeader}>
                <span className={styles.commentUserInfo}>Bình luận với tư cách: {username}</span>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className={styles.commentInput}
                rows={3}
                disabled={submitting}
              />
              <button
                type="submit"
                className={styles.commentSubmitButton}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Vui lòng <a href="/dang-nhap" className={styles.loginLink}>đăng nhập</a> để bình luận</p>
            </div>
          )}

          {/* Comments List */}
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p className={styles.noComments}>
                {userId ? 'Chưa có bình luận nào. Hãy là người đầu tiên bình luận!' : 'Chưa có bình luận nào.'}
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.username}</span>
                    <div className={styles.commentHeaderRight}>
                      {comment.createdTime && (
                        <span className={styles.commentTime}>
                          {new Date(comment.createdTime).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                      {comment.userId === userId && (
                        <div className={styles.commentActions}>
                          <button
                            className={styles.commentActionButton}
                            onClick={() => startEditComment(comment)}
                            disabled={submitting}
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.commentActionButton}
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={submitting}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className={styles.commentEditForm}>
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className={styles.commentEditInput}
                        rows={3}
                        disabled={submitting}
                      />
                      <div className={styles.commentEditActions}>
                        <button
                          className={styles.commentEditSaveButton}
                          onClick={() => handleEditComment(comment.id)}
                          disabled={submitting || !editCommentContent.trim()}
                        >
                          {submitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                          className={styles.commentEditCancelButton}
                          onClick={cancelEditComment}
                          disabled={submitting}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.commentContent}>
                      {comment.content}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
