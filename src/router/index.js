import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/role',
    alwaysShow: true,
    name: 'User',
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/index',
    alwaysShow: true,
    name: 'Shop',
    meta: { title: '门店管理', icon: 'tab'},
    children: [
      {
        path: 'index',
        name: 'ShopIndex',
        component: () => import('@/views/shop/index'),
        meta: { title: '我的门店', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    alwaysShow: true,
    name: 'Example',
    meta: { title: '设备管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '我的设备', icon: 'table' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    alwaysShow: true,
    name: 'Order',
    meta: { title: '订单管理', icon: 'list' },
    children: [
      {
        path: 'index',
        name: 'OrderIndex',
        component: () => import('@/views/order/index'),
        meta: { title: '我的订单', icon: 'form' }
      }
    ]
  },

  {
    path: '/record',
    component: Layout,
    redirect: '/record/index',
    alwaysShow: true,
    name: 'Record',
    meta: { title: '使用记录', icon: 'list' },
    children: [
      {
        path: 'index',
        name: 'RecordIndex',
        component: () => import('@/views/record/index'),
        meta: { title: '使用记录', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
  ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
