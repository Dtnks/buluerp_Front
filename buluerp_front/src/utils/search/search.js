import httpInstance from '../httpsInstance'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export const searchFunc = (url, key) => {
  let tempUrl = `${url}?${key}=`
  return (ele, content) => {
    if (content) {
      ele.loading = true
      console.log(`${tempUrl}${content}`)
      httpInstance({
        url: `${tempUrl}${content}`,
        method: 'get',
        headers: headers,
      }).then((res) => {
        console.log(res)
        ele.options = res.rows.map((item) => {
          return { label: item[key], value: item[key] }
        })
      })
      ele.loading = false
    } else {
      ele.options = []
    }
  }
}
