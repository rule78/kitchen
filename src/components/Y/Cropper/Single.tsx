import React, { useState, useRef, useEffect } from 'react';
import { request } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import 'cropperjs/dist/cropper.css';
import CropperJs from 'cropperjs';
import { Upload, Button, Modal } from 'antd';
import { uploadApi } from '@/services/kitchen/api'
import styles from './Single.less';
type uploadProps = {
  onChange?: any;
  value?: Array<any>
}
const LONG = 1600
const WIDE = 1600

const Single: React.FC<uploadProps> = ({ value, onChange }) => {
  const ref = useRef() as any;
  const [image, setImage] = useState<any>();
  const [imageList, setImageList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cropper, setCropper] = useState<any>(); // 存储cropper对象
  useEffect(() => {
    if (value) {
      setImageList(value)
    }
  }, [value])
  const replaceImg = (img: Blob) => {
    setIsModalVisible(true)
    setImage(undefined);
    // 通过FileReader读取用户选取的图片
    const reader = new FileReader();
    reader.readAsDataURL(img);
    //加载图片后获取到图片的base64格式
    reader.onload = ({ target: { result } = {} }) => {
      const myCropper = new CropperJs(ref.current, {
        viewMode: 0,
        dragMode: 'move',
        aspectRatio: LONG / WIDE,
        autoCropArea: 0.9,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
        movable: true,
        scalable: true,
        zoomable: true,
      });
      setCropper(myCropper);
      //更新替换为目标图片
      myCropper.replace(result);
      setImage(img);
    };
    return false;
  };
  const onCancel = () => {
    setIsModalVisible(false)
  }
  const onRemove = () => {
    setImageList([])
  }
  const onSubmit = () => {
    if (image) {
      setLoading(true);
      cropper.getCroppedCanvas({
          width: LONG,
          maxWidth: LONG * 1.2,
          height: WIDE,
          maxHeight: WIDE * 1.2, // maxWidth、maxHeight必须设置，原因见：遇到的bug和解决方案
        })
        .toBlob((blob: Blob) => {
          if (blob) {
            const formData = new FormData()
            formData.append('file', blob)
            request<API.RuleList>(uploadApi, {
              method: 'POST',
              requestType: 'form',
              data: formData
            }).then((res) => {
              const data = [{
                uid: new Date().getTime(),
                name: image?.name,
                status: 'done',
                url: res.data
              }]
              setLoading(false);
              // setImageList(data)
              setIsModalVisible(false)
              onChange(data)
            })
          }
        }, 'image/png');
    }
  };
  return (
    <div className={styles.container}>
      <Upload
        listType="picture-card"
        maxCount={1}
        fileList={imageList}
        beforeUpload={replaceImg}
        onRemove={onRemove}
        accept="image/*"
      >
        {
          imageList.length > 0 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          )
        }
      </Upload>
      <Modal title="Basic Modal"
        visible={isModalVisible}
        width="460px"
        onCancel={onCancel}
        footer={[
          <Button key="submit" className={styles.button} loading={loading} onClick={onSubmit}>
            确定上传
          </Button>
        ]}
      >
        <div className={styles.cropper}>
          <img ref={ref} alt="" />
        </div>
       </Modal>
    </div>
  );
};
export default Single;
