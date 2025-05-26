import httpInstance from "@/utils/httpsInstance.js"

export const getPackingListById = (id) => {
  return httpInstance({
    url: `system/packing-list/${id}`,
    method: 'get',
  })
}
