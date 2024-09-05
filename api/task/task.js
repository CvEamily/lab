import { $myhttp } from '@/utils/request.js'
import config from '@/utils/config.js' // 以后 最好request里confighost，放这不好 

export const add = (task, time) => { 
  return $myhttp.post(config.host +'/schedule/add', {
    time,
    task,
    "setMyHeaderxxx": {
        'content-type': 'application/x-www-form-urlencoded',
        "accept": "application/json"
     }
  })
  // return $myhttp.post('/schedule/add');request里有config.host 长这样
}