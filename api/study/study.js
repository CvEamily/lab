import { $myhttp } from '@/utils/request.js'
import config from '@/utils/config.js' // 以后 最好request里confighost，放这不好 
// export default 是 直接  import i from 使用 export const 是 {i} 使用
export const getNote = () => { // 如果是post 这里接收参数params 例如（id, p1， p2）
  return $myhttp.get(config.host +'/journal/wxtakeout'); 
  //.post('/kjl/sdf/' + id, { id: p1, name: p2})
  // 把http的promise异步结果直接作为函数返回值返回，函数导出
}
export const getData = () => { // 如果是post 这里接收参数params 例如（id, p1， p2）
  return $myhttp.get(config.host +'/journal/continue');
  //.post('/kjl/sdf/' + id, { id: p1, name: p2})
}

// 用就按页面放文件夹模仿这个文件 he study。vue

