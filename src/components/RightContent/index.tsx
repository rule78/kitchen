
import YButton from '@/components/Y/YButton'
import React from 'react';
import { useModel } from 'umi';
import HomeLogo from '@/assets/images/edit.png'
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme =  'dark' | 'light';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      <div className={styles.shopBox}>
        <div className={styles.shopManage}>店铺管理</div>
        <img className={styles.homeLogo} src={HomeLogo} alt="img" />
      </div>
      <div className={styles.avatarBox}>
        <Avatar />
        <YButton text={'申请入住'}></YButton>
      </div>
    </div>
  );
};
export default GlobalHeaderRight;
