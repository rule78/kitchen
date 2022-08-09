// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getToken } from '@/utils/auth'

const mainApi = '/main-api/main'

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
export async function getAreaTree() {
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
      headers: {
        'userId': getToken(),
      },
      data: {
        ...params,
      },
    });
  }

// 商家员工岗位信息
export async function getStoreStaffPosition() {
    return request<any>(`${mainApi}/store/staff/position`, {
      method: 'GET',
    });
  }

// 店铺员工新增
export async function saveStoreStaff(
  params: any,
) {
    return request<any>(`${mainApi}/store/staff/save`, {
      method: 'POST',
      data: {
        ...params,
      },
      headers: {
        'userId': getToken(),
      },
    });
  }

// 店铺员工更新
export async function updateStoreStaff(
  params: any,
) {
  return request<any>(`${mainApi}/store/staff/update`, {
    method: 'POST',
    headers: {
      'userId': getToken(),
    },
    data: {
      ...params,
    },
  });
}

// 店铺员工查看
export async function getStoreStaffInfo(
  params: { staffId: number; },
) {
  return request<any>(`${mainApi}/store/staff/get`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 商家员工列表查询
export async function getStoreStaffList(
  params: { institutionId?: string; deptId?: string; pageNum: number; pageSize: number },
) {
  return request<any>(`${mainApi}/store/staff/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}