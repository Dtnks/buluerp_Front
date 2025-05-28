import httpInstance from "@/utils/httpsInstance.js"

export const getPackagingListById = (id) => {
  return httpInstance({
    url: `system/packaging-list/${id}`,
    method: 'get',
  })
}
