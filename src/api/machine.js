import request from '@/utils/request'

export function getMachine(data) {
  return request({
    url: '/machine/commonSearchMachineList',
    method: 'post',
    data
  })
}

export function addMachine(data) {
  return request({
    url: '/machine/addMachine',
    method: 'post',
    data
  })
}

export function updateMachine(data) {
  return request({
    url:'/machine/updateMachine',
    method: 'post',
    data
  })
}

export function deleteMachine(id) {
  return request({
    url: '/machine/deleteMachine?id='+id,
    method: 'post'
  })
}

export function sendMachine(data){
  return request({
    url: '/mqtt/sendMQ',
    method: 'post',
    data
  })
}
