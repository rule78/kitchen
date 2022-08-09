// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getToken } from '@/utils/auth'
const mainApi = '/main-api/main'
const systemApi = '/sys-api/system'

// 
export const uploadApi = `${systemApi}/tool/oss/upload`
// 部门树
export async function getDeptTree(
  params: { identityType: string; relateId: string; },
) {
  return request<any>(`${systemApi}/department/deptTree`, {
    method: 'GET',
    params: {
      ...params,
    },
    headers: {
      'userId': getToken(),
    },
  });
}

// 注册用户
export async function goRegister(
  params: { mobileNo?: number; password: string; isCheckCode?: boolean },
) {
  return request<any>(`${systemApi}/user/register`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 新增部门
export async function saveDepartment(
  params: any,
) {
  return request<any>(`${systemApi}/department/save`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 新增部门
export async function updateDepartment(
  params: any,
) {
  return request<any>(`${systemApi}/department/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 账号密码登录
export async function goLogin(
  params: { mobileNo: number; password?: string; isCheckCode?: boolean },
) {
  return request<any>(`${systemApi}/user/login`, {
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
  return request<any>(`${systemApi}/user/updatePassword`, {
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
  return request<any>(`${systemApi}/user/existUser`, {
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
  return request<any>(`${systemApi}/user/sendSms`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 获取当前的用户 GET /api/currentUser */
// 身份类型 1、商家店铺 2、连锁/合作机构 3、政府机构
export async function currentUser() {
  return request<any>(`${mainApi}/identity/get`, {
    method: 'GET',
    headers: {
      'userId': getToken(),
    },
  });
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

// 
export  function uploadFile(params: any) {
  const { onSuccess } = params
  const formData = new FormData()
  formData.append('file', params.file)
  request<API.RuleList>(`${systemApi}/tool/oss/upload`, {
    method: 'POST',
    requestType: 'form',
    data: formData
  }).then((res: any) => {
    setTimeout(() => {
      onSuccess({
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: res.data
      }); 
    })
  })
}
