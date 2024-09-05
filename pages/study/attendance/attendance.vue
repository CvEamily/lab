<template>
  <view class="bg">
    <view class="top">
      <img src="../../../static/pun.png" alt="">
      <view class="saying">时间是唯一没有野心的批评家。</view>
    </view>
    <view class="time">
      <smh-timer ref="timer" @timing="timing" :auto="false"></smh-timer>
    </view>
    <div class="stop">
      <button @click="clear();open();" class="stopbut"></button>
      <uni-popup ref="popup" type="bottom" :mask-click="false">
        <textarea name="" id="" cols="30" rows="10" placeholder="请输入学习内容..." v-model="content"></textarea>
        <button @click="close();gotoIndex();getTime();getUpTime();endAttend();">
          <box class="icon">
            <uni-icons type="paperplane" size="15" color="white"></uni-icons>
          </box>
          SEND
        </button>
      </uni-popup>
    </div>
  </view>
</template>

<script>
  import config from '../../../utils/config.js'
  var util=require('../../../utils/util'); 
  export default {
    data() {
      return {
        token:'',
        timeNow:'',
        now:Date.now(),
        img:'',
        content:'',
        create_time:'',
        update_time:''
      }
    },
    onLoad(){
      this.getTime()
      this.getToken()
      this.start()
      this.getCreateTime()
    },
    onReady() {},
    methods: {
      gotoIndex(){
        uni.switchTab({
           url: '../../index/index'
        })
      },
      getCreateTime(){
        this.create_time=this.timeNow
        console.log("getCreateTime create_time"+this.create_time);
      },
      getUpTime(){
        this.update_time=this.timeNow
        console.log("GetUPtime update_time"+this.update_time);
      },
      //弹出框
      open(){
        this.$refs.popup.open('center')
      },
      close() {
        this.$refs.popup.close()
      },
      //实时返回计时时间
      timing(second){
        console.log(second)
      },
      //重置计时器
      reset(){
        this.$refs.timer.reset()
      },
      //手动开启计时器
      start(){
        this.$refs.timer.start()
      },
      //停止计时器
      clear(){
        this.$refs.timer.clear()
      },
      getTime(){
        const myDate = new Date()
        const year=myDate.getFullYear()
        const month=myDate.getMonth()+1
        const day=myDate.getDate()
        const hour=myDate.getHours()
        const minute = myDate.getMinutes()
        const second = myDate.getSeconds()
        const formatNumber = n => {
          n = n.toString()
          return n[1] ? n : `0${n}`
        }
        this.timeNow =`${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
      },
      //获取token
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      //结束签到 保存学习记录
      async endAttend(){
        const params = {
          "content":this.content,
          "create_time":this.create_time,
        	"update_time":this.update_time,
           "setMyHeaderxxx": {
                      'content-type': 'application/x-www-form-urlencoded',
                      "accept": "application/json",
                      "token":this.token
                    }
        };
        console.log("打印create_time:"+this.create_time);
        console.log("打印update_time:"+this.update_time);
        //发送请求
        const {data: res} = await uni.$http.post(config.host+'/journal/recordendwx', params);
        if (res.code == '1') {
        	uni.showToast({
        		title: '学习记录保存成功',
        		duration: 2000,
        		icon: 'none'
        	});
        } else {
        	uni.showToast({
        		title: '学习记录保存失败',
        		duration: 2000,
        		icon: 'none'
        	});    
        }
      }
    }
  }
</script>

<style lang="scss">
  .bg{
    width: 800rpx;
    height: 1300rpx;
    padding-top: 50rpx;
    background-image: url('https://tse3-mm.cn.bing.net/th/id/OIP-C.vspuQHICOxog7LicqMaXJwHaLF?pid=ImgDet&rs=1');
    background-size: 100% 100%;
    .top{
      img{
        width: 100rpx;
        height: 100rpx;
      }
      .saying{
        color: white;
        font-family: fangsong;
        font-size: 40rpx;
        padding-left: 100rpx;
      }
    }
    .time{
      margin-top: 300rpx;
    }
    .stop{
      margin-top: 500rpx;
      .stopbut{
        width: 50rpx;
        height: 50rpx;
        background-color: white;
        border: none;
      }
      uni-popup{
        // background-color: palegoldenrod;
        border-radius: 50rpx;
        textarea{
          padding: 30rpx;
          border-radius: 50rpx;
          background-color: white;
        }
        button{
          width: 180rpx;
          height: 80rpx;
          color: white;
          font-size: 25rpx;
          font-weight: 700;
          margin-top: 60rpx;
          background-color: #827ffe;
          border-radius: 100rpx;
          .icon{
            margin-right: 10rpx;
            font-weight: 400;
          }
        }
      }
    }
  }
</style>
