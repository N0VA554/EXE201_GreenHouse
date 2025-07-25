import React, { useEffect, useState } from 'react';
import styles from "./Users.module.css"
import TransactionList, { TransactionPaginationResponse, TransactionResponse } from '../../components/Transaction/TransactionList';
import axios from 'axios';

const tabs = ['Transaction Log'];

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

const Users: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('Transaction Log');
    const [page, setPage] = useState(1);
    const [data, setData] = useState<TransactionPaginationResponse | null>(null);

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);

    const fetchTransactions = async (pageNumber: number) => {
        try {
            const response = await axiosInstance.get(`/transactionlogs/user/${pageNumber}/${6}`);
            setData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'Transaction Log':
                return data ? (
                    <TransactionList
                        data={data}
                        onPageChange={(newPage) => setPage(newPage)} />
                ) : (
                    <div>Loading...</div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };


    return (
        <div className={styles.users_container}>
            <div className={styles.users_sidebar}>
                <h3 className={styles.users_menu_title}>Menu</h3>
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        className={`${styles.users_tab} ${selectedTab === tab ? 'active' : ''}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className={styles.users_content}>
                <h2>{selectedTab}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default Users;
