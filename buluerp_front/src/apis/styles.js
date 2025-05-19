import httpInstance from "@/utils/httpsInstance.js"

export function getStyleList(id) {
  return httpInstance({
    url: `system/style/${id}`,
    method: 'get',
  })
}

export function updateStyle(data) {
  return httpInstance({
    url: 'system/products',
    method: 'PUT',
    data: data 
  })
}