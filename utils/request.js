import {$http} from'@escook/request-miniprogram' 
// import config from './config.js'
// $http.baseUrl = config.host // 在这设置每次请求根路径就不用每次config。host了
// 因为 uni.$http 和 这 用的 同一个 @escook/request-miniprogram ，这设置了 你之前的就也设置了
// 以后照着这个写就行 但是config 以后别每次都映入了，用上面注释的方法 自定义请求头也别乱用，token直接请求拦截器里默认加上

 //请求拦截器
 $http.beforeRequest = function(options) {
    uni.showLoading({
      title: '数据加载中...'
    })
    if(options.data.setMyHeaderxxx){
     options.header = options.data.setMyHeaderxxx
     //这个是用来自定义请求头的一般上传文件用因为上传文件有时候要通过头 改文件类型
    }
    // 一般在这 options.header.token 加上token就不用每次加了
    const token = wx.getStorageSync("token")
    console.log(options);
    options.header.token = token || '' // undeine 没有时传空
    //加上了
    if (options.data.unToken) {
      delete options.header.token 
     }
  }
  
 //响应拦截器
 $http.afterRequest = function() {
   uni.hideLoading()
   // 一般在这 判断登录过期 过期要看后端规定的状态码是多少例如 408
   // if (res.status 或者 res.code == 408) { 清除本地token，uni.跳转到登录页面 }
 }
 
 export const $myhttp = $http // 导出
 
 // export const导出就是 把它放{ $myhttp } 对象里, const 文件 = { $myhttp }
 // export default 就是把$myhttp作为整个对象导出,const 文件 =  $myhttp 