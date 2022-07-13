import request from '@/utils/request'

export function getAllStore(data) {
  return request({
    url: '/store/storeInfoListByParms',
    method: 'post',
    data
  })
}
export function addStore(data) {
  return request({
    url: '/store/addStore',
    method: 'post',
    data
  })
}

export function updateStore(data) {
  return request({
    url:'/store/updateStore',
    method: 'post',
    data
  })
}

export function deleteStore(id) {
  return request({
    url: '/store/deleteStore?id='+id,
    method: 'post'
  })
}

export function getOrderList(data) {
  return request({
    url: '/order/queryOrderList',
    method: 'post',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: '/order/deleteOrder?id='+id,
    method: 'post'
  })
}

export function addOrder() {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data
  })
}

