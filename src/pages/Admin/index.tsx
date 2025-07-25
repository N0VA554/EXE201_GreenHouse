import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const apiUrl = process.env.REACT_APP_API_URL;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

  const [year, setYear] = useState<string>('2025');
  const [campaignId, setCampaignId] = useState<string>('3009c3893ec94ee9bf1c45882e17496e');
  const [campaigns, setCampaigns] = useState([]);
  const [transactionByYear, setTransactionByYear] = useState([]);
  const [transactionByYearAndCampaign, setTransactionByYearAndCampaign] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTransactionsByYear();
  }, [year]);

  useEffect(() => {
    fetchTransactionsByYearAndCampaign();
  }, [year, campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [])

  const colors = ["#8884d8", "#82ca9d", "#ff7300", "#00C49F", "#FFBB28"];

  const allCampaignKeys = Array.from(
    new Set(
      transactionByYear.flatMap(obj =>
        Object.keys(obj).filter(key => key !== "Month")
      )
    )
  );

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

  const fetchCampaign = async () => {
    try {
      var response = await axiosInstance.get("campaigns");
      console.log(response);
      setCampaigns(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTransactionsByYear = async () => {
    try {
      var response = await axiosInstance.get(`transactionlogs/report/${year}`);
      setTransactionByYear(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTransactionsByYearAndCampaign = async () => {
    try {
      var response = await axiosInstance.get(`transactionlogs/report/${year}/${campaignId}`);
      setTransactionByYearAndCampaign(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

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

        <div className={styles.filterWrapper}>
          <div className={styles.filterItem}>
            <label htmlFor="yearInput">Năm:</label>
            <input
              id="yearInput"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={styles.input}
              min="2000"
              max="2100"
            />
          </div>
          <div className={styles.filterItem}>
            <label htmlFor="campaignSelect">Chiến dịch:</label>
            <select
              id="campaignSelect"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className={styles.input}
            >
              {campaigns.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className={styles.title}>Thống kê theo năm</h2>
        {/* Get by year chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transactionByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Dùng map để vẽ Line cho từng chiến dịch */}
            {allCampaignKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]} // Lặp màu
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <h2 className={styles.title}>Thống kê theo năm và chiến dịch</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transactionByYearAndCampaign}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Tổng tiền"
            />
          </LineChart>
        </ResponsiveContainer>
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