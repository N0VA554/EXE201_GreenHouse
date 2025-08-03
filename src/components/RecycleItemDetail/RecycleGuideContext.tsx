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
    setError(null);
    
    // Fetch recycle guide data
    axios.get(`${process.env.REACT_APP_API_URL}/recycleguides/waste/${id}`)
      .then(res => {
        const guideData = res.data.data;
        setData(guideData);
        
        // Set waste data from the guide data if available
        if (guideData?.waste) {
          setWasteData(guideData.waste);
        }
        
        // If waste data is not included in guide response, fetch it separately
        if (guideData?.wasteId && !guideData?.waste) {
          return axios.get(`${process.env.REACT_APP_API_URL}/wastes/${guideData.wasteId}`);
        }
      })
      .then(wasteRes => {
        if (wasteRes?.data?.data) {
          setWasteData(wasteRes.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <RecycleGuideContext.Provider value={{ data, wasteData, loading, error }}>
      {children}
    </RecycleGuideContext.Provider>
  );
};