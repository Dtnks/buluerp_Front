export enum Status {
  Initial = 0,
  ApprovedFalse = -1, // 审核未通过
  PendingDesign = 1, // 待设计
  Designing = 2,
  Completed = 3,
  Canceled = 4,
  Producing = 5,
}

/**
 * 根据状态值获取状态文字
 * @param status 状态值
 * @returns 状态文字
 */
export const getStatusText = (status: Status): string => {
  switch (status) {
    case Status.Initial:
      return '创建(未审核)'
    case Status.ApprovedFalse:
      return '审核未通过'
    case Status.PendingDesign:
      return '待设计'
    case Status.Designing:
      return '设计中'
    case Status.Completed:
      return '已完成'
    case Status.Canceled:
      return '作废'
    case Status.Producing:
      return '布产中'

    default:
      return '未知状态'
  }
}
