const BASE_IMAGE_URL = 'http://154.201.77.135:8080'
export const getFullImageUrl = (path) => {
  // 防止多余斜杠：/profile//2025/... => /profile/2025/...
  return BASE_IMAGE_URL + path.replace('//', '/')
}
