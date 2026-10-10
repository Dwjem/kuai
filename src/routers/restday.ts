import { Hono } from "hono";
import dayjs from "dayjs";
import { uniq } from "lodash";
import { success } from "../utils/response";


import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'


import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// 生成休息日列表的参数校验规则
const generateSchema = z.object({
  year_month: z.string().regex(/^\d{4}\/\d{2}$/, "格式必须是 YYYY/MM，例如 2026/10"),
  // 从这个月的哪一天开始计算休息日
  start: z.coerce.number().min(1).max(31),
  // 一轮周期是几天
  yilun: z.coerce.number().min(1),
})


// 修改休息日列表的参数校验规则
const updateSchema = z.object({
  year_month: z.string().regex(/^\d{4}\/\d{2}$/, "格式必须是 YYYY/MM，例如 2026/10"),
  // 从这个月的哪一天开始计算休息日
  start: z.coerce.number().min(1).max(31),
  // 一轮周期是几天
  yilun: z.coerce.number().min(1),
  // 需要修改的休息日
  oldDay: z.string().regex(/^\d{2}\/\d{2}$/),
  newDay: z.coerce.number().min(1).max(31),
  //源数据列表
  list: z.array(z.string().regex(/^\d{2}\/\d{2}$/)),
})

// 修改休息日列表的参数校验规则
const addSchema = z.object({
  // 需要添加的休息日, 多个休息日使用换行分隔
  day: z.preprocess(
    (val) => {
      if (typeof val !== "string") return val
      return val
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    },
    z.array(
      z.string()
        .regex(/^\d{4}\/\d{2}\/\d{2}$/, { message: "日期格式必须 YYYY/MM/DD" })
        .refine((d) => dayjs(d, "YYYY/MM/DD", true).isValid(), { message: "非法日期" })
    ).min(1, { message: "至少传入一个日期" })
  ),
  // 源数据列表
  list: z.array(z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/)),
})



const restDay = new Hono()

// 生成休息日列表
restDay.get('/generate', sValidator('query', generateSchema), (c) => {
  const params = c.req.valid('query')
  const { year_month, start, yilun } = params

  // 拆分 年、月
  const [yearStr, monthStr] = year_month.split('/')
  const year = Number(yearStr)
  const month = Number(monthStr)

  const baseDate = dayjs().year(year).month(month - 1).date(start)
  const endDate = dayjs().year(year).month(month - 1).endOf('month')
  const list: string[] = []

  let current = baseDate.clone()

  while (current.valueOf() <= endDate.valueOf()) {
    list.push(current.format('YYYY/MM/DD'))
    current = current.add(yilun, 'day')
  }
  return c.json(success(list))
})



/**
 * 修改休息日列表里的某一天
 * 存在意义：当有法定节假日时，后续休息日可能会往后推移
 *  */
// restDay.post('/update', sValidator('json', updateSchema), async (c) => {
//     const body =await c.req.valid('json')
//     const {year_month, start, yilun} = body
//     // 拆分 年、月
//     const [yearStr, monthStr] = year_month.split('/')
//     const year = Number(yearStr)
//     const month = Number(monthStr)
//     const baseDate = dayjs().year(year).month(month - 1).date(start )
//     const endDate = dayjs().year(year).month(month - 1).endOf('month')
//     const list: string[] = []

//     let current = baseDate.clone()

//     while (current.valueOf() <= endDate.valueOf()) {
//         list.push(current.format('MM/DD'))
//         current = current.add(yilun, 'day')
//     }
//     return c.json(success(list))
// })


restDay.post('/add', sValidator('json', addSchema), async (c) => {
  const body = await c.req.valid('json')
  const { day, list } = body
  const sorted = uniq(list.concat(day)).sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())

  return c.json(success(sorted))
})

export default restDay