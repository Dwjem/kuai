import { Hono } from 'hono'
// import { cors } from 'hono/cors'

import appRouter from './routers/index'


const app = new Hono()

// // 全局跨域配置（允许所有来源，方便快捷指令调用）
// app.use('*', cors({
//   origin: '*',
//   allowMethods: ['GET', 'POST', 'OPTIONS'],
//   allowHeaders: ['Content-Type', 'Authorization']
// }))


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api', appRouter)

export default app
