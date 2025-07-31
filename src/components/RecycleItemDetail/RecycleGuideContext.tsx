import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface WasteType {
  typeName: string;
  description: string;
  iconUrl: string;
  id: string;
}

interface Waste {
  name: string;
  description: string;
  imageUrl: string;
  wasteTypeId: string;
  wasteType: WasteType;
  id: string;
  regulations: string;
}

interface RecycleGuideData {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string | null;
  wasteId: string;
  waste: Waste;
  wasteName: string;
}

interface RecycleGuideContextProps {
  data: RecycleGuideData | null;
  wasteData: Waste | null;
  loading: boolean;
  error: string | null;
}

const RecycleGuideContext = createContext<RecycleGuideContextProps>({
  data: null,
  wasteData: null,
  loading: false,
  error: null,
});

export const useRecycleGuide = () => useContext(RecycleGuideContext);

export const RecycleGuideProvider: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const [data, setData] = useState<RecycleGuideData | null>(null);
  const [wasteData, setWasteData] = useState<Waste | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // Fetch recycle guide data
    axios.get(`${process.env.REACT_APP_API_URL}/recycleguides/waste/${id}`)
      .then(res => {
        setData(res.data.data);
        // After getting recycle guide data, fetch waste data for regulations
        if (res.data.data?.wasteId) {
          return axios.get(`${process.env.REACT_APP_API_URL}/wastes/${res.data.data.wasteId}`);
        }
      })
      .then(wasteRes => {
        if (wasteRes?.data?.data) {
          setWasteData(wasteRes.data.data);
        }
      })
      .catch(() => setError('Không thể tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <RecycleGuideContext.Provider value={{ data, wasteData, loading, error }}>
      {children}
    </RecycleGuideContext.Provider>
  );
};