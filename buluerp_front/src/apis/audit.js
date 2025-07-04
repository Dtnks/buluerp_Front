import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export const getAuditSwitchList = () => {
  return httpInstance({
    url: `system/audit-switch/list`,
    method: 'get',
    headers: headers,
  })
}

export const updateAuditSwitch = (auditType, status) => {
  return httpInstance({
    url: `system/audit-switch/status/${auditType}/${status}`,
    method: 'put',
    headers: headers,
  })
}

export const getAuditSwitchEnabled = (auditType) => {
  return httpInstance({
    url: `system/audit-switch/enabled/${auditType}`,
    method: 'get',
    headers: headers,
  })
}
