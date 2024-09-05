<template>
  <view class="bg">
    <div class="pic">
      <div class="fac">
        <camera device-position="front" flash="off" @error="error" style="width: 250rpx; height: 250rpx; border-radius: 250rpx; "></camera>
      </div>
      <div class="tem">
        <view class="tit">预览</view>
        <image mode="widthFix" :src="src"></image>
      </div>
    </div>
    <button type="primary" @click="takePhoto();">拍照</button>
    <button @click="Reg">上传</button>
     <canvas id="myCanvas" type="2d" hidden="true"></canvas>
  </view>
</template>

<script>
import config from '../../../utils/config.js'
  export default {
   data() {
           return {
               src: "",
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
             	key: 'base64',
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
           async Reg() {
            await this.getImageBase64_canvas()
           	const params = {
              "faceBase":this.faceBase,
                "setMyHeaderxxx": { 
                   'content-type': 'application/x-www-form-urlencoded',
                   "accept": "application/json"
                 }
           	}
           	uni.showLoading({
           		title:"Loading"
           	})
             const {data: res} = await uni.$http.put(config.host+'/face/update', params);
           	if (res.code == '1') {
           		console.log(res.message);
              return;
           	} 
            uni.showToast({
              title: '失败',
              duration: 2000,
              icon: 'none'
            })    
          }
        }
  }
</script>

<style lang="scss">
.bg{
  .pic{
    height: 450rpx;
    display: flex;
    .fac{
      width: 50%;
      camera{
        margin-top: 100rpx;
        margin-left: 60rpx;
      }
    }
    .tem{
      width: 50%;
      .tit{
        padding-top: 20rpx;
        padding-left: 20rpx;
      }
      image{
        width: 250rpx; 
        height: 250rpx; 
        border-radius: 250rpx; 
        margin-top: 50rpx;
        margin-left: 60rpx;
        border: 1rpx solid black;
      }
    }
  }
  input{
    width:600rpx;
    height: 90rpx;
    font-size: 20;
    margin: 0 auto;
    margin-top: 50rpx;
    margin-bottom: 100rpx;
    padding-left: 40rpx;
    border-radius: 50rpx;
    background-color: white;
  }
  button{
    margin-top: 50rpx;
  }
}  
</style>
