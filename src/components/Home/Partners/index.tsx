import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Partners.module.css';

interface Brand {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

const Partners: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBrand, setNewBrand] = useState<Brand>({
        id: '',
        name: '',
        description: '',
        logoUrl: '',
        websiteUrl: '',
    });

    const fetchBrands = () => {
        axios.get(`${API_URL}/brands`)
            .then(res => setBrands(res.data.data))
            .catch(() => setBrands([]));
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa đối tác này?')) return;
        await axios.delete(`${API_URL}/brands/${id}`, getAuthHeader());
        fetchBrands();
    };

    const handleEdit = (brand: Brand) => {
        setEditingId(brand.id);
        setEditBrand({ ...brand });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editBrand) return;
        setEditBrand({ ...editBrand, [e.target.name]: e.target.value });
    };

    const handleEditSave = async () => {
        if (!editBrand) return;
        await axios.put(`${API_URL}/brands/`, editBrand, getAuthHeader());
        setEditingId(null);
        setEditBrand(null);
        fetchBrands();
    };

    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewBrand({ ...newBrand, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        if (!newBrand.id || !newBrand.name) return;
        await axios.post(`${API_URL}/brands`, newBrand, getAuthHeader());
        setNewBrand({ id: '', name: '', description: '', logoUrl: '', websiteUrl: '' });
        setShowAddModal(false);
        fetchBrands();
    };

    const roleName = localStorage.getItem('roleName') || '';
    
    return (
        <div className={styles.mainContent}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🤝 Thành Viên & Đối Tác</h2>
                <p className={styles.sectionSubtitle}>
                    Những đối tác tin cậy đồng hành cùng chúng tôi trong hành trình bảo vệ môi trường
                </p>
            </div>

            {roleName === 'Staff' && (
                <div className={styles.staffSection}>
                    <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
                        ➕ Thêm đối tác mới
                    </button>
                </div>
            )}

            <div className={styles.partnersGrid}>
                {brands.map(brand =>
                    editingId === brand.id && editBrand ? (
                        <div key={brand.id} className={styles.partnerCard}>
                            <div className={styles.editForm}>
                                <div className={styles.formGroup}>
                                    <label>ID *</label>
                                    <input
                                        className={styles.input}
                                        name="id"
                                        value={editBrand.id}
                                        onChange={handleEditChange}
                                        placeholder="Nhập ID..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tên đối tác *</label>
                                    <input
                                        className={styles.input}
                                        name="name"
                                        value={editBrand.name}
                                        onChange={handleEditChange}
                                        placeholder="Nhập tên đối tác..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Logo URL *</label>
                                    <input
                                        className={styles.input}
                                        name="logoUrl"
                                        value={editBrand.logoUrl}
                                        onChange={handleEditChange}
                                        placeholder="Nhập URL logo..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Website URL</label>
                                    <input
                                        className={styles.input}
                                        name="websiteUrl"
                                        value={editBrand.websiteUrl}
                                        onChange={handleEditChange}
                                        placeholder="Nhập URL website..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Mô tả</label>
                                    <textarea
                                        className={styles.textarea}
                                        name="description"
                                        value={editBrand.description}
                                        onChange={handleEditChange}
                                        placeholder="Nhập mô tả..."
                                        rows={3}
                                    />
                                </div>
                                {roleName === 'Staff' && (
                                    <div className={styles.editActions}>
                                        <button className={styles.saveButton} onClick={handleEditSave}>
                                            💾 Lưu thay đổi
                                        </button>
                                        <button className={styles.cancelButton} onClick={() => setEditingId(null)}>
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div key={brand.id} className={styles.partnerCard}>
                            <a
                                href={brand.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.partnerLink}
                            >
                                <div className={styles.logoWrapper}>
                                    <img src={brand.logoUrl} alt={brand.name} className={styles.logo} />
                                </div>
                                <div className={styles.partnerInfo}>
                                    <h3 className={styles.partnerName}>{brand.name}</h3>
                                    <p className={styles.partnerDescription}>{brand.description}</p>
                                </div>
                            </a>
                            {roleName === 'Staff' && (
                                <div className={styles.partnerActions}>
                                    <button className={styles.editButton} onClick={() => handleEdit(brand)}>
                                        ✏️ Chỉnh sửa
                                    </button>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(brand.id)}>
                                        🗑️ Xóa
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {brands.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🤝</div>
                    <h3>Chưa có đối tác nào</h3>
                    <p>Hãy thêm đối tác đầu tiên để bắt đầu hợp tác!</p>
                    {roleName === 'Staff' && (
                        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
                            ➕ Thêm đối tác đầu tiên
                        </button>
                    )}
                </div>
            )}

            {showAddModal && roleName === 'Staff' && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>➕ Thêm đối tác mới</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowAddModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>ID *</label>
                                <input
                                    className={styles.input}
                                    name="id"
                                    placeholder="Nhập ID đối tác..."
                                    value={newBrand.id}
                                    onChange={handleAddChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tên đối tác *</label>
                                <input
                                    className={styles.input}
                                    name="name"
                                    placeholder="Nhập tên đối tác..."
                                    value={newBrand.name}
                                    onChange={handleAddChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Logo URL *</label>
                                <input
                                    className={styles.input}
                                    name="logoUrl"
                                    placeholder="Nhập URL logo..."
                                    value={newBrand.logoUrl}
                                    onChange={handleAddChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Website URL</label>
                                <input
                                    className={styles.input}
                                    name="websiteUrl"
                                    placeholder="Nhập URL website..."
                                    value={newBrand.websiteUrl}
                                    onChange={handleAddChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mô tả</label>
                                <textarea
                                    className={styles.textarea}
                                    name="description"
                                    placeholder="Nhập mô tả đối tác..."
                                    value={newBrand.description}
                                    onChange={handleAddChange}
                                    rows={3}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.addButton} onClick={handleAdd}>
                                    ➕ Thêm đối tác
                                </button>
                                <button className={styles.cancelButton} onClick={() => setShowAddModal(false)}>
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

export default Partners;