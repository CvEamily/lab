<template>
  <view class="bg">
    <camera device-position="front" flash="off" @error="error" style="width: 500rpx; height: 500rpx; border-radius: 250rpx; margin-left: 120rpx; margin-top: 100rpx; margin-bottom: 50rpx;"></camera>
    <button type="primary" @click="Login();">登录</button>
     <canvas id="myCanvas" type="2d" hidden="true"></canvas>
  </view>
</template>

<script>
import config from '../../../utils/config.js'
  export default {
   data() {
     return {
         src: "",
         username: '123',
         faceBase: "",
     }
   },
   methods: {
     //使用canvas 获取图片base64
       async getImageBase64_canvas(tempFilePath) {
         console.log(this.src);
         const {
           width,
           height
         } = await wx.getImageInfo({
           src: this.src
         });
         const base64 = await new Promise(resolve => {
           const query = wx.createSelectorQuery();
           query.select("#myCanvas").fields({
             node: true, // 获取 node
           }).exec(res => {
             let {
               node: canvas
             } = res[0];
             let ctx = canvas.getContext('2d');
             let image = canvas.createImage();
             console.log(image);
             image.src = this.src;
             image.onload = () => {
               ctx.drawImage(image, 0, 0, width, height);
               resolve(canvas.toDataURL())
             }
           });
         });
         base64?this.faceBase=base64.slice(22):this.faceBase=0
         uni.setStorage({
          key: 'base64_',
          data: this.faceBase,
          success: function () {
            console.log('success');
          }
         });
       },
        takePhoto() {
           const ctx = uni.createCameraContext();
           ctx.takePhoto({
               quality: 'high',
               success: (res) => {
                   this.src = res.tempImagePath
               }
           });
       },
       error(e) {
           console.log(e.detail);
       },
       async Login(e) {
         this.takePhoto();
         await this.getImageBase64_canvas();
        const params = {
          "faceBase":this.faceBase,
            "setMyHeaderxxx": { 
               'content-type': 'application/x-www-form-urlencoded',
               "accept": "application/json"
             },
             "unToken":true
        };
        uni.showLoading({
          title:"Loading"
        })
         const {data: res} = await uni.$http.post(config.host+'/face/login', params);
        if (res.code == '1') {
          console.log(res.message);
          return;
        } 
          uni.showToast({
            title: '失败',
            duration: 2000,
            icon: 'none'
          });    
      }
   }
  }
</script>

<style lang="scss">
.bg{
  camera{
    
  }
}  
</style>
