/**
 * 根据月份获取该月的最大天数
 * @param {number} month - 月份 (1-12)
 * @returns {number} 该月的最大天数
 */
export function getDaysInMonth(month:number) {
  // 动态获取当前年份，完美兼容平年和闰年
  const currentYear = new Date().getFullYear();

  // Date(year, month, 0) 表示该月的第0天，即上个月的最后一天
  return new Date(currentYear, month, 0).getDate();
}

/**
 * num：原始数字
 * len：目标总长度
 */
export function fillZero(num: number, len = 2) {
  return String(num).padStart(len, "0");
}

/**
 * @param {string} str 格式 '07/01' 或者 '07\\/01'
 * @returns {{month: number, day: number}}
 */
export function getMonthDay(str: string) {
  // 消除转义斜杠，统一分隔符
  const normalStr = str.replace(/\\\//g, "/");
  const [month, day] = normalStr.split("/");
  return {
    month: Number(month),
    day: Number(day),
  };
}
