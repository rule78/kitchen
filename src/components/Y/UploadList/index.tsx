import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { message, Upload } from 'antd';
import { isArray } from 'lodash';
import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash'
import { uploadApi } from '@/services/kitchen/api'
import styles from './index.less';

type fileProps = {
  first?: Array<any>;
  second?: Array<any>;
  third?: Array<any>;
};

const UploadList: React.FC = ({ onChange, value }: any) => {
  const [imagesUrl, setImagesUrl] = useState<fileProps>({
    first: [],
    second: [],
    third: [],
  });

  useEffect(() => {
    if (value) {
      setImagesUrl(value)
    }
  }, [value])
  const uploadFile = (params: any, uploadType: string) => {
    const formData = new FormData()
    formData.append('file', params.file)
    request<API.RuleList>(uploadApi, {
      method: 'POST',
      requestType: 'form',
      data: formData
    }).then((res) => {
      setTimeout(() => {
        let list = cloneDeep(imagesUrl)
        list[uploadType] = [{
          uid: new Date().getTime(),
          name: params.file.name,
          status: 'done',
          url: res.data
        }];
        onChange(list)
      })
    })
  }
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 30;
    if (!isLt2M) {
      message.error('上传图片需要小于 30MB!')
    }
    return isJpgOrPng && isLt2M;
  };
  const onRemove = (params: any, uploadType: string) => {
    const { uid } = params
    const target = imagesUrl[uploadType].filter((i: any) => {
      return i.uid !== uid
    })
    onChange({
      ...imagesUrl,
      [uploadType]: target
    })
  }
  const UploadButton: any = ({ type }: any) => {
    return (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
  }
  return (
    <div className={styles.uploadList}>
      <div>
        <Upload
          listType="picture-card"
          className="avatar-uploader"
          maxCount={1}
          fileList={imagesUrl?.first}
          beforeUpload={beforeUpload}
          customRequest={(params) => uploadFile(params, 'first')}
          onRemove={(params) => onRemove(params, 'first')}
        >
          {imagesUrl?.first?.length >= 1 ? null : <UploadButton type="first" />}
        </Upload>
        <div className={styles.title}>门头</div>
      </div>
      <div>
        <Upload
             listType="picture-card"
             className="avatar-uploader"
             maxCount={1}
             fileList={imagesUrl?.second}
             beforeUpload={beforeUpload}
             customRequest={(params) => uploadFile(params, 'second')}
             onRemove={(params) => onRemove(params, 'second')}
        >
           {imagesUrl?.second?.length >= 1 ? null : <UploadButton type="second" />}
        </Upload>
        <div className={styles.title}>食堂</div>
      </div>
      <div>
        <Upload
          listType="picture-card"
          className="avatar-uploader"
          maxCount={1}
          fileList={imagesUrl?.third}
          beforeUpload={beforeUpload}
          customRequest={(params) => uploadFile(params, 'third')}
          onRemove={(params) => onRemove(params, 'third')}
        >
          {imagesUrl?.third?.length >= 1 ? null : <UploadButton type="third" />}
        </Upload>
        <div className={styles.title}>后厨</div>
      </div>
     </div>
  );
};

export default UploadList;