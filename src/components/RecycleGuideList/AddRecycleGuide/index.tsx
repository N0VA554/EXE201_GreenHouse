import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import styles from './AddRecycleGuide.module.css';

interface WasteType {
  id: string;
  typeName: string;
}

interface AddRecycleGuideProps {
  onClose: () => void;
  onGuideAdded: () => void;
}

const AddRecycleGuide: React.FC<AddRecycleGuideProps> = ({ onClose, onGuideAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    wasteId: '',
  });
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/wastetypes`)
      .then(res => {
        setWasteTypes(res.data.data);
        if (res.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            wasteId: res.data.data[0].id,
          }));
        }
      })
      .catch(err => {
        console.error('Lỗi khi lấy loại rác:', err);
        setWasteTypes([]);
      });
  }, []);

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
      videoUrl: formData.videoUrl,
      wasteId: formData.wasteId,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/recycleguides`, payload);
      if (response.status === 200 || response.status === 201) {
        onGuideAdded();
        onClose();
      } else {
        console.error('Thêm hướng dẫn tái chế thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi hướng dẫn tái chế:', error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Thêm Hướng Dẫn Tái Chế Mới</h2>
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
            <label htmlFor="imageUrl">URL Hình ảnh</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="videoUrl">URL Video</label>
            <input
              type="text"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="wasteId">Loại rác</label>
            <select
              id="wasteId"
              name="wasteId"
              value={formData.wasteId}
              onChange={handleChange}
              required
            >
              {wasteTypes.map(waste => (
                <option key={waste.id} value={waste.id}>
                  {waste.typeName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Hủy
            </button>
            <button type="submit" className={styles.submitButton}>
              Thêm Hướng Dẫn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecycleGuide;
