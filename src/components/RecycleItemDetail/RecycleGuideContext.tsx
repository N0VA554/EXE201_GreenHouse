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
}

interface RecycleGuideData {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string | null;
  wasteId: string;
  waste: Waste;
}

interface RecycleGuideContextProps {
  data: RecycleGuideData | null;
  loading: boolean;
  error: string | null;
}

const RecycleGuideContext = createContext<RecycleGuideContextProps>({
  data: null,
  loading: false,
  error: null,
});

export const useRecycleGuide = () => useContext(RecycleGuideContext);

export const RecycleGuideProvider: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const [data, setData] = useState<RecycleGuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/recycleguides/${id}`)
      .then(res => setData(res.data.data))
      .catch(() => setError('Không thể tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <RecycleGuideContext.Provider value={{ data, loading, error }}>
      {children}
    </RecycleGuideContext.Provider>
  );
};