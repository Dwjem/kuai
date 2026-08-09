import { Hono } from 'hono'
import { success } from '../utils/response'

const route = new Hono()

// 公开接口，不需要鉴权
route.get('/ping', (c) => {
  console.log("ping接口被调用")
  return c.json(success({ time: new Date().toISOString() }, "服务正常运行"))
})

// 需要鉴权的接口
route.get('/user/:id', (c) => {
  const id = c.req.param('id')
  console.log("获取用户id:", id)
  return c.json(success({ userId: id, name: "测试用户" }))
})

export default route
