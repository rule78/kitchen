import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { isArray } from 'lodash';
import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash'
import styles from './index.less';

type LoadingProps = {
  first?: boolean;
  second?: boolean;
  third?: boolean;
};


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UploadList: React.FC = ({ onChange, value }: any) => {
  const [loading, setLoading] = useState<LoadingProps>({});
  const [imagesUrl, setImagesUrl] = useState<Array<string>>(['', '', '']);

  useEffect(() => {
    if (value && isArray(value)) {
      setImagesUrl(value)
    }
  }, [value])
  useEffect(() => {
    if (imagesUrl && isArray(imagesUrl)) {
      onChange(imagesUrl)
    }
  }, [imagesUrl])
  const handleChange: any = (info: UploadChangeParam<UploadFile>, type : string) => {
    if (info.file.status === 'uploading') {
      setLoading((value) => {
        return {
          ...value,
          [type]: true
        }
      });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading((value) => {
          return {
            ...value,
            [type]: false
          }
        });
        setImagesUrl((val) => {
          let list = cloneDeep(val)
          if (type === 'first') {
            list[0] = url;
          } else if (type === 'second') {
            list[1] = url;
          } else {
            list[2] = url;
          }
          return list
        })
      });
    }
  };
  const UploadButton: any = ({ type }: any) => {
    return (
      <div>
        {loading[type] ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
  }
  return (
    <div className={styles.uploadList}>
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          maxCount={1}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={(info) => handleChange(info, 'first')}
        >
          {imagesUrl[0] ? <img src={imagesUrl[0]} alt="avatar" style={{ width: '100%' }} /> : <UploadButton type="first" />}
        </Upload>
        <div className={styles.title}>门头</div>
      </div>
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          maxCount={1}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={(info) => handleChange(info, 'second')}
        >
          {imagesUrl[1] ? <img src={imagesUrl[1]} alt="avatar" style={{ width: '100%' }} /> : <UploadButton type="second" />}
        </Upload>
        <div className={styles.title}>食堂</div>
      </div>
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          maxCount={1}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={(info) => handleChange(info, 'third')}
        >
          {imagesUrl[2] ? <img src={imagesUrl[2]} alt="avatar" style={{ width: '100%' }} /> : <UploadButton type="third" />}
        </Upload>
        <div className={styles.title}>后厨</div>
      </div>
     </div>
  );
};

export default UploadList;