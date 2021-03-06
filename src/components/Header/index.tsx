import {
    useCallback,
    useMemo,
    useRef,
    useEffect
  } from 'react';
  import { Image, Spin } from 'antd';
  import HomeLogo from '@/assets/images/logo.png'
  import { stringify } from 'querystring';
  import { outLogin } from '@/services/kitchen/api';
  import { history, useModel } from 'umi';
  import styles from './index.less';
  
  const loginPath = '/user/login';
  /**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
    await outLogin();
    const { query = {}, search, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (!history.location.pathname.includes(loginPath) && !redirect) {
      history.replace({
        pathname: loginPath,
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const Header = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const onMenuClick = useCallback(
        (event: any) => {
          const { key } = event;
          if (key === 'logout') {
            setInitialState((s) => ({ ...s, currentUser: undefined }));
            loginOut();
            return;
          }
          history.push(`/account/${key}`);
        },
        [setInitialState],
      );
    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </span>
      );
    if (!initialState) {
        return loading;
    }
    const { currentUser } = initialState as any;
    if (!currentUser || !currentUser.name) {
      return loading;
    }
    const isHome = history.location.pathname.includes('union/index')
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <Image
            width={90}
            height={90}
            preview={false}
            className={styles.companyLogo}
            src={HomeLogo}
            fallback={HomeLogo}
            />
          <div className={styles.nameBox}>
            <div className={styles.mainName}>{currentUser.mainName}</div>
            <div className={styles.secondName}>{currentUser.secondName}</div>
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.logoBox}>
            <div className={styles.text}>店铺管理</div>
            <div className={styles.homeBox}></div>
          </div>
          <div className={styles.infoBox}>
            {
              isHome && (<div className={styles.nameBox} style={{ marginRight: 0 }}>
                <div className={styles.text}>申请入驻</div>
              </div>)
            }
            <div className={styles.nameBox}><div className={styles.text}>{currentUser.name}</div></div>
            <div className={styles.leaveBtn} onClick={onMenuClick}>退出</div>
          </div>
        </div>
      </div>
    )
  }
  
export default Header

