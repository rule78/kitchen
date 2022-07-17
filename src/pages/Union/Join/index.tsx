import {
  Button, message, Steps, Form, Input, InputNumber,
  Upload, Select, Row, Col, DatePicker, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useMemo } from 'react';
import { uploadApi } from '@/dictionary'
import Header from '@/components/Header'
import Diveder from '@/components/Y/Divider'
import Tags from '@/components/Y/Tags'
import Address from '@/components/Y/Address'
import UploadList from '@/components/Y/UploadList'
import styles from './index.less';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const DPicker: any = DatePicker
const steps = [
  {
    title: 'First',
    type: 'introduce',
  },
  {
    title: 'Second',
    type: 'intelligence',
  },
  {
    title: 'Last',
    type: 'agreement',
  },
];
const Join = () => {
  const [current, setCurrent] = useState(0);
  const [type, setType] = useState('joinStep');
  const [introduceData, setIntroduceData] = useState<any>({});
  const [intelligenceData, setIntelligenceData] = useState<any>({});
  const [form] = Form.useForm();
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const onValuesChange = (allValues: any) => {console.log(allValues)}
  const onFinish = () => {}
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  const ContentEle: any = useMemo(() => {
    if (steps[current].type === 'introduce') {
      return <div>
        <Diveder text="店铺经营者账号信息" style={{ marginTop: '54px', marginBottom: '21px' }} />
        <Form
          name="basic"
          {...formItemLayout}
          initialValues={introduceData}
          form={form}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="手机号码"
            name="phone"
            rules={[{ required: true }]}
          >
            <>
            <div className={styles.phoneNumber}>18655556666</div>
            <div className={styles.bottomTips}>申请账号将成为店铺所有者账号，拥有该店铺在食上云平台最高管理权限，如需更换，请点击右上角退出登录更换账号。</div>
            </>
          </Form.Item>
          <Form.Item
            label="经营者姓名"
            name="phone"
            rules={[{ required: true, message: '请输入经营者姓名!' }]}
          >
            <Input placeholder="请输入经营者姓名" />
          </Form.Item>
          <Form.Item
            label="经营者身份证号"
            name="phone"
            rules={[{ required: true, message: '请输入身份证号码!' }]}
          >
            <InputNumber
              controls={false}
              placeholder="请输入身份证号码"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Diveder text="店铺简介" style={{ marginTop: '44px', marginBottom: '21px' }} />
          <Form.Item
            label="店铺LOGO"
            name="phone"
          >
            <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={introduceData.fileList}
            >
              {introduceData.fileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="店铺简介"
            name="detail"
            rules={[{ required: true, message: '请输入店铺简介!' }]}
          >
            <Input placeholder="请输入店铺简介" />
          </Form.Item>
          <Form.Item
            label="经营类型"
            name="homeType"
            rules={[{ required: true, message: '请选择经营类型!' }]}
          >
            <Select
              placeholder="请选择经营类型"
            >
              <Option value="male">male</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="主营产品"
            name="tag"
            rules={[{ required: true, message: '请选择主营产品!' }]}
          >
            <Tags />
          </Form.Item>
          <Form.Item
            label="店铺地址"
            name="address"
            rules={[{ required: true, message: '请填写店铺地址!' }]}
          >
            <Address />
          </Form.Item>
          <Form.Item
            label="店铺形象"
            name="uploadList"
          >
            <UploadList />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <div className={styles.submitBtn} onClick={next}>下一步</div>
          </Form.Item>
        </Form>
      </div>
    }
    if (steps[current].type === 'intelligence') {
      return <>
        <Form
          name="basic"
          {...formItemLayout}
          initialValues={intelligenceData}
          form={form}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Diveder text="营业执照" style={{ marginTop: '54px', marginBottom: '21px' }} />
          <Form.Item
            label="营业执照"
            name="phone"
            rules={[{ required: true, message: '请上传营业执照！' }]}
            extra="证件文字清晰，建议使用原图"
          >
            <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={intelligenceData.fileList}
            >
              {intelligenceData.fileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="统一社会信用代码"
            name="societyCode"
          >
            <Input placeholder="请输入营业执照上的注册或统一社会信用代码" />
          </Form.Item>
          <Form.Item
            label="营业执照名称"
            name="societyCode"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入营业执照“名称”一栏的内容" />
          </Form.Item>
          <Form.Item
            label="营业执照有效期"
            name="outDate"
            rules={[{ required: true }]}
          >
            <Row gutter={8}>
              <Col span={15}>
                <Form.Item
                  name="outDate"
                  noStyle
                >
                   <DPicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6} className={styles.dateType}>
                <Form.Item name="dateType" noStyle>
                  <Radio value="long">长期</Radio>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="法人身份证照片"
            name="societyPic"
            rules={[{ required: true }]}
            extra="请提供有效期范围内的证件，证件需露出四角"
          >
             <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={intelligenceData.fileList}
            >
              {intelligenceData.fileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="法人姓名"
            name="societyName"
          >
            <Input placeholder="请输入营业执照上的法人姓名" />
          </Form.Item>
          <Form.Item
            label="法人身份证号"
            name="societyNumber"
          >
            <InputNumber placeholder="请输入法人身份证号" style={{ width: '100%' }} />
          </Form.Item>
          <Diveder text="资质证件" style={{ marginTop: '44px', marginBottom: '21px' }} />
          <Form.Item
            label="食品安全等级"
            name="safePic"
            rules={[{ required: true }]}
            extra="证件文字清晰，建议使用原图"
          >
             <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={intelligenceData.fileList}
            >
              {intelligenceData.fileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="资质许可证书"
            name="zihizPic"
            rules={[{ required: true }]}
            extra="证件文字清晰，建议使用原图"
          >
             <Upload
              action={uploadApi}
              listType="picture-card"
              fileList={intelligenceData.fileList}
            >
              {intelligenceData.fileList?.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <div className={styles.preBtn} onClick={prev}>上一步</div>
            <div className={styles.nextBtn} onClick={next}>下一步</div>
          </Form.Item>
        </Form>
      </>
    }
    return <>
      <Diveder text="签订入驻协议" style={{ marginTop: '54px', marginBottom: '21px' }} />
      <div className={styles.agreementContent}>
        <TextArea rows={8} style={{ marginBottom: '16px' }} />
        <Radio value="agree">已阅读并同意协议</Radio>
        <div className={styles.btnBox}>
          <div className={styles.preBtn} onClick={prev}>上一步</div>
          <div className={styles.nextBtn} onClick={next}>提 交</div>
        </div>
      </div>
    </>
  }, [current])
  return (
    <div className={styles.joinContainer}>
      <Header />
      {
        type === 'join' && <div className={styles.joinBox}>
        <div className={styles.cardBox}>
          <div className={styles.title}>申请入住</div>
          <div className={styles.cardContent}>
            <div className={styles.contentBg}></div>
            <div className={styles.relativeBox}>
              <div className={styles.logo}></div>
              <div className={styles.joinTitle}>商家入驻</div>
              <div className={styles.text1}>适用于商家店铺</div>
              <div className={styles.text2}>需提交营业执照与商家资质证明</div>
              <div className={styles.btn}>商家入驻</div>
            </div>
          </div>
        </div>
        </div>
      }
      {
        type === 'joinStep' && <div className={styles.joinBox}>
          <div className={styles.stepBox}>
            <div className={styles.header}>
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </div>
            <div className={styles.stepsContent}>{ContentEle}</div>
          </div>
      </div>
      }
    </div>
  );
};

export default Join;