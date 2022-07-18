import React, { useEffect, useState } from 'react';
import { Cascader, Input } from 'antd';
import styles from './index.less';

type addressProps = {
  cascader?: Array<string>;
  detail?: string;
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
const Address: React.FC = ({ onChange, value }: any) => {
  const [detail, setDetail] = useState('');
  const [cascader, setCascader] = useState([]);
  useEffect(() => {
    if (value) {
      setDetail(value.detail)
      setCascader(value.cascader)
    }
  }, [value])
  const onDetailChange = (e: any) => {
    onChange({
      detail: e.target.value,
      cascader
    })
  }
  const onCascaderChange = (value: any) => {
    onChange({
      detail,
      cascader: value
    })
  }
  return (
    <div className={`${styles.action} ${styles.yButton}`}>
      <Cascader
        options={options}
        value={cascader}
        onChange={onCascaderChange} 
        placeholder="请选择省市区"
      />
      <div className={styles.inputBox}>
        <Input placeholder="详细地址" value={detail} onChange={onDetailChange} />
      </div>
    </div>
  );
};
export default Address;
