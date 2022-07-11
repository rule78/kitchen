import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  headerTheme: 'dark',
  headerHeight: 180,
  // 拂晓蓝
  primaryColor: "#2F54EB",
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  iconfontUrl: '',
};

export default Settings;
