
import Header from '@/components/Header'
import OrgTree from '@/components/OrgTree'
import { TreeSelect, Space, Table, Modal, Form, Input, Select, Upload, DatePicker, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import moment from 'moment';
import Diveder from '@/components/Y/Divider'
import { PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import { uploadApi } from '@/services/kitchen/api'
import { getDeptTree } from '@/services/kitchen/api'
import { HOST } from '@/dictionary/index'
import { formatFile, validateCardId, copyUrl } from '@/utils'
import { getToken } from '@/utils/auth'
import {
  saveStoreStaff,
  updateStoreStaff,
  getStoreStaffInfo,
  getStorepositionList,
  getStoreStaffList,
} from '@/services/kitchen/store'
import { history } from 'umi';
import { request } from 'umi';
import styles from './index.less';

interface DataType {
  id: string;
  userName: string;
  deptName: string;
  mobileNo: number;
  status: number;
  lasiModifydate: number;
  lastOperateName: string;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const getRandomuserParams = (params: any) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const List: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [staffType, setStaffType] = useState('add');
  const [personData, setPersonData] = useState<any>({});
  const [positionData, setPosition] = useState<any>([]);
  const [depTreeData, setDepTreeData] = useState<any>([]);
  const [form] = Form.useForm();
  const [staffForm] = Form.useForm();
  const { identityType, relateId, name } = history.location.query as any
  useEffect(() => {
    initData()
  }, [relateId])

  const initData = async () => {
    getDeptData()
    getStaffList()
    getPositionData()
    setInterval(() => {
      getStaffList()
    }, 30000)
  }
  const getPositionData = async () => {
    // const positionRes = await getStorepositionList({
    //   pageNum: 1,
    //   pageSize: 99
    // })
    // setPosition(positionRes?.data?.list.map((i: any) => {
    //   return {
    //     label: i.name,
    //     value: i.id
    //   }
    // }))
    setPosition([{
      label: '岗位1',
      value: 0
    }])
  }
  const getDeptData = async () => {
    const res = await getDeptTree({ identityType, relateId })
    if (res.data) {
      setDepTreeData(res.data)
    }
  }

  const getStaffList = async (params: any = {}) => {
    setTableLoading(true);
    const res = await getStoreStaffList({
      storeId: relateId,
      ...getRandomuserParams(params)
    })
    setTableLoading(false);
    if (res.data) {
      setTableData(res.data.list)
      setPagination({
        ...params.pagination,
        total: res.data.total,
      });
    }
  }
  const uploadFile = (params: any, uploadType: string) => {
    const formData = new FormData()
    formData.append('file', params.file)
    request<API.RuleList>(uploadApi, {
      method: 'POST',
      requestType: 'form',
      data: formData
    }).then((res: any) => {
      setTimeout(() => {
        setPersonData({
          ...personData,
          [uploadType]: [{
            uid: new Date().getTime(),
            name: params.file.name,
            status: 'done',
            url: res.data
          }]
        })
      })
    })
  }
  const onRemove = (params: any, uploadType: string) => {
    const { uid } = params
    const target = personData[uploadType].filter((i: any) => {
      return i.uid !== uid
    })
    setPersonData({
      ...personData,
      [uploadType]: target
    })
  }
  const shubmitStaff = async () => {
    try {
      const values = await form.validateFields();
      const { outDate } = values
      const params = {
        ...values,
        cardStartTime: new Date(outDate[0]).getTime(),
        cardEndTime: new Date(outDate[1]).getTime(),
        idCardFront: formatFile(personData.idCardFront),
        idCardBack: formatFile(personData.idCardBack),
        workCard: formatFile(personData.workCard),
        storeId: relateId,
        userId: getToken(),
      }
      let res = null
      if (staffType === 'edit') {
        params.id = personData.id
        res = await updateStoreStaff(params)
      } else {
        res = await saveStoreStaff(params)
      }
      if (res.message === 'success') {
        message.success(staffType === 'add' ? '新增成功！': '编辑成功！')
        setIsModalVisible(false)
        getStaffList()
      }
    } catch (errorInfo) {
      message.error(staffType === 'add' ? '服务异常，新增失败！': '服务异常，编辑失败！')
      return
    }
  }
  const handleAdd = () => {
    setPersonData({})
    setStaffType('add')
    setIsModalVisible(true)
    form.setFieldsValue({})
  }
  const handleEdit = async(record: any, type: string) => {
    const picKeys = ['idCardFront', 'idCardBack', 'workCard']
    const { data } = await getStoreStaffInfo({
      staffId: record.id
    })
    const target = data
    target['outDate'] = [
      moment(data.cardStartTime, 'YYYY-MM-DD hh:mm:ss'),
      moment(data.cardEndTime, 'YYYY-MM-DD hh:mm:ss')
    ]
    Object.keys(data).map(i => {
      if (picKeys.includes(i)) {
        target[i] = [{
          uid: new Date().getTime(),
          name: new Date().getTime(),
          status: 'done',
          url: data[i]
        }]
      }
    })
    form.setFieldsValue(data)
    setPersonData(data)
    setStaffType(type)
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const copyMsg = (record: any) => {
    console.log(process.env)
    const identityTypeText = `&identityType=${identityType}&name=${encodeURIComponent('我的')}`
    const link = `http://dve.985cn.com/h5/#/login?relateId=`+relateId+ '&staffId='+record.id+identityTypeText
    copyUrl(`点击加入我的企业"${name}",一起开启全新办公体验吧. `+ link)
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '员工编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      render: text => <a>{text}</a>,
    },
    {
      title: '手机号',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      render: (_, record) => <div>{record.mobileNo}</div>,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (d) => <a>{d === 1 ? '未加入': '已加入'}</a>,
    },
    {
      title: '修改时间',
      dataIndex: 'lasiModifydate',
      key: 'lasiModifydate',
      render: text => <div>{text || '--'}</div>,
    },
    {
      title: '最后操作人',
      dataIndex: 'lastOperateName',
      key: 'lastOperateName',
      render: text => <div>{text || '--'}</div>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {copyMsg(record)}}>复制邀请码</a>
          <a onClick={() => {handleEdit(record, 'detail')}}>查看</a>
          <a onClick={() => {handleEdit(record, 'edit')}}>修改</a>
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
  const validatCode = (_, value: any) => {
    const p = /^[A-Za-z0-9]+$/
    if (!value) {
      return Promise.reject(new Error('不可以为空'))
    }
    if (p.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('不可以输入中文，只支持大小写字母和阿拉伯数字'))
    }
  }
  const getModalTitle = useCallback(() => {
    if (staffType === 'add') {
      return '新增员工'
    }
    if (staffType === 'edit') {
      return '编辑员工'
    }
    return '查看员工'
  }, [staffType])
  return (
    <div className={styles.home}>
      <Header />
      <div className={styles.container}>
        <div className={styles.drawerBox}>
          <OrgTree
            options={depTreeData}
            getDeptData={getDeptData}
            getStaffList={getStaffList}
          />
        </div>
        <div className={styles.tableBox}>
          <div className={styles.tableHeader}>
            <div className={styles.title}>员工信息表</div>
            <div className={styles.addBtn} onClick={handleAdd}>
              新增员工
            </div>
          </div>
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={tableData}
            pagination={pagination}
            loading={tableLoading}
            onChange={getStaffList}
          />
        </div>
      </div>
      <Modal
        title={ getModalTitle() }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        centered
        maskClosable={false}
        footer ={null}
      >
        <Form
          form={form}
          {...layout}
          disabled={staffType === 'detail'}
          initialValues={personData}
          className={styles.formBox}
          autoComplete="off"
        >
          <Diveder text="身份及账号" style={{ marginTop: '20px', marginBottom: '21px' }} />
          <Form.Item
            label="手机号码"
            name="mobileNo"
            extra={'员工注册后会自动展示注册手机号'}
          >
            <div className={styles.text}>{ personData.mobileNo || '未注册'}</div>
          </Form.Item>
          <Form.Item
            label="所在部门"
            name="deptId"
            rules={[{ required: true, message: '请选择部门！' }]}>
              <TreeSelect 
                style={{ width: '100%' }}
                fieldNames={{
                  label: 'deptName',
                  value: 'id',
                  children: 'childList',
                }}
                treeData={depTreeData}
              />
          </Form.Item>
          <Form.Item
            name="positionId"
            label="具体岗位"
            rules={[{ required: true }]}
          >
            <Select>
              {
                positionData.map((i: any) => {
                  return (
                    <Select.Option key={i.value} value={i.value}>{i.label}</Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="idCardFront"
            label="身份证人像面照片"
            rules={[{ required: true }]}
            extra={'请提供有效期范围内的证件，证件需露出四角，请勿遮挡或模糊，确保信息清晰可见'}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={personData.idCardFront}
              customRequest={(params) => uploadFile(params, 'idCardFront')}
              onRemove={(params) => onRemove(params, 'idCardFront')}
            >
              {personData.idCardFront?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="idCardBack"
            label="身份证国徽面照片"
            rules={[{ required: true }]}
            extra={'请提供有效期范围内的证件，证件需露出四角，请勿遮挡或模糊，确保信息清晰可见'}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={personData.idCardBack}
              customRequest={(params) => uploadFile(params, 'idCardBack')}
              onRemove={(params) => onRemove(params, 'idCardBack')}
            >
              {personData.idCardBack?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="userName"
            label="姓名"
            rules={[{ required: true }]}
          >
            <Input placeholder='输入身份证名称' />
          </Form.Item>
          <Form.Item
            name="cardNo"
            label="身份证号码"
            rules={[{ required: true, validator: validateCardId }]}
          >
            <Input placeholder='输入身份证号码'/>
          </Form.Item>
          <Diveder text="资质证件" style={{ marginTop: '30px', marginBottom: '20px' }} />
          <Form.Item
            name="workCard"
            label="健康证"
            rules={[{ required: true }]}
            extra={'证件文字清晰，建议使用原图'}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={personData.workCard}
              customRequest={(params) => uploadFile(params, 'workCard')}
              onRemove={(params) => onRemove(params, 'workCard')}
            >
              {personData.workCard?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="outDate"
            rules={[{ required: true }]}
            label="健康证有效期"
          >
            <DatePicker.RangePicker style={{ width: '70%' }} />
          </Form.Item>
          <div style={{ textAlign: 'center'}}>
          <div onClick={shubmitStaff} className={styles.submitBtn}>提交</div></div>
        </Form>
      </Modal>
    </div>
  );
};
export default List;
