import React from 'react';
import styles from './WasteStatus.module.css';
import Benefits from '../../components/RecycleGuideList/Benefits';
import RecyclableItems from '../../components/RecycleGuideList/RecyclableItems';
import MiniCarousel from '../../components/MiniCarousel';
import RecyclingProcess from '../../components/RecycleGuideList/RecyclingProcess';

const  RecycleGuideList: React.FC = () => {
    return (
        <div>
            <MiniCarousel/>
            
            <RecyclableItems />
            <Benefits />
            <RecyclingProcess/>
        </div>
    );
};

export default RecycleGuideList;