import {
    useCallback, useEffect
  } from 'react';
  import { Image, Spin, Popover } from 'antd';
  import HomeLogo from '@/assets/images/logo.png'
  import { history, useModel } from 'umi';
  import { delCookie } from '@/utils/auth'
  import styles from './index.less';

  type CardItemProps = {
    name: string;
    logo?: string;
    identityType: number;
    relateId: number
  };
  const loginPath = '/user/login';
  /**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  delCookie()
  history.push(loginPath);
};

  const Header = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const onMenuClick = useCallback(() => {
      setInitialState((s) => ({ ...s, currentUser: undefined }));
      loginOut();
      return;
    }, [setInitialState]);
    const toApply = () => {
      history.push('/union/join');
    }
    const toHome = () => {
      history.push('/union/index');
    }
    const toList = (params: CardItemProps) => {
      const { identityType, relateId, name } = params
      history.replace({
        pathname: '/union/list',
        query: { identityType, relateId, name }
      });
    }
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
    const { name: mainName, relateId } = history.location.query as any
    const isHome = history.location.pathname.includes('union/index') || history.location.pathname === "/"
    const isList = history.location.pathname.includes('union/list')
    const popContent = () => {
      return <>{
        currentUser?.unionList?.map((i: any) => {
          return <div
            key={i.relateId} onClick={() => toList(i)}
            className={styles.popBtn}
          >{i.name}</div>
        })
      }
      </>
    }
    const getHomeLogo = useCallback(() => {
      if (isList) {
        const item = currentUser?.unionList?.find((i: any) => i.relateId === relateId)
        return item ? item.logo : HomeLogo
      }
      return HomeLogo
    }, [currentUser, relateId])
    return (
      <div className={styles.header}>
        <div className={styles.leftContent} onClick={toHome}>
          <Image
            width={90}
            height={90}
            preview={false}
            className={styles.companyLogo}
            src={getHomeLogo()}
            fallback={HomeLogo}
          />
          <div className={styles.nameBox}>
            {
              isList && (<>
              <div className={styles.mainName}>{isList ? mainName: '食上安全云平台'}</div>
              <div className={styles.secondName}>{ isList && '智慧餐饮.食上云平台' }</div>
              </>
              )
            }
            {
              !isList && <div className={styles.oneMainName}>{'食上安全云平台'}</div>
            }
          </div>
        </div>
        <div className={styles.rightContent}>
          {
            currentUser?.unionList?.length > 0 && <Popover placement="bottomRight" title={null} content={popContent} trigger="click">
              <div className={styles.logoBox}>
                <div className={styles.text}>店铺管理</div>
                <div className={styles.homeBox}></div>
              </div>
            </Popover>
          }
          {
            currentUser?.unionList?.length === 0 &&  <div className={styles.logoBox} onClick={toHome}>
              <div className={styles.text}>店铺管理</div>
              <div className={styles.homeBox}></div>
            </div>
          }
          <div className={styles.infoBox}>
            {
              isHome && (<div className={styles.nameBox} style={{ marginRight: 0 }}>
                <div onClick={toApply} className={styles.text}>申请入驻</div>
              </div>)
            }
            <div className={styles.nameBox}><div className={styles.text}>{currentUser.mobileNo}</div></div>
            <div className={styles.leaveBtn} onClick={onMenuClick}>退出</div>
          </div>
        </div>
      </div>
    )
  }
  
export default Header

