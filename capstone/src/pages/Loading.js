import React from 'react';
import styles from '../styles/loading.module.css';

const Loading = () => {
  return (
    <section className={styles['dots-container']}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </section>
  );
};

export default Loading;