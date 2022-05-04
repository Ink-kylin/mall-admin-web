import request from '@/utils/request'
export function policy() {
  return new Promise((resolve, reject) => {
    return request({
      url: `/thirdParty/oss/policy`,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(err => {
      console.log('出错了...', err)
      reject(false)
    })
  })
}
/* export function policy() {
  return request({
    url: `/thirdParty/oss/policy`,
    method: 'get'
  })
}*/
