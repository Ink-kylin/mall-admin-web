import request from '@/utils/request'

export function getSingle(brandId) {
  return request({
    url: `/product/brand/getSingle/${brandId}`,
    method: 'get'
  })
}

export function getList(pageIndex, pageSize) {
  return request({
    url: '/product/brand/getList',
    method: 'get',
    params: {
      'page': pageIndex,
      'limit': pageSize
    }
  })
}

export function createHandle(category) {
  return request({
    url: '/product/brand/createHandle',
    method: 'post',
    data: category
  })
}

export function updateHandle(category) {
  return request({
    url: '/product/brand/updateHandle',
    method: 'put',
    data: category
  })
}
export function deleteHandle(array) {
  return request({
    url: '/product/brand/deleteHandle',
    method: 'delete',
    data: array
  })
}
