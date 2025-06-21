import React from 'react';
import { useParams } from 'react-router-dom';
import { RecycleGuideProvider } from '../../components/RecycleItemDetail/RecycleGuideContext';
import RecyclingHeader from '../../components/RecycleItemDetail/Header';
import RecyclingGuidelines from '../../components/RecycleItemDetail/Guidelines';
import RecyclingLocation from '../../components/RecycleItemDetail/Location';
import MiniCarousel from '../../components/MiniCarousel';
import AvatarOverlay from '../../components/RecycleItemDetail/Avt';


const RecycleItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Không tìm thấy hướng dẫn</div>;

    return (
        <RecycleGuideProvider id={id}>
            <div style={{ position: 'relative', paddingBottom: 70 }}>
                <MiniCarousel />
                <AvatarOverlay />
            </div>
            <div style={{ paddingTop: 60 }}>
                <RecyclingHeader />
                <RecyclingGuidelines />
                <RecyclingLocation />
            </div>
        </RecycleGuideProvider>
    );
};

export default RecycleItem;