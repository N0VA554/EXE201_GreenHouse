import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';

const apiUrl = process.env.REACT_APP_API_URL;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

const AdminPage: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleName, setEditRoleName] = useState<string>('');
  const [editUserRoleId, setEditUserRoleId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/api/roles`, getAuthHeader());
      setRoles(res.data.data || []);
    } catch (err: any) {
      setError('Lỗi lấy roles');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/users`, getAuthHeader());
      setUsers(res.data.data || []);
    } catch (err: any) {
      setError('Lỗi lấy users');
    }
    setLoading(false);
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/roles`, { name: newRole }, getAuthHeader());
      setNewRole('');
      fetchRoles();
    } catch {
      setError('Lỗi thêm role');
    }
    setLoading(false);
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa role này?')) return;
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/roles/${id}`, getAuthHeader());
      fetchRoles();
    } catch {
      setError('Lỗi xóa role');
    }
    setLoading(false);
  };

  const handleEditRole = (role: any) => {
    setEditRoleId(role.id);
    setEditRoleName(role.name);
  };

  const handleUpdateRole = async () => {
    if (!editRoleName.trim() || !editRoleId) return;
    setLoading(true);
    try {
      await axios.put(`${apiUrl}/api/roles`, { id: editRoleId, name: editRoleName }, getAuthHeader());
      setEditRoleId(null);
      setEditRoleName('');
      fetchRoles();
    } catch {
      setError('Lỗi cập nhật role');
    }
    setLoading(false);
  };

  // User role update handlers
  const handleEditUserRole = (user: any) => {
    setEditUserRoleId(user.id);
    setSelectedRoleId(user.roleId);
  };

  const handleUpdateUserRole = async (userId: string) => {
    if (!selectedRoleId) return;
    setLoading(true);
    try {
      await axios.put(
        `${apiUrl}/users/update-role`,
        { userId, roleId: selectedRoleId },
        getAuthHeader()
      );
      setEditUserRoleId(null);
      setSelectedRoleId('');
      fetchUsers();
    } catch {
      setError('Lỗi cập nhật role cho user');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Quản lý Roles</h2>
        {loading && <p className={styles.loading}>Đang tải...</p>}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Role</th>
                {/* <th>ID</th> */}
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role: any, idx: number) => (
                <tr key={role.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {editRoleId === role.id ? (
                      <input
                        value={editRoleName}
                        onChange={e => setEditRoleName(e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      role.name
                    )}
                  </td>
                  {/* <td>{role.id}</td> */}
                  <td>
                    {editRoleId === role.id ? (
                      <>
                        <button className={styles.button} onClick={handleUpdateRole}>Lưu</button>
                        <button className={styles.button} onClick={() => setEditRoleId(null)}>Hủy</button>
                      </>
                    ) : (
                      <>
                        <button className={styles.button} onClick={() => handleEditRole(role)}>Sửa</button>
                        <button className={styles.button} onClick={() => handleDeleteRole(role.id)}>Xóa</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={4}>
                  <input
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    placeholder="Tên role mới"
                    className={styles.input}
                  />
                  <button className={styles.button} onClick={handleAddRole}>Thêm</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 className={styles.title}>Quản lý Users</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Username</th>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Role</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, idx: number) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>{user.gender}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.address}</td>
                  <td>
                    {editUserRoleId === user.id ? (
                      <select
                        className={styles.input}
                        value={selectedRoleId}
                        onChange={e => setSelectedRoleId(e.target.value)}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      user.roleName
                    )}
                  </td>
                  <td>
                    {editUserRoleId === user.id ? (
                      <>
                        <button
                          className={styles.button}
                          onClick={() => handleUpdateUserRole(user.id)}
                        >
                          Lưu
                        </button>
                        <button
                          className={styles.button}
                          onClick={() => setEditUserRoleId(null)}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        className={styles.button}
                        onClick={() => handleEditUserRole(user)}
                      >
                        Đổi role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;