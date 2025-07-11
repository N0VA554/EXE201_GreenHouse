import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DonateCampaign.module.css';

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  raisedAmount: number;
}

// Tạo axios instance có sẵn token
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
        <h3>{isEdit ? 'Chỉnh sửa chiến dịch' : 'Tạo chiến dịch mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tiêu đề</label>
            <input
              name="title"
              value={form.title || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>URL hình ảnh</label>
            <input
              name="imageUrl"
              value={form.imageUrl || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitButton}>
              {isEdit ? 'Lưu' : 'Tạo'}
            </button>
            {isEdit && onDelete && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={onDelete}
                style={{ marginLeft: 8 }}
              >
                Xóa
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
    try {
      await axiosInstance.post('/campaigns', data);
      setShowCreate(false);
      await fetchCampaigns();
    } catch {
      alert('Tạo chiến dịch thất bại');
    }
  };

  const handleEdit = async (data: Partial<Campaign>) => {
    try {
      await axiosInstance.post('/campaigns', { ...data, id: selected?.id });
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
          <img
            src="https://cdn-icons-png.flaticon.com/512/240/240437.png"
            alt="Expand Donation"
            className={styles.icon}
          />
        </button>
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Chọn chiến dịch quyên góp</h2>
            <button onClick={toggleCollapse} className={styles.closeButton}>
              <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={styles.campaignList}>
            {campaigns.map(c => (
              <button
                key={c.id}
                className={`${styles.campaignButton} ${selectedId === c.id ? styles.selected : ''}`}
                onClick={() => setSelectedId(c.id)}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className={styles.form}>
            <input
              type="number"
              placeholder="Nhập số tiền (vnđ)"
              className={styles.input}
              value={amount > 0 ? amount : ''}
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
            />
            <button
              onClick={() => alert('Cảm ơn bạn đã quyên góp!')}
              className={styles.donateButton}
              disabled={!selectedId || amount <= 0}
            >
              Quyên góp ngay
            </button>
          </div>

          {roleName === 'Staff' && (
            <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
              <button className={styles.createButton} onClick={() => setShowCreate(true)}>
                Tạo chiến dịch
              </button>
              <button
                className={styles.editButton}
                onClick={() => setShowEdit(true)}
                disabled={!selected}
              >
                Chỉnh sửa chiến dịch
              </button>
            </div>
          )}

          {selected && (
            <>
              <div className={styles.progress}>
                <p className={styles.progressText}>
                  Progress: ${selected.raisedAmount.toLocaleString()} / {selected.targetAmount.toLocaleString()}
                </p>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min(100, (selected.raisedAmount / selected.targetAmount) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className={styles.description}>{selected.description}</div>
              {selected.imageUrl && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <img src={selected.imageUrl} alt={selected.title} style={{ maxWidth: 200, borderRadius: 8 }} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DonateCampaign;
