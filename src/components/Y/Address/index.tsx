import React from 'react';
import { Cascader, Input } from 'antd';
import styles from './index.less';

type YButtonProps = {
  text?: string;
};

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
];

const onCascaderChange = (value: any) => {
  console.log(value);
};
const Address: React.FC<YButtonProps> = ({ text }) => {
  return (
    <div className={`${styles.action} ${styles.yButton}`}>
      <Cascader options={options} onChange={onCascaderChange} placeholder="请选择省市区" />
      <div className={styles.inputBox}><Input placeholder="详细地址" /></div>
    </div>
  );
};
export default Address;
