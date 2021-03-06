import { login, checkPhone, getSms } from '@/services/kitchen/api';
import { Alert, message, Tabs, Form, Input, Button, InputNumber, Radio } from 'antd';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { history, useModel } from 'umi';
import { throttle } from 'lodash'
import BgImg from '@/assets/images/home_content.png'
import styles from './index.less';

const initCaptchaTime = 5
const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState<string>('mobile');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [captchaTime, setCaptchaTime] = useState<number>(initCaptchaTime);
  const countRef = useRef(captchaTime);
  const [hasCaptcha, setHasCaptcha] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false); // 是否新用户
  const [showCodeTips, setShowCodeTips] = useState<boolean>(false); // 是否新用户
  const intervalRef = useRef();
  const [form] = Form.useForm();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  useEffect(() => {
    countRef.current = captchaTime;  
  });
  const handleSubmit = async (values: any) => {
    history.push('/union/join');
    // try {
    //   // 登录
    //   const msg = await login({ ...values, type });
    //   if (msg.status === 'ok') {
    //     const defaultLoginSuccessMessage = '登录成功！';
    //     message.success(defaultLoginSuccessMessage);
    //     await fetchUserInfo();
    //     /** 此方法会跳转到 redirect 参数所在的位置 */
    //     if (!history) return;
    //     const { query } = history.location;
    //     const { redirect } = query as any;
    //     history.push(redirect || '/');
    //     return;
    //   }
    //   console.log(msg);
    //   // 如果失败去设置用户错误信息
    //   setUserLoginState(msg);
    // } catch (error) {
    //   const defaultLoginFailureMessage = '登录失败，请重试！';
    //   message.error(defaultLoginFailureMessage);
    // }
  };
  const handleGetCaptcha = async (values: any) => {
    setHasCaptcha(true)
    setCaptchaTime(initCaptchaTime)
    getSms({ mobileNo: form.getFieldValue('mobileNo'), smsScene: isNew ? 1 : 2 })
    const captchaInterval = setInterval(() => {
      if (countRef.current === 0) {
        clearInterval(intervalRef.current);
      } else {
        setCaptchaTime(val => val - 1)
      }
    }, 1000);
    intervalRef.current = captchaInterval as any;
  }
  const handleType = (targetType: string) => {
    setType(targetType)
  }
  const handleChangePhone = throttle(async (value: number) => {
    if (`${value}`.length === 11) {
      // 查电话是否注册
      const flag = await checkPhone({ mobileNo: value})
      setIsNew(flag)
    }
  }, 800)
  const handleWeixinCodeHover = (targetType: string) => {
    if (targetType === 'in') {
      setShowCodeTips(true)
    } else {
      setShowCodeTips(false)
    }
  }
  const TabHeaderEle: any = useMemo(() => 
    (
      <Tabs className={styles.tabBox} activeKey={type} onChange={setType}>
      <Tabs.TabPane
        key="mobile"
        tab={<div className={ type === 'mobile' ? styles.actveName : styles.normalName}>
          手机登录</div>}
      />
      <Tabs.TabPane
        key="account"
        tab={<div className={ type === 'account' ? styles.actveName : styles.normalName}>
          密码登录</div>}
      />
    </Tabs>
    ), [type]);
  const CaptchaEle: any = useMemo(() => {
    if (!hasCaptcha) {
      return <div className={`${styles.captcha} ${styles.activeCaptcha}`} onClick={handleGetCaptcha}>获取验证码</div>
    }
    if (captchaTime === 0) {
      return <div className={`${styles.captcha} ${styles.activeCaptcha}`} onClick={handleGetCaptcha}>重新获取</div>
    }
    return <div className={styles.captcha}>重新获取({captchaTime})</div>
  }, [hasCaptcha, captchaTime])
  const AgreeEle: any = () => {
    return (
      <div className={styles.agreementBox}>
      <Radio>
      <div className={styles.agreementContent}>
      已阅读并同意
      <div className={styles.agreement}>《用户协议》</div>
      和<div className={styles.agreement}>《隐私政策》</div></div></Radio></div>
  )}
  const WeixinCodeEle: any = useMemo(() => {
    return (<div className={styles.headerBtn}>
      <div
        className={styles.weixinCode}
        onClick={() => handleType('weixin')}
        onMouseOver={() => handleWeixinCodeHover('in')}
        onMouseOut={() => handleWeixinCodeHover('out')}
      ></div>
      { showCodeTips && <div className={styles.yTips}>{ '微信扫码登录' }</div>}
    </div>)
  }, [type, showCodeTips])
  const CloseEle: any = () => <div className={styles.closeBtn} onClick={() => handleType('mobile')}></div>
  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <div className={styles.homeLogo}></div>
        <div className={styles.name}>食上云安全平台</div>
      </div>
      <img className={styles.bgBox} src={BgImg} />
      <div className={styles.loginBox}>
        {
          (type === 'account' || type === 'mobile') && (
            <>
            { WeixinCodeEle }
            { TabHeaderEle }
            <div className={styles.accountBox}>
              {
                type === 'mobile' && <div className={styles.headerTips}>未注册的手机号验证后自动登录</div>
              }
                <Form
                  form={form}
                  name="horizontal_login"
                  size="large"
                  onFinish={handleSubmit}
                  className={`${type === 'account' && styles.formBox}`}
                >
                  <Form.Item
                    name="mobileNo"
                    rules={[{ required: true, message: '请输入手机号码！' }]}
                  >
                    <InputNumber
                      controls={false}
                      placeholder="输入手机号"
                      onChange={handleChangePhone}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  {
                    type === 'mobile' && <Form.Item>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{ required: true, message: '请输入验证码！' }]}
                      >
                        <Input placeholder="输入验证码" />
                      </Form.Item>
                      <Form.Item noStyle>
                        {CaptchaEle}
                      </Form.Item>
                    </Form.Item>
                  }
                  {
                    (isNew || type === 'account') && <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}
                  >
                    <Input.Password placeholder="输入密码：6位密码，同时包含数字和字母" />
                  </Form.Item>
                  }
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit" block>
                      登录
                    </Button>
                  </Form.Item>
                </Form>
                {
                  (isNew || type === 'mobile') && <AgreeEle />
                }
                {
                  type === 'account' && <div className={styles.forgetPwd} onClick={() => handleType('findAccount')}>忘记密码</div>
                }
            </div>
            </>
          )
        }
        {
          type === 'weixin' && <div className={styles.weixinBox}>
            <div className={styles.accountBtn} onClick={() => handleType('mobile')}></div>
            <div className={styles.title}>微信扫码登录</div>
            <div className={styles.titleTips}>打开微信扫一扫 授权登录</div>
            <div className={styles.codeBox}>
              <img className={styles.codeImg} src={BgImg} />
            </div>
          </div>
        }
        {
          type === 'bindWeixin' && <div className={styles.weixinBox}>
            <CloseEle />
            <div className={styles.title}>绑定微信</div>
            <div className={styles.titleTips}>打开微信扫一扫 授权登录</div>
            <div className={styles.codeBox}>
              <img className={styles.codeImg} src={BgImg} />
            </div>
          </div>
        }
        {
          type === 'bindSuccess' && <div className={styles.weixinBox}>
            <CloseEle />
            <div className={styles.successImg}></div>
            <div className={styles.successTitle}>绑定成功</div>
            <div className={styles.loadingText}>正在跳转…</div>
          </div>
        }
        {
          type === 'bindFail' && <div className={styles.weixinBox}>
          <CloseEle />
          <div className={styles.errorImg}></div>
          <div className={styles.successTitle}>登录失败</div>
          <div className={styles.failText}>该微信为绑定账号，请更换微信扫码或点击右上角账号登录 </div>
          <div className={styles.weixinBtn}>重新扫码</div>
          </div>
        }
        {
          type === 'findAccount' && (
            <div className={`${styles.findAccountBox} ${styles.accountBox}`}>
              <div className={styles.backBox} onClick={() => handleType('account')}>
                <div className={styles.frontIcon}></div>
                <div className={styles.text}>返回</div>
              </div>
              { WeixinCodeEle }
              <div className={styles.backTitle}>手机找回</div>
              <Form
                  form={form}
                  name="horizontal_login"
                  size="large"
                  onFinish={handleSubmit}
                >
                  <Form.Item
                    name="mobileNo"
                    rules={[{ required: true, message: '请输入手机号码！' }]}
                  >
                    <InputNumber
                      controls={false}
                      placeholder="输入手机号"
                      onChange={handleChangePhone}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{ required: true, message: '请输入验证码！' }]}
                      >
                         <InputNumber
                            controls={false}
                            placeholder="输入验证码"
                            style={{ width: '100%' }}
                          />
                      </Form.Item>
                      <Form.Item noStyle>
                        {CaptchaEle}
                      </Form.Item>
                    </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}
                  >
                    <Input.Password placeholder="请输入新密码（1-16字，同时包含数字和" />
                  </Form.Item>
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit" block>
                      登录
                    </Button>
                  </Form.Item>
                </Form>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Login;

