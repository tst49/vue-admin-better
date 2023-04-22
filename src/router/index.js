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
        path: '/index',
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
    meta: { title: '在线学习', icon: 'box-open' },
    children: [
      {
        path: '/video/index',
        name: 'VideoIndex',
        component: () => import('@/views/learningModule/videoIndex'),
        meta: {
          title: '在线算法',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/article/index',
        name: 'ArticleIndex',
        component: () => import('@/views/learningModule/articleIndex'),
        meta: {
          title: '资料库',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/article/edit',
        name: 'ArticleEdit',
        hidden: true,
        component: () => import('@/views/learningModule/articleEdit'),
        meta: {
          title: '资料库编辑',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/article/detail',
        name: 'ArticleDetail',
        hidden: true,
        component: () => import('@/views/learningModule/articleDetail'),
        meta: {
          title: '资料库详情',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/video/detail',
        name: 'VideoDetail',
        hidden: true,
        component: () => import('@/views/learningModule/videoDetail'),
        meta: {
          title: '在线算法详情',
          permissions: ['student', 'teacher', 'admin'],
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
    meta: { title: '刷题学习', icon: 'box-open' },
    children: [
      {
        path: '/paper',
        name: 'Paper',
        hidden: true,
        component: () => import('@/views/testingModule/testPaper'),
        meta: {
          title: '试卷作答页面',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/question/index',
        name: 'QuestionIndex',
        component: () => import('@/views/testingModule/questionIndex'),
        meta: {
          title: '题库',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/paper/index',
        name: 'PaperIndex',
        component: () => import('@/views/testingModule/testPaperIndex'),
        meta: {
          title: '试卷库',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/answer/record',
        name: 'AnswerRecord',
        hidden: true,
        component: () => import('@/views/testingModule/testAnswerRecord'),
        meta: {
          title: '答题记录',
          permissions: ['student', 'teacher', 'admin'],
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
        path: '/rank/board',
        name: 'RankBoard',
        component: () => import('@/views/rankModule/rankBoard'),
        meta: {
          title: '积分榜',
          icon: 'home',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
    ],
  },
  {
    path: 'personalCenter',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PersonalCenter',
    alwaysShow: true,
    meta: { title: '个人主页', icon: 'box-open' },
    children: [
      {
        path: '/my/info',
        name: 'MyInfo',
        component: () => import('@/views/personalCenter/myInfo'),
        meta: {
          title: '个人资料',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/answer/record/index',
        name: 'AnswerRecordIndex',
        component: () => import('@/views/personalCenter/answerRecordIndex'),
        meta: {
          title: '历史答题记录',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/favorites',
        name: 'Favorites',
        component: () => import('@/views/personalCenter/myFavorite'),
        meta: {
          title: '收藏夹',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/my/discuss',
        name: 'MyDiscuss',
        component: () => import('@/views/personalCenter/myComment'),
        meta: {
          title: '我的讨论',
          permissions: ['student', 'teacher'],
        },
      },
      // {
      //   path: '/my/task',
      //   name: 'MyTask',
      //   component: () => import('@/views/vab/nested/menu1/index'),
      //   meta: {
      //     title: '我的学习任务',
      //     permissions: ['student', 'teacher', 'admin'],
      //   },
      // },
      {
        path: 'testAnalysis',
        name: 'TestAnalysis',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '做题分析',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/my/points',
        name: 'MyPoints',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '我的积分',
          permissions: ['student', 'teacher', 'admin'],
        },
      },
      {
        path: '/my/clazz',
        name: 'MyClazz',
        component: () => import('@/views/personalCenter/myClazz'),
        meta: {
          title: '我的班级',
          permissions: ['teacher'],
        },
      },
      {
        path: '/my/student',
        name: 'MyStudent',
        component: () => import('@/views/personalCenter/myStudent'),
        meta: {
          title: '我的学生',
          permissions: ['teacher'],
        },
      },
      // {
      //   path: '/my/publish',
      //   name: 'MyPublish',
      //   component: () => import('@/views/vab/nested/menu1/index'),
      //   meta: {
      //     title: '我发布的任务',
      //     permissions: ['teacher', 'admin'],
      //   },
      // },
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
        path: '/student/management',
        name: 'StudentManagement',
        component: () => import('@/views/managementModule/studentManagement'),
        meta: {
          title: '学生管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/clazz/management',
        name: 'ClazzManagement',
        component: () => import('@/views/managementModule/clazzManagement'),
        meta: {
          title: '班级管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/auth/management',
        name: 'AuthManagement',
        component: () => import('@/views/managementModule/authManagement'),
        meta: {
          title: '权限管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/video/management',
        name: 'VideoManagement',
        component: () => import('@/views/managementModule/videoManagement'),
        meta: {
          title: '视频库管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/article/management',
        name: 'ArticleManagement',
        component: () => import('@/views/managementModule/articleManagement'),
        meta: {
          title: '资料库管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/question/management',
        name: 'QuestionManagement',
        component: () => import('@/views/managementModule/questionManagement'),
        meta: {
          title: '题库管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/paper/management',
        name: 'PaperManagement',
        component: () => import('@/views/managementModule/testPaperManagement'),
        meta: {
          title: '试卷库管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/comment/management',
        name: 'CommentManagement',
        component: () => import('@/views/managementModule/commentManagement'),
        meta: {
          title: '讨论区管理',
          permissions: ['teacher', 'admin'],
        },
      },
      {
        path: '/pointsRules/management',
        name: 'PointsRulesManagement',
        component: () => import('@/views/vab/nested/menu1/index'),
        meta: {
          title: '积分规则管理',
          permissions: ['admin'],
        },
      },
    ],
  },

  // {
  //   path: '/vab',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Vab',
  //   alwaysShow: true,
  //   meta: { title: '组件', icon: 'box-open' },
  //   children: [
  //     {
  //       path: 'permissions',
  //       name: 'Permission',
  //       component: () => import('@/views/vab/permissions/index'),
  //       meta: {
  //         title: '角色权限',
  //         permissions: ['admin', 'editor'],
  //       },
  //     },
  //     {
  //       path: 'icon',
  //       component: EmptyLayout,
  //       redirect: 'noRedirect',
  //       name: 'Icon',
  //       meta: {
  //         title: '图标',
  //         permissions: ['admin'],
  //       },
  //       children: [
  //         {
  //           path: 'awesomeIcon',
  //           name: 'AwesomeIcon',
  //           component: () => import('@/views/vab/icon/index'),
  //           meta: { title: '常规图标' },
  //         },
  //         {
  //           path: 'colorfulIcon',
  //           name: 'ColorfulIcon',
  //           component: () => import('@/views/vab/icon/colorfulIcon'),
  //           meta: { title: '多彩图标' },
  //         },
  //       ],
  //     },
  //     {
  //       path: 'table',
  //       component: () => import('@/views/vab/table/index'),
  //       name: 'Table',
  //       meta: {
  //         title: '表格',
  //         permissions: ['admin'],
  //       },
  //     },
  //     {
  //       path: 'map',
  //       component: () => import('@/views/vab/map/index'),
  //       name: 'Map',
  //       meta: {
  //         title: '地图',
  //         permissions: ['admin'],
  //       },
  //     },

  //     {
  //       path: 'webSocket',
  //       name: 'WebSocket',
  //       component: () => import('@/views/vab/webSocket/index'),
  //       meta: { title: 'webSocket', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'form',
  //       name: 'Form',
  //       component: () => import('@/views/vab/form/index'),
  //       meta: { title: '表单', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'element',
  //       name: 'Element',
  //       component: () => import('@/views/vab/element/index'),
  //       meta: { title: '常用组件', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/vab/tree/index'),
  //       meta: { title: '树', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/vab/nested/menu1/index'),
  //       name: 'Menu1',
  //       alwaysShow: true,
  //       meta: {
  //         title: '嵌套路由 1',
  //         permissions: ['admin'],
  //       },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           name: 'Menu1-1',
  //           alwaysShow: true,
  //           meta: { title: '嵌套路由 1-1' },
  //           component: () => import('@/views/vab/nested/menu1/menu1-1/index'),

  //           children: [
  //             {
  //               path: 'menu1-1-1',
  //               name: 'Menu1-1-1',
  //               meta: { title: '嵌套路由 1-1-1' },
  //               component: () =>
  //                 import('@/views/vab/nested/menu1/menu1-1/menu1-1-1/index'),
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       path: 'loading',
  //       name: 'Loading',
  //       component: () => import('@/views/vab/loading/index'),
  //       meta: { title: 'loading', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'backToTop',
  //       name: 'BackToTop',
  //       component: () => import('@/views/vab/backToTop/index'),
  //       meta: { title: '返回顶部', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'lodash',
  //       name: 'Lodash',
  //       component: () => import('@/views/vab/lodash/index'),
  //       meta: { title: 'lodash', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'smallComponents',
  //       name: 'SmallComponents',
  //       component: () => import('@/views/vab/smallComponents/index'),
  //       meta: { title: '小组件', permissions: ['admin'] },
  //     },

  //     {
  //       path: 'upload',
  //       name: 'Upload',
  //       component: () => import('@/views/vab/upload/index'),
  //       meta: { title: '上传', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'log',
  //       name: 'Log',
  //       component: () => import('@/views/vab/errorLog/index'),
  //       meta: { title: '错误日志模拟', permissions: ['admin'] },
  //     },
  //     {
  //       path: 'https://github.com/chuzhixin/vue-admin-beautiful?utm_source=gold_browser_extension',
  //       name: 'ExternalLink',
  //       meta: {
  //         title: '外链',
  //         target: '_blank',
  //         permissions: ['admin', 'editor'],
  //         badge: 'New',
  //       },
  //     },
  //     {
  //       path: 'more',
  //       name: 'More',
  //       component: () => import('@/views/vab/more/index'),
  //       meta: { title: '关于', permissions: ['admin'] },
  //     },
  //   ],
  // },
  // {
  //   path: '/personnelManagement',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'PersonnelManagement',
  //   meta: { title: '配置', icon: 'users-cog', permissions: ['admin'] },
  //   children: [
  //     {
  //       path: 'userManagement',
  //       name: 'UserManagement',
  //       component: () =>
  //         import('@/views/personnelManagement/userManagement/index'),
  //       meta: { title: '用户管理' },
  //     },
  //     {
  //       path: 'roleManagement',
  //       name: 'RoleManagement',
  //       component: () =>
  //         import('@/views/personnelManagement/roleManagement/index'),
  //       meta: { title: '角色管理' },
  //     },
  //     {
  //       path: 'menuManagement',
  //       name: 'MenuManagement',
  //       component: () =>
  //         import('@/views/personnelManagement/menuManagement/index'),
  //       meta: { title: '菜单管理', badge: 'New' },
  //     },
  //   ],
  // },
  // {
  //   path: '/mall',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Mall',
  //   meta: {
  //     title: '商城',
  //     icon: 'shopping-cart',
  //     permissions: ['admin'],
  //   },

  //   children: [
  //     {
  //       path: 'pay',
  //       name: 'Pay',
  //       component: () => import('@/views/mall/pay/index'),
  //       meta: {
  //         title: '支付',
  //         noKeepAlive: true,
  //       },
  //       children: null,
  //     },
  //     {
  //       path: 'goodsList',
  //       name: 'GoodsList',
  //       component: () => import('@/views/mall/goodsList/index'),
  //       meta: {
  //         title: '商品列表',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/error',
  //   component: EmptyLayout,
  //   redirect: 'noRedirect',
  //   name: 'Error',
  //   meta: { title: '错误页', icon: 'bug' },
  //   children: [
  //     {
  //       path: '401',
  //       name: 'Error401',
  //       component: () => import('@/views/401'),
  //       meta: { title: '401' },
  //     },
  //     {
  //       path: '404',
  //       name: 'Error404',
  //       component: () => import('@/views/404'),
  //       meta: { title: '404' },
  //     },
  //   ],
  // },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true,
  // },
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
