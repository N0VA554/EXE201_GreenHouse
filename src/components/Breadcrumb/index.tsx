import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

interface BreadcrumbProps {
  wasteName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ wasteName }) => {
  return (
    <div className={styles.breadcrumb}>
      <Link to="/" className={styles.breadcrumbItem}>
        Trang chủ
      </Link>
      <span className={styles.separator}></span>
      <Link to="/danhsachphanloai" className={styles.breadcrumbItem}>
        Phân loại
      </Link>
      {wasteName && (
        <>
          <span className={styles.separator}></span>
          <span className={styles.breadcrumbItemActive}>
            {wasteName}
          </span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb; 