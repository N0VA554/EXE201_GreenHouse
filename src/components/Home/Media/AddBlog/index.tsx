import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './AddBlog.module.css';

interface AddBlogProps {
  blogTypeId: string;
  onClose: () => void;
  onBlogAdded: () => void;
}

const AddBlog: React.FC<AddBlogProps> = ({ blogTypeId, onClose, onBlogAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    status: 'draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: crypto.randomUUID(),
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image',
      authorId: "11111111-1111-1111-1111-111111111111",
      blogTypeId,
      status: formData.status,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onBlogAdded();
        onClose();
      } else {
        console.error('Thêm blog thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi blog:', error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Thêm bài viết mới</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Nội dung</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              className={styles.quillEditor}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">URL hình ảnh</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="status">Trạng thái</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Hủy
            </button>
            <button type="submit" className={styles.submitButton}>
              Thêm 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
