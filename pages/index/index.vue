<template>
<view class="container">
  <view class="user" v-if="token" @click="gotoUser()">
    <image :src="img" mode="aspectFill"></image>
  </view>
  <view class="login" @click="gotoLogin()">
    {{token? '登出':'登录'}}
  </view>
  <view class="attendance ._myTheme" @click="gotoAtt()">
    <view class="icon">
      <uni-icons type="calendar-filled" size="30"></uni-icons>
    </view>
    <view class="contentOne">
      签到
    </view>
    <view class="contentTwo">
      {{time}}
    </view>
  </view>
</view>
</template>

<script>
  import utils from '../../utils/util.js'
	export default {
		data() {
			return {
        bgbase64:'',
        random: 0,
        img:'https://ts1.cn.mm.bing.net/th/id/R-C.20dc03ef0ee10f50f8ccba5c38e6ac7d?rik=7dzyx%2bhMuJu73g&riu=http%3a%2f%2fwww.gx8899.com%2fuploads%2fallimg%2f2018040709%2frhilmrbilow.jpg&ehk=V9Dt0TaIN2I%2fhzL3NDXhpRzfZ7eNx8lLv6f1iw9AjG0%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
        token:'',
        timeNow:'',
			}
		},
    computed:{
      time(){
        return this.timeNow? this.timeNow.slice(5,10):"00:00"
      }
    },
    onShow(){
      this.getToken()
    },
		onLoad() {
      this.getToken()
      this.getRandombg()
      this.getTime()
		},
		methods: {
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
        this.timeNow =`${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      getRandombg() {
        let random = Math.floor(Math.random()*10+1)
        this.random = random
      },
      gotoUser(){
       uni.navigateTo({
         url: '../user/user'
       })
      },
      gotoLogin(){
        if(this.token){
          uni.setStorage({
          	key: 'token',
          	data: '',
          	success: function () {
          		console.log('token清空success');
          	}
          });
          this.token=''
        } else {
          uni.navigateTo({
            url: '../login/login'
          })
        }
      },
      gotoAtt(){
        if(this.token){
          uni.navigateTo({
            url: '../study/attendance/attendance'
          })
        }else{
          uni.navigateTo({
            url: '../../pages/login/login'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
 .container{
   width: 100%;
   height: 1210rpx;
   margin: 0;
   padding: 0;
   position: relative;
   background-image: url('https://tse3-mm.cn.bing.net/th/id/OIP-C.vspuQHICOxog7LicqMaXJwHaLF?pid=ImgDet&rs=1');
   background-size: 100% 100%;
   
   .user{
     position: absolute;
     top: 70rpx;
     left: 20rpx;
     width: 90rpx;
     height: 90rpx;
     display: flex;
     justify-content: center;
     align-items: center;
     overflow: hidden;
     box-shadow: 0 0 2rpx 2rpx white;
     border-radius: 50rpx;
     image{
       height: 100%;
       width: 100%;
     }
   }
   
   .login{
     position: absolute;
     right: 30rpx;
     top: 75rpx;
     font-size: 30rpx;
   }
   
   .attendance{
      position: absolute;
      left: 280rpx;
      top: 300rpx;
      width: 230rpx;
      height: 240rpx;
      border-radius: 25%;
      text-align: center;
      // background-color: rgba(232, 232, 232, .3);
      background-color: #e3e5e4;
   }
     
     .icon{
       padding-top: 28rpx ;
       
       uni-icons{
         padding-top: 100rpx;
       }
     }
     
    .contentOne{
      position: absolute;
      top: 110rpx;
      width: 100%;
      height: 50rpx;
      font-size: 40rpx;
      font-weight: 550;
    }
    
    .contentTwo{
      position: absolute;
      top: 170rpx;
      width: 100%;
      height: 50rpx;
      font-size: 25rpx;
    }
 }
</style>
