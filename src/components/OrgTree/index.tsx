import type { DataNode, TreeProps } from 'antd/lib/tree';
import { Tree, Modal, Form, Input, message } from 'antd'
import { saveDepartment, updateDepartment } from '@/services/kitchen/api'
import { useState, useEffect, useMemo, useRef } from 'react';
import { history } from 'umi';
import styles from './index.less';
import { isArray } from 'lodash';

const drawer: React.FC = ({ options, getDeptData, getStaffList }: any) => {
  const [activeList, setActiveList] = useState<any>('')
  const [treeData, setTreeData] = useState<Array<any>>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [item, setIem] = useState<any>({})
  const [type, setType] = useState<string>('add')
  const { name: mainName, identityType, relateId } = history.location.query as any
  const [form] = Form.useForm();
  useEffect(() => {
    setTreeData(options || [])
  }, [options])
  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (isArray(selectedKeys) && selectedKeys.length === 0) {
      console.log(selectedKeys)
    } else {
      setIem(findNode(options, selectedKeys[0]))
      setActiveList(selectedKeys[0])
      getStaffList({ deptId: selectedKeys[0] })
    }
  };
  const findNode = (target: any, id) => {
    const loop = (data: any, key: any, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == key) {
          return callback(data[i], i, data)
        }
        if (data[i].childList) {
          loop(data[i].childList, key, callback)
        }
      }
    }
    let Obj
    loop(target, id, (item, index, arr) => { Obj = item })
    return Obj
  }
  const onExpand = () => {}
  const toEdit = () => {
    setType('edit')
    form.setFieldsValue(item)
    setIsModalVisible(true)
  }
  const toAdd = () => {
    setType('add')
    form.setFieldsValue({
      ...item,
      deptName: ''
    })
    setIsModalVisible(true)
  }
  const handleOk = async() => {
    try {
      const values = await form.validateFields();
      if (values) {
        const { childList, ...target } = item
        if (type === 'add') {
          const { deptId, ...rest } = target
          const res = await saveDepartment({
            ...rest,
            ...values,
            parentId: rest.id || 0,
            level: rest.level + 1 || 1,
            identityType,
            relateId
          })
          if (res.message === "success") {
            message.success('新增成功')
            getDeptData()
            setIsModalVisible(false)
          }
        } else {
          const res = await updateDepartment({
            ...target,
            ...values,
            deptId: target.id,
            identityType,
            relateId
          })
          if (res.message === "success") {
            message.success('编辑成功')
            getDeptData()
            setIsModalVisible(false)
          }
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      return
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <div className={styles.title}>{mainName}</div>
        <div className={styles.btnList}>
          {
            activeList && <div className={styles.edit} onClick={toEdit}></div>
          }
          <div className={styles.add} onClick={toAdd}></div>
        </div>
      </div>
      <div className={styles.content}>
        <Tree
          onExpand={onExpand}
          fieldNames={{
            title: 'deptName',
            key: 'id',
            children: 'childList',
          }}
          onSelect={onSelect}
          treeData={treeData}
        />
      </div>
      <Modal
        title={type === 'add' ? '添加下级部门' : '编辑部门'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          <Form form={form} name="normal_login" initialValues={item}>
            <Form.Item name="deptName" rules={[{ required: true, message: '请输入部门名称' }]}>
              <Input />
            </Form.Item>
          </Form>
      </Modal>
    </div>
  );
};
export default drawer;
