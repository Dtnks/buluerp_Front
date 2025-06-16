import httpInstance from "@/utils/httpsInstance.js"

export function getPurchaseInfo(id) {
  return httpInstance({
    url: `/system/purchase-info/${id}`,
    method: 'get',
  })
}

