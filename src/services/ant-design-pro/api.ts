// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

// 注册
export async function goRegister(
  params: { mobileNo?: number; password: string; },
) {
  return request<any>('/mock/18/user/register', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 账号密码登录
export async function goLogin(
  params: { mobileNo: number; password: string; },
) {
  return request<any>('/mock/18/user/login', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 忘记密码
export async function updatePassword(
  params: { mobileNo: number; password: string; },
) {
  return request<any>('/mock/18/user/updatePassword', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 校验手机号码是否被注册
export async function checkPhone(
  params: { mobileNo?: number; },
) {
  return request<any>('/mock/18/user/existUser', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 1、注册 2、登录
type smsSceneType = 1 | 2
// 发送阿里云短信验证码
export async function getSms(
  params: { mobileNo: number; smsScene: smsSceneType },
) {
  return request<any>('/mock/18/user/sendSms', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 获取用户身份信息
export async function getUserInfo(userId: number) {
  return request<any>('/mock/18/identity/get', {
    method: 'GET',
    head: {
      'userId': userId,
      },
  });
}

/** 获取当前的用户 GET /api/currentUser */
// 身份类型 1、商家店铺 2、连锁/合作机构 3、政府机构
export async function currentUser(options?: { [key: string]: any }) {
  return {
    data: {
      name: 'yanglilililii',
      identityType: 1,
      relateId: 999,
    }
  }
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return {
    status: 'successful',
    type: 'normal',
    currentAuthority: 'admin',
  }
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


// 获取省市区乡镇层级树
export async function getAreaTree() {
  return request<any>('/mock/18/store/areaTree', {
    method: 'GET',
  });
}