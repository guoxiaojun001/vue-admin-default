import request from '@/utils/request'



export function getRecords(data) {
  return request({
    url: '/machine/records/selectRecordByParmAndId',
    method: 'post',
    data
  })
}

export function deleteRecord(id) {
  return request({
    url: '/machine/records/deleteWorkRecords?id='+id,
    method: 'post'
  })
}


