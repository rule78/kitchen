
import React from 'react';
import styles from './index.less';

type DividerProps = {
  text?: string;
  style?: any;
};

const Divider: React.FC<DividerProps> = ({ text, style }) => {
  return (
    <div className={styles.dividerBox} style={style} >
        <div className={styles.bg}></div>
        <div className={styles.content}>
            <div className={styles.divider}></div>
            <div className={styles.text}>{text}</div> 
        </div>
    </div>
  );
};
export default Divider;
