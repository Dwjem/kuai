import { createMiddleware } from 'hono/factory'
import { fail } from './response'

// 简易Token鉴权，请求头携带 Authorization: Bearer xxx
export const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  const envToken = c.env.API_TOKEN

  if (!token || token !== envToken) {
    return c.json(fail("无权访问，Token错误"), 401)
  }
  await next()
})
