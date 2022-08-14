
import cooperatePng from '@/assets/images/cooperate.png'
import governmentPng from '@/assets/images/government.png'
import shopPng from '@/assets/images/shop.png'

export const uploadApi = 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
// 'http://dve.985cn.com/main-api/system/tool/oss/upload'
// 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
// http://dve.985cn.com/main-api/system/tool/oss/upload

export const unionList = [
  {
    title: '商家店铺',
    desc: '商家店铺是实体门店 ，进入可直接管理门店',
    type: 'shop',
    value: 1,
    icon: shopPng
  },
  {
    title: '连锁/合作机构',
    desc: '连锁/合作机构是连锁经营 ，进入可监督经',
    type: 'cooperate',
    value: 2,
    icon: cooperatePng
  },
  {
    title: '政府机构',
    desc: '政府机构是各地方政府 ，进入可监督各地方',
    type: 'government',
    value: 3,
    icon: governmentPng
  },
]