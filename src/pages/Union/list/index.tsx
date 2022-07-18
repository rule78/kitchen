
import Header from '@/components/Header'
import OrgTree from '@/components/OrgTree'
import { Space, Table, Modal, Form, Input, InputNumber, Select, Upload } from 'antd';
import Diveder from '@/components/Y/Divider'
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadApi } from '@/dictionary'
import type { ColumnsType } from 'antd/lib/table';
import styles from './index.less';

interface DataType {
  key: string;
  name: string;
  age: number
}

const data: DataType[] = [
  {
    key: '1',
    name: '大斌',
    age: 5,
  },
  {
    key: '2',
    name: '晓斌',
    age: 5,
  },
]
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const List: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personData, setPersonData] = useState<any>({});
  const [form] = Form.useForm();
  const handleAdd = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>复制邀请码</a>
          <a>查看</a>
          <a>修改</a>
        </Space>
      ),
    },
  ]
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  return (
    <div className={styles.home}>
      <Header />
      <div className={styles.container}>
        <div className={styles.drawerBox}>
          <OrgTree />
        </div>
        <div className={styles.tableBox}>
          <div className={styles.tableHeader}>
            <div className={styles.title}>员工信息表</div>
            <div className={styles.addBtn} onClick={handleAdd}>
              新增员工
            </div>
          </div>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
      <Modal
        title="新增员工"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer ={null}
      >

        <Form
          form={form}
          {...layout}
          className={styles.formBox}
          autoComplete="off"
        >
          <Diveder text="身份及账号" style={{ marginTop: '20px', marginBottom: '21px' }} />
          <Form.Item
            label="手机号码"
            name="phoneNumber"
            rules={[{ required: true }]}
            extra={'员工注册后会自动展示注册手机号'}
          >
            <div className={styles.text}>未注册</div>
          </Form.Item>
          <Form.Item
            label="所在部门"
            name="management"
            rules={[{ required: true, message: '请选择部门！' }]}>
              <Select style={{ width: '100%' }} >
                <Select.Option value="jack">大厅</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item
            label="具体岗位"
            name="manager"
            rules={[{ required: true, message: '请选择具体岗位！' }]}>
              <Select style={{ width: '100%' }} >
                <Select.Option value="jack">厨师</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item
            name="zhengming"
            label="法人身份证照片"
            rules={[{ required: true }]}
            extra={'请提供有效期范围内的证件，证件需露出四角'}
          >
            <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={personData.fileList}
            >
              {personData.fileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="personName"
            label="姓名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="zhenging"
            label="身份证号码"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Diveder text="资质证件" style={{ marginTop: '30px', marginBottom: '20px' }} />
          <Form.Item
            name="safe"
            label="健康证"
            extra={'图片清晰可见'}
          >
            <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={personData.safeFileList}
            >
              {personData.safeFileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <div className={styles.submitBtn}>提交</div>
        </Form>
      </Modal>
    </div>
  );
};
export default List;
