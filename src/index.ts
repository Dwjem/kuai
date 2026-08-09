import { Hono } from 'hono'
import { cors } from 'hono/cors'
import demoRoute from './routes/demo'
import { authMiddleware } from './utils/auth'

const app = new Hono()

// 全局跨域配置（允许所有来源，方便快捷指令调用）
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// 全局日志中间件，打印所有请求信息
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const cost = Date.now() - start
  console.log(`[${c.req.method}] ${c.req.url} status:${c.res.status} cost:${cost}ms`)
})

// 公开路由（不需要鉴权）
app.route('/api', demoRoute)

// 需要鉴权的路由分组
const privateGroup = new Hono()
privateGroup.use(authMiddleware)
privateGroup.get('/api/secret', (c) => {
  return c.json({ code: 200, message: "受保护接口，验证成功" })
})
app.route('/', privateGroup)

// 404兜底
app.notFound((c) => {
  return c.json({ code: 404, message: "接口不存在" }, 404)
})

export default app
