import {Hono} from "hono";
import dayjs from "dayjs";
import {success} from "../utils/response";


import * as z from 'zod'
import {sValidator} from '@hono/standard-validator'

const generateSchema = z.object({
    mounth: z.number().min(1).max(12),
    startDay: z.number().min(1).max(31),
    intervalDays: z.number().min(1),
})
const restDay = new Hono()


restDay.post('/generate', sValidator('json', generateSchema), async (c) => {
    const body = await c.req.valid('json')
    const {mounth, startDay, intervalDays} = body
    const baseDate = dayjs().month(mounth - 1).date(startDay)
    const endDate = dayjs().month(mounth - 1).endOf('month')
    const list: string[] = []

    let current = baseDate.clone()
    console.log(current)

    while (current.valueOf() <= endDate.valueOf()) {
        list.push(current.format('YYYY-MM-DD'))
        current = current.add(intervalDays, 'day')
    }
    return c.json(success(list))
})

export default restDay