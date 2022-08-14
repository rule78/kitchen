import React from 'react';
import styles from './agreement.less';

type DividerProps = {
  text?: string;
  style?: any;
};

const Agreement: React.FC<DividerProps> = ({ text }) => {
  return <iframe
    style={{width: '100%',
      height: '100%',
      backgroundColor: '#fff'}}
    src="http://dve.985cn.com/aggrement.html"></iframe>
};
export default Agreement;
