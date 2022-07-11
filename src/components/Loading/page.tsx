
import React from 'react';
import styles from './index.less';

type YButtonProps = {
  text?: string;
};

const YButton: React.FC<YButtonProps> = ({ text }) => {
  return (
    <div className={styles.pageLoading}>
      <div ></div>
    </div>
  );
};
export default YButton;
