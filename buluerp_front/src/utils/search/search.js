import httpInstance from '../httpsInstance'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export const searchFunc = (url, key) => {
  let tempUrl = `${url}?${key}=`
  const debouncedSearch = debounce((ele, content) => {
    if (content) {
      ele.loading = true
      console.log(`${tempUrl}${content}`)
      httpInstance({
        url: `${tempUrl}${content}`,
        method: 'get',
        headers: headers,
      })
        .then((res) => {
          console.log(res)
          ele.options = res.rows.map((item) => {
            return { label: item[key], value: item[key] }
          })
        })
        .finally(() => {
          ele.loading = false
        })
    } else {
      ele.options = []
    }
  }, 500)

  return (ele, content) => {
    debouncedSearch(ele, content)
  }
}

function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      timer = null
    }, delay)
  }
}
