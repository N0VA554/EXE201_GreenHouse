import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DonateCampaign.module.css';

interface Campaign {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  raisedAmount: number;
  campaignTypeId: string;
  status: string;
  userId: string;
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

const CampaignModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Campaign>) => void;
  initial?: Partial<Campaign>;
  isEdit?: boolean;
  onDelete?: () => void;
}> = ({ open, onClose, onSubmit, initial, isEdit, onDelete }) => {
  const [form, setForm] = useState<Partial<Campaign>>(initial || {});

  useEffect(() => {
    setForm(initial || {});
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{isEdit ? '✏️ Chỉnh sửa chiến dịch' : '➕ Tạo chiến dịch mới'}</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Tiêu đề *</label>
            <input
              type='text'
              placeholder='Nhập tiêu đề chiến dịch...'
              name="title"
              value={form.title || ''}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mục tiêu (VNĐ) *</label>
            <input
              type='number'
              placeholder='Nhập số tiền mục tiêu...'
              name="targetAmount"
              value={form.targetAmount || ''}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label>Ngày bắt đầu *</label>
              <input
                type='date'
                name="startDate"
                value={form.startDate || ''}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Ngày kết thúc *</label>
              <input
                type='date'
                name="endDate"
                value={form.endDate || ''}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Mô tả *</label>
            <textarea
              placeholder='Nhập mô tả chiến dịch...'
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              required
              className={styles.textarea}
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label>URL hình ảnh *</label>
            <input
              type='text'
              placeholder='Nhập URL hình ảnh...'
              name="imageUrl"
              value={form.imageUrl || ''}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitButton}>
              {isEdit ? '💾 Lưu thay đổi' : '➕ Tạo chiến dịch'}
            </button>
            {isEdit && onDelete && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={onDelete}
              >
                🗑️ Xóa chiến dịch
              </button>
            )}
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DonateCampaign: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get('/campaigns');
      setCampaigns(res.data.data || []);
      if (res.data.data && res.data.data.length > 0) {
        setSelectedId(res.data.data[0].id);
      }
    } catch (err) {
      alert('Không thể tải chiến dịch');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const selected = campaigns.find(c => c.id === selectedId);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleCreate = async (data: Partial<Campaign>) => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson || '{}');
    const userId = user.id;
    const payload = { ...data, userId };
    try {
      await axiosInstance.post('/campaigns', payload);
      setShowCreate(false);
      await fetchCampaigns();
    } catch {
      alert('Tạo chiến dịch thất bại');
    }
  };

  const handleEdit = async (data: Partial<Campaign>) => {
    try {
      await axiosInstance.put('/campaigns', { ...data, id: selected?.id });
      setShowEdit(false);
      await fetchCampaigns();
    } catch {
      alert('Chỉnh sửa thất bại');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm('Bạn có chắc muốn xóa chiến dịch này?')) return;
    try {
      await axiosInstance.delete(`/campaigns/${selected.id}`);
      setShowEdit(false);
      await fetchCampaigns();
      setSelectedId('');
    } catch {
      alert('Xóa thất bại');
    }
  };

  const handleDonate = async () => {
    if (!selected) return;
    try {
      const userJson = localStorage.getItem('user');
      const user = JSON.parse(userJson || '{}');
      const userId = user.id;

      const request = {
        "amount": amount,
        "description": description,
        "userId": userId,
        "transactionTypeId": "11111111-0000-0000-0000-00000002",
        "campaignId": selectedId
      }
      var response = await axiosInstance.post(`momo/create-payment`, JSON.stringify(request), { headers: { "Content-Type": "application/json" } })
      if (response.status == 200) {
        window.location.href = response.data.redirectUrl
      }
    } catch (error) {
      console.error(error)
    }
  }

  const roleName = localStorage.getItem('roleName');
  
  return (
    <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
      <CampaignModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
      <CampaignModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleEdit}
        initial={selected}
        isEdit
        onDelete={handleDelete}
      />

      {isCollapsed ? (
        <button onClick={toggleCollapse} className={styles.iconButton}>
          <div className={styles.iconWrapper}>
            <span className={styles.iconText}>💝</span>
          </div>
        </button>
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>💝 Chiến Dịch Quyên Góp</h2>
              <p className={styles.subtitle}>Hãy chung tay ủng hộ các chiến dịch ý nghĩa</p>
            </div>
            <button onClick={toggleCollapse} className={styles.closeButton}>
              <span>×</span>
            </button>
          </div>

          <div className={styles.campaignSection}>
            <h3 className={styles.sectionTitle}>📋 Chọn chiến dịch</h3>
            <div className={styles.campaignList}>
              {campaigns.map(c => (
                <button
                  key={c.id}
                  className={`${styles.campaignButton} ${selectedId === c.id ? styles.selected : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <span className={styles.campaignTitle}>{c.title}</span>
                  <span className={styles.campaignDate}>
                    {new Date(c.startDate).toLocaleDateString('vi-VN')} - {new Date(c.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.donateSection}>
            <h3 className={styles.sectionTitle}>💳 Thông tin quyên góp</h3>
            <div className={styles.donateForm}>
              <div className={styles.formGroup}>
                <label>Mô tả quyên góp</label>
                <input
                  type="text"
                  placeholder="Nhập mô tả quyên góp của bạn..."
                  className={styles.input}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số tiền (VNĐ)</label>
                <input
                  type="number"
                  placeholder="Nhập số tiền quyên góp..."
                  className={styles.input}
                  value={amount > 0 ? amount : ''}
                  onChange={e => setAmount(Number(e.target.value))}
                  min={1}
                />
              </div>
              <button
                onClick={() => handleDonate()}
                className={styles.donateButton}
                disabled={!selectedId || amount <= 0}
              >
                💝 Quyên góp ngay
              </button>
            </div>
          </div>

          {roleName === 'Staff' && (
            <div className={styles.staffSection}>
              <h3 className={styles.sectionTitle}>⚙️ Quản lý chiến dịch</h3>
              <div className={styles.staffActions}>
                <button className={styles.createButton} onClick={() => setShowCreate(true)}>
                  ➕ Tạo chiến dịch mới
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => setShowEdit(true)}
                  disabled={!selected}
                >
                  ✏️ Chỉnh sửa chiến dịch
                </button>
              </div>
            </div>
          )}

          {selected && (
            <div className={styles.campaignDetails}>
              <h3 className={styles.sectionTitle}>📊 Thông tin chiến dịch</h3>
              <div className={styles.campaignCard}>
                <div className={styles.campaignHeader}>
                  <h4 className={styles.campaignName}>{selected.title}</h4>
                  <div className={styles.campaignDates}>
                    <span>📅 {new Date(selected.startDate).toLocaleDateString('vi-VN')} - {new Date(selected.endDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                
                <div className={styles.progressSection}>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressText}>
                      Đã quyên góp: {selected.raisedAmount.toLocaleString()} VNĐ
                    </span>
                    <span className={styles.targetText}>
                      Mục tiêu: {selected.targetAmount.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(100, (selected.raisedAmount / selected.targetAmount) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {Math.round((selected.raisedAmount / selected.targetAmount) * 100)}%
                  </div>
                </div>
                
                <div className={styles.campaignDescription}>
                  <p>{selected.description}</p>
                </div>
                
                {selected.imageUrl && (
                  <div className={styles.campaignImage}>
                    <img src={selected.imageUrl} alt={selected.title} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonateCampaign;
