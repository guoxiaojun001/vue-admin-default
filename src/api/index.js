import request from '@/utils/request'

export function getAllStore(data) {
  return request({
    url: '/store/queryAllStore',
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
    url: '/order/queryAllOrder',
    method: 'post',
    data
  })
}
