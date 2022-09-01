
import RightContent from '@/components/RightContent';
import LeftContent from '@/components/LeftContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history, RequestConfig } from 'umi';
import { getToken, getMobileNo, getAuth } from '@/utils/auth'
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from '@/services/kitchen/api';

const loginPath = '/user/login';
const defaultHomeLogo = 'https://lhcdn.lanhuapp.com/web/imgs/download-xd125adfb8.svg'
 
export const request: RequestConfig = {
  timeout: 8000,
  headers: {
    "token": getAuth()
  },
  requestInterceptors: [
    // 直接写一个 function，作为拦截器
    (url, options) =>
      {
        let target = options
        target.headers = {
          ...target.headers,
          "token": getAuth()
        }
        return { url, options: target }
      },
  ]
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const id = getToken()
      const msg = await queryCurrentUser({ userId: Number(id) });
      if (msg.data) {
        return {
          unionList: msg.data,
          mobileNo: getMobileNo(),
          homeLogo: defaultHomeLogo,
        };
      } else {
        history.push(loginPath);
      }
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (!history.location.pathname.includes(loginPath)) {
    const currentUser = await fetchUserInfo();
    console.log(currentUser, 'currentUser')
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    currentUser: {},
    settings:  defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    logo: () => <LeftContent />,
    disableContentMargin: false,
    breadcrumbRender:  undefined,
    menuHeaderRender: undefined,
    menu: undefined,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => '',
    onPageChange: () => {
      const { location } = history;
      const id = getToken()
      // 如果没有登录，重定向到 login
      if (!id && location.pathname.includes(loginPath)) {
        history.push(loginPath);
      }
    },
    links: [],
    childrenRender: (children, props) => {
      let initSetting = initialState?.settings
      if (location.pathname.includes('union/list')) {
        initSetting = {
          ...initSetting,
          navTheme: 'realDark',
        }
      }
      return (
        <>
          {children}
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initSetting}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
        </>
      );
    },
    ...initialState?.settings,
  };
};
