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
        if (!window.confirm('Bạn có chắc muốn xóa brand này?')) return;
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

    return (
        <div className={styles.partnersContainer}>
            <h2 className={styles.title}>Thành viên & Đối tác</h2>
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
                <button className={styles.button} onClick={() => setShowAddModal(true)}>
                    Thêm Brand
                </button>
            </div>
            <div className={styles.grid}>
                {brands.map(brand =>
                    editingId === brand.id && editBrand ? (
                        <div key={brand.id} className={styles.partnerCard}>
                            <input
                                className={styles.input}
                                name="name"
                                value={editBrand.name}
                                onChange={handleEditChange}
                                placeholder="Tên"
                            />
                            <input
                                className={styles.input}
                                name="logoUrl"
                                value={editBrand.logoUrl}
                                onChange={handleEditChange}
                                placeholder="Logo URL"
                            />
                            <input
                                className={styles.input}
                                name="websiteUrl"
                                value={editBrand.websiteUrl}
                                onChange={handleEditChange}
                                placeholder="Website URL"
                            />
                            <textarea
                                className={styles.input}
                                name="description"
                                value={editBrand.description}
                                onChange={handleEditChange}
                                placeholder="Mô tả"
                            />
                            <div>
                                <button className={styles.button} onClick={handleEditSave}>Lưu</button>
                                <button className={styles.button} onClick={() => setEditingId(null)}>Hủy</button>
                            </div>
                        </div>
                    ) : (
                        <div key={brand.id} className={styles.partnerCard}>
                            <a
                                href={brand.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                            >
                                <div className={styles.logoWrapper}>
                                    <img src={brand.logoUrl} alt={brand.name} className={styles.logo} />
                                </div>
                                <div className={styles.info}>
                                    <h3>{brand.name}</h3>
                                    <p>{brand.description}</p>
                                </div>
                            </a>
                            <div style={{ marginTop: 12 }}>
                                <button className={styles.button} onClick={() => handleEdit(brand)}>Sửa</button>
                                <button className={styles.button} onClick={() => handleDelete(brand.id)}>Xóa</button>
                            </div>
                        </div>
                    )
                )}
            </div>
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Thêm Brand mới</h3>
                        <input
                            className={styles.input}
                            name="id"
                            placeholder="ID"
                            value={newBrand.id}
                            onChange={handleAddChange}
                        />
                        <input
                            className={styles.input}
                            name="name"
                            placeholder="Tên"
                            value={newBrand.name}
                            onChange={handleAddChange}
                        />
                        <input
                            className={styles.input}
                            name="logoUrl"
                            placeholder="Logo URL"
                            value={newBrand.logoUrl}
                            onChange={handleAddChange}
                        />
                        <input
                            className={styles.input}
                            name="websiteUrl"
                            placeholder="Website URL"
                            value={newBrand.websiteUrl}
                            onChange={handleAddChange}
                        />
                        <textarea
                            className={styles.input}
                            name="description"
                            placeholder="Mô tả"
                            value={newBrand.description}
                            onChange={handleAddChange}
                        />
                        <div style={{ marginTop: 12 }}>
                            <button className={styles.button} onClick={handleAdd}>Thêm</button>
                            <button className={styles.button} onClick={() => setShowAddModal(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Partners;