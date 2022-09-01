import {
  Button, message, Steps, Form, Input, InputNumber,
  Upload, Select, Row, Col, DatePicker, Radio, TreeSelect } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { formatFile, validateCardId } from '@/utils'
import { uploadApi } from '@/services/kitchen/api' 
import { getAreaTree, getBusinessType, saveStore } from '@/services/kitchen/store';
import Header from '@/components/Header'
import Diveder from '@/components/Y/Divider'
import Tags from '@/components/Y/Tags'
import Address from '@/components/Y/Address'
import UploadList from '@/components/Y/UploadList'
import Agreement from './Agreement'
import { history, useModel } from 'umi';
import styles from './index.less';
import { getMobileNo } from '@/utils/auth'
import { isArray } from 'lodash';
import { request } from 'umi';

const { Step } = Steps;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const steps = [
  {
    title: '主体介绍',
    type: 'introduce',
  },
  {
    title: '企业资质',
    type: 'intelligence',
  },
  {
    title: '签订入驻协议',
    type: 'agreement',
  },
];
const uploadLimitTips = '上传图片格式：支持png、jpg、jpeg格式，图片大小5M'
const Join = () => {
  const { initialState } = useModel('@@initialState');
  const [current, setCurrent] = useState(0);
  const [type, setType] = useState('join');
  const [picList, setPicList] = useState<any>({ storeLogo: [] });
  const [areaTreeData, setAreaTreeData] = useState<any>([]);
  const [isLongEffective, setIsLongEffective] = useState<Boolean>(false); //
  const [businessType, setBusinessType] = useState<any>([]);
  const [introduceForm] = Form.useForm();
  const [introduceData, setIntroduceData] = useState<any>({});
  const [intelligenceForm] = Form.useForm();
  const [intelligenceData, setIntelligenceData] = useState<any>({});
  const [agreement, setAgreement] = useState<Boolean>(false);
  const [agreementForm] = Form.useForm();
  const pageView = useRef(null);
  const next = async () => {
    if (steps[current].type === 'introduce') {
      try {
        const values = await introduceForm.validateFields();
        setIntroduceData((val: any) => ({
          ...val,
          ...values
        }))
        pageView.current.scrollTop = 0;
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
        return
      }
    } else if (steps[current].type === 'intelligence') {
      try {
        const values = await intelligenceForm.validateFields();
        setIntelligenceData((val: any) => ({
          ...val,
          ...values
        }))
        pageView.current.scrollTop = 0;
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
        return
      }
    } else {
      if (!agreement) {
        message.warning('请勾选并阅读协议')
        return
      }
    }
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const toAgree = () => {
    setAgreement(!agreement)
  }
  const handleLongEffective = () => {
    setIsLongEffective(!isLongEffective)
  }
  const onValuesChange = (allValues: any) => {console.log(allValues)}
  const uploadFile = (params: any, uploadType: string) => {
    const formData = new FormData()
    formData.append('file', params.file)
    request<API.RuleList>(uploadApi, {
      method: 'POST',
      requestType: 'form',
      data: formData
    }).then((res: any) => {
      setTimeout(() => {
        setPicList({
          ...picList,
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
    const target = picList[uploadType].filter((i: any) => {
      return i.uid !== uid
    })
    setPicList({
      ...picList,
      [uploadType]: target
    })
  }
  const onFinish = async() => {
    if (!agreement) {
      message.warning('请阅读并勾选协议')
      return
    }
    const {
      cascader, uploadList, detail, storeLogo, ...introduceRes
    } = introduceData
    const { idCardBack, idCardFront, outDate, safeLevelImage,
      qualificationLicense, businessLicense, businessTypeIds,
      ...intelligenceRes } = intelligenceData
    // 营业执照有效期 validStartTime validEndTime isLongEffective
    const target = {
      ...introduceRes,
      ...intelligenceRes,
      storeLogo: formatFile(picList['storeLogo']),
      idCardBack: formatFile(picList['idCardBack']),
      idCardFront: formatFile(picList['idCardFront']),
      safeLevelImage: formatFile(picList['safeLevelImage']),
      businessLicense: formatFile(picList['businessLicense']),
      qualificationLicense: formatFile(picList['qualificationLicense']),
      imageDoorUrl: formatFile(uploadList['first']),
      imageCanteenUrl: formatFile(uploadList['second']),
      imageKitchenUrl: formatFile(uploadList['third']),
      businessTypeIds: [businessTypeIds]
    }
     // 省市区乡镇/街道 provinceId cityId areaId townshipId address
    target['provinceId'] = cascader[0]
    target['cityId'] = cascader[1]
    target['areaId'] = cascader[2]
    target['townshipId'] = cascader[3]
    target['address'] = detail
    if (!isLongEffective) {
      target['validStartTime'] = new Date(outDate[0]).getTime()
      target['validEndTime'] = new Date(outDate[1]).getTime()
    }
    target['isLongEffective'] = isLongEffective ? 1 : 0
    target['mobileNo'] = getMobileNo()
    try {
      const res = await saveStore(target)
      if (res.message === 'success') {
        message.success('提交成功！');
        setTimeout(() => {
          history.push('/union/index');
        }, 3000)
      } else {
        message.error(res.message);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      return
    }
  }
  const handleToJoin = async() => {
    setType('joinStep')
    const productRes = await getBusinessType()
    setBusinessType(productRes.data)
    // 设置区域原数据
    const areaRes = await getAreaTree()
    setAreaTreeData(areaRes.data)
  }
  const validatMainType = (_, value: any) => {
    if (value && isArray(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('请选择主营产品'))
    }
  }
  const validatShop = (_, value: any) => {
    if (value && value.first?.length > 0 && value.second?.length > 0 && value.third?.length > 0) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('请上传三张店铺形象照片'))
    }
  }
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
  const validatNumber = (_, value: any) => {
    const p = /^[0-9]+$/
    if (!value) {
      return Promise.reject(new Error('不可以为空'))
    }
    if (p.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('只支持阿拉伯数字'))
    }
  }
  const validateDate = (_, value: any) => {
    if (!value && !isLongEffective) {
      return Promise.reject(new Error('选择时间段或者勾选长期！'))
    }
    return Promise.resolve()
  }
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 30;
    if (!isLt2M) {
      message.error('上传图片需要小于 30MB!')
    }
    return isJpgOrPng && isLt2M;
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  const ContentEle: any = () => {
    if (steps[current].type === 'introduce') {
      return <div>
        <Diveder text="主体经营管理主要负责人信息" style={{ marginTop: '54px', marginBottom: '21px' }} />
        <Form
          name="basic"
          {...formItemLayout}
          form={introduceForm}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="入驻申请帐号"
            name="mobileNo"
          >
            <>
            <div className={styles.phoneNumber}>{ initialState?.currentUser?.mobileNo }</div>
            <div className={styles.bottomTips}>申请入驻帐户将成为该经营主体所有权限帐户，拥有该经营主体在食上安全云平台最高管理权限，如需更换，请点击右上角退出登录更换帐号。</div>
            </>
          </Form.Item>
          <Form.Item
            label="主体负责人实名认证"
            name="userName"
            rules={[{ required: true, message: '请输入姓名!' }]}
            extra="经营主体的负责人，可以是法人，可以是经营主体的负责人"
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="主体负责人身份证号"
            name="cardNo"
            rules={[{ required: true, validator: validateCardId }]}
          >
            <Input
              placeholder="请输入身份证号码"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Diveder text="店铺简介" style={{ marginTop: '44px', marginBottom: '21px' }} />
          <Form.Item
            label="店铺LOGO"
            name="storeLogo"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={picList.storeLogo}
              beforeUpload={beforeUpload}
              customRequest={(params) => uploadFile(params, 'storeLogo')}
              onRemove={(params) => onRemove(params, 'storeLogo')}
            >
              {picList.storeLogo?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="店铺简称"
            name="storeName"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入店铺简称" />
          </Form.Item>
          <Form.Item
            label="主体类型"
            name="businessTypeIds"
            rules={[{ required: true, message: '请选择主体类型!' }]}
          >
             <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={businessType}
              placeholder="请选择主体类型"
              fieldNames={{
                label: 'businessName',
                value: 'id',
                children: 'childList'
              }}
            />
          </Form.Item>
          <Form.Item
            label="主营产品"
            name="productTypeName"
            rules={[
              { required: true, validator: validatMainType  }
            ]}
          >
            <Tags />
          </Form.Item>
          <Form.Item
            label="店铺地址"
            name="cascader"
            rules={[{ required: true, message: '请填写店铺地址!' }]}
          >
            <Form.Item
              name="cascader"
              noStyle
            >
              <Address options={areaTreeData} />
            </Form.Item>
            <Form.Item
              name="detail"
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              <Input placeholder="详细地址" />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="店铺形象"
            name="uploadList"
            rules={[{ required: true, validator: validatShop }]}
          >
            <UploadList />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <div className={styles.submitBtn} onClick={() => next()}> 
              下一步</div>
          </Form.Item>
        </Form>
      </div>
    }
    if (steps[current].type === 'intelligence') {
      return <>
        <Form
          name="intelligence"
          {...formItemLayout}
          form={intelligenceForm}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Diveder text="营业执照" style={{ marginTop: '54px', marginBottom: '21px' }} />
          <Form.Item
            label="营业执照"
            name="businessLicense"
            rules={[{ required: true, message: '请上传营业执照！' }]}
            extra="证件文字清晰，建议使用原图"
          >
            <Upload
              maxCount={1}
              listType="picture-card"
              fileList={picList.businessLicense}
              beforeUpload={beforeUpload}
              customRequest={(params) => uploadFile(params, 'businessLicense')}
              onRemove={(params) => onRemove(params, 'businessLicense')}
            >
              {picList.businessLicense?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="统一社会信用代码"
            name="creditCode"
            rules={[{ required: true, validator: validatCode }]}
          >
            <Input placeholder="请输入营业执照上的注册或统一社会信用代码" />
          </Form.Item>
          <Form.Item
            label="营业执照名称"
            name="licenseName"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入营业执照“名称”一栏的内容" />
          </Form.Item>
          <Form.Item
            label="营业执照有效期"
            name="outDate"
            rules={[{ required: true, validator: validateDate }]}
          >
            <Row gutter={8}>
              <Col span={15}>
                <Form.Item
                  name="outDate"
                  noStyle
                >
                  <DatePicker.RangePicker
                    disabled={isLongEffective}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={6} className={styles.dateType}>
                <div className={styles.agreeBox} onClick={handleLongEffective}>
                  <div className={styles.RadioBox}>
                    {
                      isLongEffective && <div className={styles.Radio}></div>
                    }
                  </div>
                  <div className={styles.text}>长期</div>
                </div>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="法人身份证照片人像面"
            name="idCardFront"
            rules={[{ required: true }]}
            extra="请提供有效期范围内的证件，证件需露出四角"
          >
             <Upload
                 maxCount={1}
                 listType="picture-card"
                 fileList={picList.idCardFront}
                 beforeUpload={beforeUpload}
                 customRequest={(params) => uploadFile(params, 'idCardFront')}
                 onRemove={(params) => onRemove(params, 'idCardFront')}
            >
              {picList.idCardFront?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="法人身份证照片国徽面"
            name="idCardBack"
            rules={[{ required: true }]}
            extra="请提供有效期范围内的证件，证件需露出四角"
          >
             <Upload
                maxCount={1}
                listType="picture-card"
                fileList={picList.idCardBack}
                beforeUpload={beforeUpload}
                customRequest={(params) => uploadFile(params, 'idCardBack')}
                onRemove={(params) => onRemove(params, 'idCardBack')}
            >
              {picList.idCardBack?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="法人姓名"
            name="legalPersonName"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入营业执照上的法人姓名" />
          </Form.Item>
          <Form.Item
            label="法人身份证号"
            name="legalPersonCardNo"
            rules={[{ required: true, validator: validateCardId }]}
          >
            <Input placeholder="请输入法人身份证号" style={{ width: '100%' }} />
          </Form.Item>
          <Diveder text="资质证件" style={{ marginTop: '44px', marginBottom: '21px' }} />
          <Form.Item
            label="食品安全等级"
            name="safeLevelImage"
            rules={[{ required: true }]}
            extra="证件文字清晰，建议使用原图"
          >
             <Upload
                maxCount={1}
                listType="picture-card"
                fileList={picList.safeLevelImage}
                beforeUpload={beforeUpload}
                customRequest={(params) => uploadFile(params, 'safeLevelImage')}
                onRemove={(params) => onRemove(params, 'safeLevelImage')}
              >
              {picList.safeLevelImage?.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="资质许可证书"
            name="qualificationLicense"
            extra="证件文字清晰，建议使用原图"
          >
             <Upload
                maxCount={1}
                listType="picture-card"
                fileList={picList.qualificationLicense}
                beforeUpload={beforeUpload}
                customRequest={(params) => uploadFile(params, 'qualificationLicense')}
                onRemove={(params) => onRemove(params, 'qualificationLicense')}
              >
              {picList.qualificationLicense?.length >= 1 ? null : uploadButton}
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
        <Form
          name="agreement"
          form={agreementForm}
          onValuesChange={onValuesChange}
          autoComplete="off"
        >
          <Form.Item
            name="protocol"
            noStyle
          >
            <div className={styles.agreementBox}>
              <Agreement />
            </div>
          </Form.Item>
          <Form.Item
            name="agree"
            rules={[{ required: true, message: '请阅读并同意！' }]}
          >
            <div className={styles.agreeBox} onClick={toAgree}>
              <div className={styles.RadioBox}>
                {
                  agreement && <div className={styles.Radio}></div>
                }
              </div>
              <div className={styles.text}>已阅读并同意协议</div>
            </div>
          </Form.Item>
        </Form>
        <div className={styles.btnBox}>
          <div className={styles.preBtn} onClick={prev}>上一步</div>
          <div className={styles.nextBtn} onClick={onFinish}>提 交</div>
        </div>
      </div>
    </>
  }
  return (
    <div className={styles.joinContainer}>
      <Header />
      {
        type === 'join' && <div className={styles.joinBox}>
        <div className={styles.cardBox}>
          <div className={styles.title}>申请入驻</div>
          <div className={styles.cardContent}>
            <div className={styles.contentBg}></div>
            <div className={styles.relativeBox}>
              <div className={styles.logo}></div>
              <div className={styles.joinTitle}>经营主体入驻</div>
              <div className={styles.text1}>适用于经营主体</div>
              <div className={styles.text2}>提交营业执照与企业资质证明</div>
              <div onClick={() => handleToJoin()} className={styles.btn}>建立诚信经营档案</div>
            </div>
          </div>
        </div>
        </div>
      }
      {
        type === 'joinStep' && <div className={styles.joinBox} ref={pageView}>
          <div className={styles.stepBox}>
            <div className={styles.header}>
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </div>
            <div className={styles.stepsContent}><ContentEle /></div>
          </div>
      </div>
      }
    </div>
  );
};

export default Join;