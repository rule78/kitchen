import { message } from 'antd';

export const validateMobile = (_, value: any) => {
    var reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
    if (!reg.test(value)) {
        return Promise.reject(new Error('手机号格式不正确!'))
    }
    return Promise.resolve()
  }

  export const validateCardId= (_, value: any) => {
    var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
    if (!value) {
      return Promise.reject(new Error('请输入身份证号码!'))
    }
    if (!reg.test(value)) {
        return Promise.reject(new Error('身份证格式不正确!'))
    }
    return Promise.resolve()
  }

  export const formatFile = (fileList: any) => {
    return fileList?.[0]?.url
  }
  


  export function copyUrl(innerHTML: string){
    var url=innerHTML;
    var input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', url);
    input.select();
    document.execCommand("copy"); // 执行浏览器复制命令
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        message.info("分享链接已复制好，可贴粘。");
    }
    document.body.removeChild(input);
}
