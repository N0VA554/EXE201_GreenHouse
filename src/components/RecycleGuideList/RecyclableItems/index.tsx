import React, { useEffect, useState } from 'react';
import styles from './RecyclableItems.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddRecycleGuide from '../AddRecycleGuide';

const API_URL = process.env.REACT_APP_API_URL;

interface GuideItem {
  id: string;
  image: string;
  name: string;
}

interface WasteType {
  id: string;
  typeName: string;
  description: string;
  iconUrl: string;
}

const RecyclableItems: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<GuideItem[]>([]);
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [selectedWasteTypeId, setSelectedWasteTypeId] = useState<string | null>(null);
  const [showAddGuide, setShowAddGuide] = useState(false);
  const [showAddWasteType, setShowAddWasteType] = useState(false);
  const [showEditWasteType, setShowEditWasteType] = useState(false);
  const [wasteTypeForm, setWasteTypeForm] = useState({
    id: '',
    typeName: '',
    description: '',
    iconUrl: ''
  });
  const roleName = localStorage.getItem('roleName');
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    axios.get(`${API_URL}/wastetypes`, { headers: getAuthHeaders() })
      .then(res => {
        const types = res.data.data.map((type: any) => ({
          id: type.id,
          typeName: type.typeName,
          description: type.description,
          iconUrl: type.iconUrl
        }));
        setWasteTypes(types);
        if (types.length > 0 && !selectedWasteTypeId) {
          setSelectedWasteTypeId(types[0].id);
        }
      })
      .catch(err => {
        setWasteTypes([]);
        console.error('Error fetching waste types:', err);
      });
  }, [showAddWasteType, showEditWasteType]);

  useEffect(() => {
    if (selectedWasteTypeId) {
      axios.get(`${API_URL}/wastes/getwastesbywastestypeid/${selectedWasteTypeId}`, { headers: getAuthHeaders() })
        .then(res => {
          const guides = res.data.data.map((item: any) => ({
            id: item.id,
            image: item.imageUrl,
            name: item.name
          }));
          setItems(guides);
        })
        .catch(err => {
          setItems([]);
          console.error('Error fetching recycle guides:', err);
        });
    }
  }, [selectedWasteTypeId, showAddGuide]);

  const handleItemClick = (id: string) => {
    navigate(`/danhsachphanloai/${id}`);
  };

  const handleWasteTypeClick = (id: string) => {
    setSelectedWasteTypeId(id);
  };

  const handleGuideAdded = () => {
    setShowAddGuide(false);
  };

  const handleAddWasteTypeClick = () => {
    setWasteTypeForm({ id: '', typeName: '', description: '', iconUrl: '' });
    setShowAddWasteType(true);
  };

  const handleEditWasteTypeClick = () => {
    const selectedType = wasteTypes.find(type => type.id === selectedWasteTypeId);
    if (selectedType) {
      setWasteTypeForm(selectedType);
      setShowEditWasteType(true);
    }
  };

  const handleWasteTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (showAddWasteType) {
      const newWasteType = {
        ...wasteTypeForm,
        id: crypto.randomUUID()
      };

      axios.post(`${API_URL}/wastetypes`, newWasteType, { headers: getAuthHeaders() })
        .then(() => {
          setShowAddWasteType(false);
          setWasteTypeForm({ id: '', typeName: '', description: '', iconUrl: '' });
        })
        .catch(err => console.error('Error adding waste type:', err));
    } else if (showEditWasteType) {
      axios.put(`${API_URL}/wastetypes`, wasteTypeForm, { headers: getAuthHeaders() })
        .then(() => {
          setShowEditWasteType(false);
          setWasteTypeForm({ id: '', typeName: '', description: '', iconUrl: '' });
        })
        .catch(err => console.error('Error updating waste type:', err));
    }
  };

  const handleDeleteWasteType = () => {
    if (!wasteTypeForm.id) return;

    if (!window.confirm('Bạn có chắc chắn muốn xóa loại rác thải này?')) return;

    axios.delete(`${API_URL}/wastetypes/${wasteTypeForm.id}`, { headers: getAuthHeaders() })
      .then(() => {
        setShowEditWasteType(false);
        setWasteTypeForm({ id: '', typeName: '', description: '', iconUrl: '' });

        // Nếu loại rác bị xóa đang được chọn, đặt lại selected
        if (selectedWasteTypeId === wasteTypeForm.id) {
          setSelectedWasteTypeId(null);
        }
      })
      .catch(err => console.error('Error deleting waste type:', err));
  };

  return (
    <div className={styles.recyclableItemsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>NHỮNG GÌ CÓ THỂ ĐƯỢC TÁI CHẾ?</h2>
        {roleName === 'Staff' && (
        <div className={styles.buttonGroup}>
          
          <button
            className={styles.addGuideButton}
            onClick={() => setShowAddGuide(true)}
          >
            Thêm hướng dẫn tái chế
          </button>
          <button
            className={styles.addWasteTypeButton}
            onClick={handleAddWasteTypeClick}
          >
            Thêm loại rác thải
          </button>
          <button
            className={styles.editWasteTypeButton}
            onClick={handleEditWasteTypeClick}
            disabled={!selectedWasteTypeId}
          >
            Chỉnh sửa loại rác thải
          </button>
        </div>
        )}
      </div>
      <p className={styles.subtitle}>
        Theo hướng dẫn trong sạch mà GREENHOME chúng tôi cung cấp :
      </p>
      <div className={styles.wasteTypesBar}>
        {wasteTypes.map((type) => (
          <div
            key={type.id}
            className={`${styles.wasteTypeItem} ${selectedWasteTypeId === type.id ? styles.active : ''}`}
            onClick={() => handleWasteTypeClick(type.id)}
          >
            <img src={type.iconUrl} alt={type.typeName} className={styles.wasteTypeIcon} />
            <span>{type.typeName}</span>
          </div>
        ))}
      </div>
      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.item}
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
            </div>
            <p className={styles.itemLabel}>{item.name}</p>
          </div>
        ))}
      </div>
      {showAddGuide && (
        <AddRecycleGuide
          onClose={() => setShowAddGuide(false)}
          onGuideAdded={handleGuideAdded}
        />
      )}
      {(showAddWasteType || showEditWasteType) && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{showAddWasteType ? 'Thêm loại rác thải' : 'Chỉnh sửa loại rác thải'}</h3>
            <form onSubmit={handleWasteTypeSubmit}>
              <div className={styles.formGroup}>
                <label>Tên loại rác thải</label>
                <input
                  type="text"
                  value={wasteTypeForm.typeName}
                  onChange={(e) => setWasteTypeForm({ ...wasteTypeForm, typeName: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả</label>
                <textarea
                  value={wasteTypeForm.description}
                  onChange={(e) => setWasteTypeForm({ ...wasteTypeForm, description: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL biểu tượng</label>
                <input
                  type="text"
                  value={wasteTypeForm.iconUrl}
                  onChange={(e) => setWasteTypeForm({ ...wasteTypeForm, iconUrl: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  {showAddWasteType ? 'Thêm' : 'Cập nhật'}
                </button>
                {showEditWasteType && (
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={handleDeleteWasteType}
                  >
                    Xóa
                  </button>
                )}
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAddWasteType(false);
                    setShowEditWasteType(false);
                    setWasteTypeForm({ id: '', typeName: '', description: '', iconUrl: '' });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclableItems;
