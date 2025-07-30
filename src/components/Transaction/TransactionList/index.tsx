import React from 'react';
import styles from './Index.module.css';

export interface TransactionResponse {
    id: string;
    amount: number;
    description: string;
    status: string;
    paymentMethod: string;
    userId: string;
    transactionTypeId: string;
    campaignId?: string;
    createdTime: string;
    campaignTitle?: string;
    transactionTypeName?: string;
}

export interface TransactionPaginationResponse {
    items: TransactionResponse[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface Props {
    data: TransactionPaginationResponse;
    onPageChange?: (page: number) => void;
}

const TransactionList: React.FC<Props> = ({ data, onPageChange }) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Transaction History</h2>
            <div className={styles.table}>
                <div className={styles.header}>
                    <span>Amount</span>
                    <span>Description</span>
                    <span>Status</span>
                    <span>Payment</span>
                    <span>Type</span>
                    <span>Date</span>
                </div>
                {data.items.map((tx) => (
                    <div className={styles.row} key={tx.id}>
                        <span>{new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(tx.amount)}</span>
                        <span>{tx.description}</span>
                        <span className={`${styles.status} ${styles[tx.status.toLowerCase()]}`}>
                            {tx.status}
                        </span>
                        <span>{tx.paymentMethod}</span>
                        <span>{tx.transactionTypeName || tx.transactionTypeId}</span>
                        <span>{new Date(tx.createdTime).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {data.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={`${styles.pageButton} ${!data.hasPreviousPage ? styles.disabled : ''}`}
                        onClick={() => onPageChange?.(data.currentPage - 1)}
                        disabled={!data.hasPreviousPage}
                    >
                        Previous
                    </button>

                    {[...Array(data.totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <button
                                key={page}
                                className={`${styles.pageButton} ${data.currentPage === page ? styles.active : ''}`}
                                onClick={() => onPageChange?.(page)}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        className={`${styles.pageButton} ${!data.hasNextPage ? styles.disabled : ''}`}
                        onClick={() => onPageChange?.(data.currentPage + 1)}
                        disabled={!data.hasNextPage}
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );
};

export default TransactionList;
