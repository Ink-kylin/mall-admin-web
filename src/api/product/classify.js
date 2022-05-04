import request from '@/utils/request'

export function getNode(catId) {
  return request({
    url: `/product/category/category/getNode/${catId}`,
    method: 'get'
  })
}

export function getTree() {
  return request({
    url: '/product/category/getTree',
    method: 'get'
  })
}

export function appendNode(category) {
  return request({
    url: '/product/category/appendNode',
    method: 'post',
    data: category
  })
}

export function updateNode(category) {
  return request({
    url: '/product/category/updateNode',
    method: 'put',
    data: category
  })
}
export function DeleteBatchNodes(array) {
  return request({
    url: '/product/category/DeleteBatchNodes',
    method: 'delete',
    data: array
  })
}
