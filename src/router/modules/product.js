import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/classify',
  name: 'Product',
  meta: {
    title: 'Product',
    icon: 'form'
  },
  children: [
    {
      path: 'classify',
      component: () => import('@/views/product/classify'),
      name: 'Classify',
      meta: { title: 'Classify', icon: 'form', noCache: true }
    },
    {
      path: 'brand',
      component: () => import('@/views/product/brand'),
      name: 'Brand',
      meta: { title: 'Brand', icon: 'form' }
    }
  ]
}

export default productRouter

