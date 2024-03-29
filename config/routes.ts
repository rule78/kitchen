﻿export default [
  {
    path: '/',
    layout: false,
    component: './Union/index.tsx',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
    ],
  },
  {
    path: '/test',
    layout: false,
    routes: [
      {
        name: 'test',
        path: '/test',
        component: '../components/Y/Cropper/Single',
      },
    ],
  },
  {
    name: 'union.index',
    icon: 'table',
    layout: false,
    path: '/union/index',
    component: './Union',
  },
  {
    name: 'union.join',
    icon: 'table',
    layout: false,
    path: '/union/join',
    component: './Union/Join',
  },
  {
    name: 'union.list',
    icon: 'table',
    layout: false,
    path: '/union/list',
    component: './Union/list',
  },
  {
    component: './404',
  },
];
