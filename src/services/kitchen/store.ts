// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

const mainApi = '/main-api/main/'

// 新增员工
export async function createStaff(
    params: { userId: number; },
  ) {
    return request<any>(`${mainApi}/government/staff/save`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }

// 获取省市区乡镇层级树
export async function updateStaff() {
    return request<any>(`${mainApi}/store/areaTree`, {
      method: 'GET',
    });
  }

// 主体类型查询
export async function getBusinessType() {
    return request<any>(`${mainApi}/store/getBusinessType`, {
      method: 'GET',
    });
  }

// 主营品类查询
export async function getProductType() {
    return request<any>(`${mainApi}/store/getProductType`, {
      method: 'GET',
    });
  }

// 商家入驻
export async function saveStore(
    params: { userId: number; },
) {
    return request<any>(`${mainApi}/store/save`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }

// 商家员工岗位信息
export async function getStaffInfo() {
    return request<any>(`${mainApi}/store/staff/position`, {
      method: 'get',
    });
  }

// 店铺员工新增
export async function saveStaff(
    params: { userId: number; },
) {
    return request<any>(`${mainApi}/store/staff/save`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }