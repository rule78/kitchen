import React from 'react';
import Header from '@/components/Header'
import styles from './index.less';

const Home = () => {
  return (
    <div className={styles.home}>
      <Header />
      <div className={styles.content}>
        <div className={styles.mainImg}></div>
      </div>
    </div>
  )
}

export default Home