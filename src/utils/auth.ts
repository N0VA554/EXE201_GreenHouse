// src/utils/auth.ts
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};
