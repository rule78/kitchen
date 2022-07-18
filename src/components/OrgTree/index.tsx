import type { DataNode, TreeProps } from 'antd/lib/tree';
import { Tree, Input, Space } from 'antd'
import {
  CheckOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './index.less';
import { isArray } from 'lodash';

const initData: DataNode[] = [
  {
    title: '食区',
    key: '0-0',
    children: [
      {
        title: '食区01',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
        ],
      },
      {
        title: '食区02',
        key: '0-0-1',
        children: [{ title: '豫菜', key: '0-0-1-0' }],
      },
    ],
  },
];
const drawer: React.FC = () => {
  const [activeList, setActiveList] = useState<Array<any>>([])
  const [treeData, setTreeData] = useState<Array<any>>([])
  const inputRef = useRef(null);
  useEffect(() => {
    setTreeData(initData)
  }, [])
  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (isArray(selectedKeys) && selectedKeys.length === 0) {
      console.log(selectedKeys)
    } else {
      setActiveList(selectedKeys)
    }
  };
  const onExpand = () => {}
  const changeThree = () => {
    const { input } = inputRef.current as any
    console.log(input?.value);
    setActiveList([])
  }
  const TreeEleData = useMemo(() => {
    const formatTree = () => {
      function formatTreeItem(data: any) {
        let result = [] as any
        data.map((item: any) => {
          let target: any = { key: item.key }
          if (activeList.includes(item.key)) {
            target.title = (<Space>
              <Input
                ref={inputRef}
                defaultValue={item.title}
              />
              <div className={styles.comfirmBox} onClick={changeThree}>
                <CheckOutlined />
              </div>
            </Space>)
          } else {
            target.title = <div className={styles.title}>{ item.title }</div>
          }
          if (item.children) {
            target.children = formatTreeItem(item.children);
          }
          result.push(target)
        });
        return result
      }
      return formatTreeItem(treeData)
    }
    return formatTree()
  }, [treeData, activeList])
  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <div className={styles.title}>福建商学院马尾校区食堂</div>
        <div className={styles.btnList}>
          <div className={styles.edit}></div>
          <div className={styles.add}></div>
        </div>
      </div>
      <div className={styles.content}>
        <Tree
         onExpand={onExpand}
          onSelect={onSelect}
          treeData={TreeEleData}
        />
      </div>
    </div>
  );
};
export default drawer;
