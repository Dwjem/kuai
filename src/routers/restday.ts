import { Hono } from "hono";

import { success } from "../utils/response";


import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})
const restDay = new Hono()


restDay.post('/generate', sValidator('json', schema), async (c) => {
    const body = await c.req.valid('json')
    console.log('body',body)
    return c.json(success({ body }, "服务正常运行"))
})

export default restDay