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

// 更新员工
export async function updateStaff(
    params: { userId: number; },
  ) {
    return request<any>(`${mainApi}/government/staff/update`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }

// 获取员工
export async function getStaff(
    params: { staffId: number; },
  ) {
    return request<any>(`${mainApi}/government/staff/get`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }
