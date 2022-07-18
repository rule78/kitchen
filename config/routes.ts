export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
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
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
