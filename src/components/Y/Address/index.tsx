import React, { useEffect, useState } from 'react';
import { Cascader, Input } from 'antd';
import styles from './index.less';

const Address: React.FC<any> = ({ onChange, value, options }: any) => {
  const [cascader, setCascader] = useState([]);
  useEffect(() => {
    if (value) {
      setCascader(value)
    }
  }, [value])
  const onCascaderChange = (value: any) => {
    onChange(value)
  }
  return (
    <div className={`${styles.action} ${styles.yButton}`}>
      <Cascader
        options={options}
        value={cascader}
        fieldNames={{ label: 'name', value: 'id', children: 'childList' }}
        onChange={onCascaderChange} 
        placeholder="请选择省市区"
      />
    </div>
  );
};
export default Address;
