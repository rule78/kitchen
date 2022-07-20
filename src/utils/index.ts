export const validateMobile = (_, value: any) => {
    var reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
    if (!reg.test(value)) {
        return Promise.reject(new Error('手机号格式不正确!'))
    }
    return Promise.resolve()
  }