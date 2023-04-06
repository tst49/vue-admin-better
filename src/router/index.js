/**
 * @author https://vue-admin-beautiful.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/loginModule/login'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/loginModule/register'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/learning',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Learning',
    alwaysShow: true,
    meta: { title: '学习', icon: 'box-open' },
    children: [
      {
        path: '/onlineAlgorithm',
        name: 'OnlineAlgorithm',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '在线算法',
          permissions: ['admin', 'editor'],
        },
      },
      {
        path: '/article/index',
        name: 'ArticleIndex',
        component: () => import('@/views/learningModule/articleIndex'),
        meta: {
          title: '资料库',
          permissions: ['admin'],
        },
      },
      {
        path: '/article/edit',
        name: 'ArticleEdit',
        hidden: true,
        component: () => import('@/views/learningModule/articleEdit'),
        meta: {
          title: '资料库编辑',
          permissions: ['admin'],
        },
      },
      {
        path: '/article/detail',
        name: 'ArticleDetail',
        hidden: true,
        component: () => import('@/views/learningModule/articleDetail'),
        meta: {
          title: '资料库详情',
          permissions: ['admin'],
        },
      },
    ],
  },
  {
    path: '/testing',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Testing',
    alwaysShow: true,
    meta: { title: '题库', icon: 'box-open' },
    children: [
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/testingModule/testPaper'),
        meta: {
          title: '全部题目',
          permissions: ['admin', 'editor'],
        },
      },
      {
        path: 'spesial',
        name: 'Spesial',
        component: () => import('@/views/testingModule/index'),
        meta: {
          title: '专项练习',
          permissions: ['admin'],
        },
      },
      {
        path: 'paper',
        name: 'Paper',
        component: () => import('@/views/testingModule/testPaperIndex'),
        meta: {
          title: '生成试卷',
          permissions: ['admin'],
        },
      },
    ],
  },
  {
    path: '/standings',
    component: Layout,
    redirect: '/noRedirect',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '积分榜',
          icon: 'home',
          permissions: ['admin'],
        },
      },
    ],
  },
  {
    path: '/personalCenter',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PersonalCenter',
    alwaysShow: true,
    meta: { title: '个人主页', icon: 'box-open' },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/personalCenter/info'),
        meta: {
          title: '个人资料',
          permissions: ['admin', 'editor'],
        },
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '个人设置',
          permissions: ['admin'],
        },
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '收藏夹',
          permissions: ['admin'],
        },
      },
      {
        path: 'myDiscuss',
        name: 'MyDiscuss',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '我的讨论',
          permissions: ['admin'],
        },
      },
      {
        path: 'myTask',
        name: 'MyTask',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '我的学习任务',
          permissions: ['admin'],
        },
      },
      {
        path: 'testAnalysis',
        name: 'TestAnalysis',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '做题分析',
          permissions: ['admin'],
        },
      },
      {
        path: 'myPoints',
        name: 'MyPoints',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '我的积分',
          permissions: ['admin'],
        },
      },
      {
        path: 'myClazz',
        name: 'MyClazz',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '我的班级',
          permissions: ['admin'],
        },
      },
      {
        path: 'myPublish',
        name: 'MyPublish',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '我发布的任务',
          permissions: ['admin'],
        },
      },
    ],
  },
  {
    path: '/managementCenter',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PersonalCenter',
    alwaysShow: true,
    meta: { title: '管理中心', icon: 'box-open' },
    children: [
      {
        path: 'studentManagement',
        name: 'StudentManagement',
        component: () => import('@/views/personalCenter/info'),
        meta: {
          title: '学生管理',
          permissions: ['admin', 'editor'],
        },
      },
      {
        path: 'clazzManagement',
        name: 'ClazzManagement',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '班级管理',
          permissions: ['admin'],
        },
      },
      {
        path: 'literatureManagement',
        name: 'LiteratureManagement',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '资料库管理',
          permissions: ['admin'],
        },
      },
      {
        path: 'questionManagement',
        name: 'QuestionManagement',
        component: () => import('@/views/managementModule/questionManagement'),
        meta: {
          title: '题库管理',
          permissions: ['admin'],
        },
      },
      {
        path: 'discussManagement',
        name: 'DiscussManagement',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '讨论区管理',
          permissions: ['admin'],
        },
      },
      {
        path: 'pointsRulesManagement',
        name: 'PointsRulesManagement',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '积分规则管理',
          permissions: ['admin'],
        },
      },
    ],
  },
  /* {
    path: "/test",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "test",
        name: "Test",
        component: () => import("@/views/test/index"),
        meta: {
          title: "test",
          icon: "marker",
          permissions: ["admin"],
        },
      },
    ],
  }, */

  {
    path: '/vab',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Vab',
    alwaysShow: true,
    meta: { title: '组件', icon: 'box-open' },
    children: [
      {
        path: 'permissions',
        name: 'Permission',
        component: () => import('@/views/vab/permissions/index'),
        meta: {
          title: '角色权限',
          permissions: ['admin', 'editor'],
        },
      },
      {
        path: 'icon',
        component: EmptyLayout,
        redirect: 'noRedirect',
        name: 'Icon',
        meta: {
          title: '图标',
          permissions: ['admin'],
        },
        children: [
          {
            path: 'awesomeIcon',
            name: 'AwesomeIcon',
            component: () => import('@/views/vab/icon/index'),
            meta: { title: '常规图标' },
          },
          {
            path: 'colorfulIcon',
            name: 'ColorfulIcon',
            component: () => import('@/views/vab/icon/colorfulIcon'),
            meta: { title: '多彩图标' },
          },
        ],
      },
      {
        path: 'table',
        component: () => import('@/views/vab/table/index'),
        name: 'Table',
        meta: {
          title: '表格',
          permissions: ['admin'],
        },
      },
      {
        path: 'map',
        component: () => import('@/views/vab/map/index'),
        name: 'Map',
        meta: {
          title: '地图',
          permissions: ['admin'],
        },
      },

      {
        path: 'webSocket',
        name: 'WebSocket',
        component: () => import('@/views/vab/webSocket/index'),
        meta: { title: 'webSocket', permissions: ['admin'] },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/vab/form/index'),
        meta: { title: '表单', permissions: ['admin'] },
      },
      {
        path: 'element',
        name: 'Element',
        component: () => import('@/views/vab/element/index'),
        meta: { title: '常用组件', permissions: ['admin'] },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/vab/tree/index'),
        meta: { title: '树', permissions: ['admin'] },
      },
      {
        path: 'menu1',
        component: () => import('@/views/vab/nested/menu1/index'),
        name: 'Menu1',
        alwaysShow: true,
        meta: {
          title: '嵌套路由 1',
          permissions: ['admin'],
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu1-1',
            alwaysShow: true,
            meta: { title: '嵌套路由 1-1' },
            component: () => import('@/views/vab/nested/menu1/menu1-1/index'),

            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu1-1-1',
                meta: { title: '嵌套路由 1-1-1' },
                component: () =>
                  import('@/views/vab/nested/menu1/menu1-1/menu1-1-1/index'),
              },
            ],
          },
        ],
      },
      {
        path: 'loading',
        name: 'Loading',
        component: () => import('@/views/vab/loading/index'),
        meta: { title: 'loading', permissions: ['admin'] },
      },
      {
        path: 'backToTop',
        name: 'BackToTop',
        component: () => import('@/views/vab/backToTop/index'),
        meta: { title: '返回顶部', permissions: ['admin'] },
      },
      {
        path: 'lodash',
        name: 'Lodash',
        component: () => import('@/views/vab/lodash/index'),
        meta: { title: 'lodash', permissions: ['admin'] },
      },
      {
        path: 'smallComponents',
        name: 'SmallComponents',
        component: () => import('@/views/vab/smallComponents/index'),
        meta: { title: '小组件', permissions: ['admin'] },
      },

      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/vab/upload/index'),
        meta: { title: '上传', permissions: ['admin'] },
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/vab/errorLog/index'),
        meta: { title: '错误日志模拟', permissions: ['admin'] },
      },
      {
        path: 'https://github.com/chuzhixin/vue-admin-beautiful?utm_source=gold_browser_extension',
        name: 'ExternalLink',
        meta: {
          title: '外链',
          target: '_blank',
          permissions: ['admin', 'editor'],
          badge: 'New',
        },
      },
      {
        path: 'more',
        name: 'More',
        component: () => import('@/views/vab/more/index'),
        meta: { title: '关于', permissions: ['admin'] },
      },
    ],
  },
  {
    path: '/personnelManagement',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PersonnelManagement',
    meta: { title: '配置', icon: 'users-cog', permissions: ['admin'] },
    children: [
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () =>
          import('@/views/personnelManagement/userManagement/index'),
        meta: { title: '用户管理' },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () =>
          import('@/views/personnelManagement/roleManagement/index'),
        meta: { title: '角色管理' },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: () =>
          import('@/views/personnelManagement/menuManagement/index'),
        meta: { title: '菜单管理', badge: 'New' },
      },
    ],
  },
  {
    path: '/mall',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Mall',
    meta: {
      title: '商城',
      icon: 'shopping-cart',
      permissions: ['admin'],
    },

    children: [
      {
        path: 'pay',
        name: 'Pay',
        component: () => import('@/views/mall/pay/index'),
        meta: {
          title: '支付',
          noKeepAlive: true,
        },
        children: null,
      },
      {
        path: 'goodsList',
        name: 'GoodsList',
        component: () => import('@/views/mall/goodsList/index'),
        meta: {
          title: '商品列表',
        },
      },
    ],
  },
  {
    path: '/error',
    component: EmptyLayout,
    redirect: 'noRedirect',
    name: 'Error',
    meta: { title: '错误页', icon: 'bug' },
    children: [
      {
        path: '401',
        name: 'Error401',
        component: () => import('@/views/401'),
        meta: { title: '401' },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: { title: '404' },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
