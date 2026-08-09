/**
 * 接口统一返回封装
 */
export function success<T>(data: T, msg = "ok") {
  return {
    code: 200,
    message: msg,
    data
  }
}

export function fail(msg = "请求失败", code = 400) {
  return {
    code,
    message: msg,
    data: null
  }
}
