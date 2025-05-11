export function messageBox(type, func, successText, errorText, warningText) {
  if (type == 'warning') {
    ElMessageBox.confirm(warningText, '操作确认提示', {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      func()
        .then(() => {
          return ElMessageBox.alert(successText, '操作成功', {
            confirmButtonText: '继续',
            type: 'success',
          })
        })
        .catch(() => {
          return ElMessageBox.alert(errorText, '操作错误', {
            confirmButtonText: '继续',
            type: 'error',
          })
        })
    })
  } else if (type == 'success') {
    ElMessageBox.alert(successText, '操作成功', {
      confirmButtonText: '继续',
      type: 'success',
    })
  } else {
    ElMessageBox.alert(errorText, '操作错误', {
      confirmButtonText: '继续',
      type: 'error',
    })
  }
}
