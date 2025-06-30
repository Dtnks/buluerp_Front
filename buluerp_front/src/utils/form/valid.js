export const requiredRule = { required: true, message: '该字段为必填项', trigger: 'blur' }
export const positiveNumberRule = {
  validator: (rule, value, callback) => {
    if (typeof value === 'undefined' || value === null || value === '') {
      callback(new Error('该字段为必填项'))
    } else if (isNaN(Number(value)) || Number(value) <= 0) {
      callback(new Error('请输入大于 0 的数字'))
    } else {
      callback()
    }
  },
  trigger: 'blur',
}
