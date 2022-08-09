export default [
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
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
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
    name: 'union.login',
    icon: 'table',
    layout: false,
    path: '/union/login',
    component: './Union/login',
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
