
import React from 'react';
import { useModel } from 'umi';
import styles from './index.less';

export type SiderTheme =  'dark' | 'light';

const LeftContent: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.currentUser) {
    return null;
  }

  const { homeLogo } = initialState.currentUser;

  return (
    <div className={styles.userBox}>
      <img
        className={styles.logoImg}
        width={45}
        height={45}
        src={homeLogo}
      />
      <div className={styles.userInfo}>
        <div className={styles.userName}>福建商学院马尾校区食堂</div>
        <div className={styles.plaform}>智慧餐饮综合管理食上云平台</div>
      </div>
    </div>
  );
};
export default LeftContent;
