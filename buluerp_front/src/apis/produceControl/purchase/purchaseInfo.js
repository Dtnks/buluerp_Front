import httpInstance from "@/utils/httpsInstance.js"

export function getPurchaseInfo(id) {
  return httpInstance({
    url: `/system/purchase-info`,
    params: { ids: id },
    method: 'get',
  })
}

