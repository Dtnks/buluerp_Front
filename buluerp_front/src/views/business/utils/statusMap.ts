// todo: 改成枚举
export const statusMap: Record<number, string> = {
  0: '初始状态',
  1: '设计中',
  2: '已完成',
  3: '作废',
  4: '布产中',
  };

  /**
 * 根据状态值获取状态文字
 * @param status 状态值
 * @returns 状态文字
 */

export const getStatusText = (status: number): string => {
  return statusMap[status] || '未知状态';
}
