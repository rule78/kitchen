import React from 'react';
import Header from '@/components/Header'
import { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { unionList } from '@/dictionary/index';
import styles from './index.less';

type CardProps = {
  title?: string;
  icon?: string;
  desc?: string;
  type: 'shop' | 'cooperate' | 'government';
};
type CardItemProps = {
  name?: string;
  logo?: string;
  identityType?: number;
  relateId?: number
};
type CardMapProps = {
  shop: Array<CardItemProps>;
  cooperate: Array<CardItemProps>;
  government: Array<CardItemProps>;
};
const identityTypeMap = {
  1: 'shop',
  2: 'cooperate',
  3: 'government'
}
// identityType 身份类型 1、商家店铺 2、连锁/合作机构 3、政府机构
const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser, fetchUserInfo } = initialState as any;
  const [cardList, setCardList] = useState<CardMapProps>({
    shop: [],
    cooperate: [],
    government: [],
  });
  useEffect(() => {
    initData()
  }, []);
  const initData = async() => {
    const uRes = await fetchUserInfo()
    setCardList(() => {
      const shop: any = [], cooperate: any = [], government: any = []
      uRes.unionList?.map((i: any) => {
        if (identityTypeMap[i.identityType] === 'shop') {
          shop.push(i)
        }
        if (identityTypeMap[i.identityType] === 'cooperate') {
          cooperate.push(i)
        }
        if (identityTypeMap[i.identityType] === 'government') {
          government.push(i)
        }
      });
      return {
        shop, cooperate, government
      }
    })
  }
  const toList = (params: CardItemProps) => {
    const { identityType, relateId, name } = params
    history.push({
      pathname: '/union/list',
      query: {
        identityType, relateId, name
      }
    });
  }
  const CardEle: any = ({ title, icon, desc, type }: CardProps) => {
    return (
        <div className={styles.cardBox} key={type}>
          <div className={styles.headerBox}>
            <img className={styles.icon} src={icon} />
            <div className={styles.title}>{title}</div>
            <div className={styles.desc}>{desc}</div>
          </div>
          <div className={styles.contentBox}>
            {cardList[type].length === 0 && <div className={styles.empty}>空</div>}
            {cardList[type].length > 0 && cardList[type].map((item) => (
              <div className={styles.itemBox} key={item.relateId} onClick={() => toList(item)}>
                <div className={styles.desc}>
                  <div className={styles.title}>{item.name}</div>
                  <div className={styles.turnRight}></div>
                </div>
                <img className={styles.logo} src={item.logo} />
              </div>
            ))}
          </div>
        </div>
      );
  };
  return (
    <div className={styles.home}>
      <Header />
      {
        currentUser.unionList?.length > 0 && (
          <div className={styles.loginContainer}>
          {unionList.map((i) => {
            if (i.type !== 'shop' && cardList[i.type].length === 0 ) {
              return ''
            }
            return <CardEle {...i} key={i.type} />;
          })}
        </div>
        )
      }
      {
        currentUser.unionList?.length === 0 && (
          <div className={styles.content}>
          <div className={styles.mainImg}></div>
        </div>
        )
      }
    </div>
  )
}

export default Home