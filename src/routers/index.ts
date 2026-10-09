import { Hono } from 'hono'
import restDay from './restday'


const api = new Hono()

api.route('/restDay', restDay)

export default api