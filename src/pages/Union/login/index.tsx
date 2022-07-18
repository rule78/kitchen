import { useState, useEffect } from 'react';
import { history } from 'umi';
import Header from '@/components/Header';
import { unionList } from '@/dictionary/index';
import styles from './index.less';

type CardProps = {
  title?: string;
  icon?: string;
  desc?: string;
  type: 'shop' | 'cooperate' | 'government';
};
type CardItemProps = {
  title?: string;
  logo?: string;
};
type CardMapProps = {
  shop: Array<CardItemProps>;
  cooperate: Array<CardItemProps>;
  government: Array<CardItemProps>;
};
const Login = () => {
  const [cardList, setCardList] = useState<CardMapProps>({
    shop: [],
    cooperate: [],
    government: [],
  });
  useEffect(() => {
    setCardList((val) => {
      return {
        ...val,
        shop: [{ title: '测试店铺' }],
        cooperate: [{ title: '海纳百川大酒楼马尾区' }],
      };
    });
  }, []);
  const toList = () => {
    history.push('/union/list');
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
          {cardList[type].map((item) => (
            <div className={styles.itemBox} key={item.title} onClick={toList}>
              <div className={styles.desc}>
                <div className={styles.title}>{item.title}</div>
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
      <div className={styles.loginContainer}>
        {unionList.map((i) => {
          return <CardEle {...i} key={i.type} />;
        })}
      </div>
    </div>
  );
};

export default Login;
