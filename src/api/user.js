import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/userLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUsers(data) {
  return request({
    url: '/user/selectUserInfoByParmAndStoreCount',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url:'/user/updateUserInfo',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/deleteUser?userId='+id,
    method: 'post'
  })
}

export function deviceRanking() {
  return request({
    url: '/machine/deviceRanking',
    method: 'post'
  })
}
export function deviceMapDisplay() {
  return request({
    url: '/machine/deviceMapDisplay',
    method: 'post'
  })
}
