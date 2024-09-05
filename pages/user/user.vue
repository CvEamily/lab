<template>
  <view class="bg _myTheme">
    <div class="uniIcon" @click="gotoSett">
      <uni-icons type="gear-filled" size="30" color=" "></uni-icons>
    </div>
    <view class="user" @click="gotoCheck()">
      <image :src="img" mode="aspectFill"></image>
    </view>
    <view class="userName">
      {{user_info.username}}
    </view>
    <div class="box ">
      <div class="littleBox message _myTheme1" @click="gotoNews()">
        <view class="icon">
          <uni-icons type="chatbubble" size="50" color="black"></uni-icons>
        </view>
        消息
      </div>
      <div class="littleBox _myTheme1" @click="gotoSet()">
        <view class="icon">
          <uni-icons type="compose" size="50" color="black"></uni-icons>
        </view>
        我的博客
      </div>
      <div class="littleBox _myTheme1" @click="gotoCol()">
        <view class="icon">
          <uni-icons type="star-filled" size="50" color="black"></uni-icons>
        </view>
        收藏
      </div>
      <div class="littleBox task _myTheme1" @click="gotoTask()">
        <view class="icon">
          <uni-icons type="list" size="50" color="black"></uni-icons>
        </view>
        任务栏
      </div>
    </div>
  </view>
</template>

<script>
  import config from '../../utils/config.js'
  export default {
    data() {
      return {
            token:'',
            img:'https://ts1.cn.mm.bing.net/th/id/R-C.20dc03ef0ee10f50f8ccba5c38e6ac7d?rik=7dzyx%2bhMuJu73g&riu=http%3a%2f%2fwww.gx8899.com%2fuploads%2fallimg%2f2018040709%2frhilmrbilow.jpg&ehk=V9Dt0TaIN2I%2fhzL3NDXhpRzfZ7eNx8lLv6f1iw9AjG0%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
            userName:'username',
            user_info:[{email:'',grade:'',name:'',nickname:'',personalsignature:'',profession:'',sex:'',telephone:'',sex:'',username:''}]
      }
    },
    async onLoad(){
      this.getToken()
      await this.getUser()
    },
    methods: {
      gotoSett(){
        uni.navigateTo({
          url: '../user/set/set'
        })
      },
      getUser(){
       this.user_info=wx.getStorageSync("user_info")
       console.log(this.user_info);
      },
      gotoNews(){
       uni.navigateTo({
         url: './news/news'
       })
      },
      gotoSet(){
       uni.navigateTo({
         url: './myblog/myblog'
       })
      },
      gotoCol(){
       uni.navigateTo({
         url: './collection/collection'
       })
      },
      //跳转到任务栏
      gotoTask(){
       uni.navigateTo({
         url: './Task/Task'
       })
      },
      //跳转修改个人信息页面
      gotoCheck(){
       uni.navigateTo({
         url: './check/check'
       })
      },
      //获取token
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      //下拉框
      bindPickerChange: function(e) {
                  this.index = e.detail.value
                  this.grade=this.array[this.index]
                  // this.setData({
                  //   color:"black"
                  // })
      },
      //获取验证码
      async getCaptcha() {
        const params={
          "email":this.email,
          "setMyHeaderxxx": { 
                     'content-type': 'application/x-www-form-urlencoded',
                     "accept": "application/json"
                   }
        },
        //发送请求
         res = await uni.$http.post('http://ckittx.natappfree.cc/user/mail',params)
         if(res.code == 200){
           return uni.showToast({
           	title: '获取验证码成功，请查收邮件',
           	duration: 2000,
           	icon: 'none'
           });
         }else{
           return Error
         }
      },
      //注册
      async formSubmit(e) {
        console.log(e);
      	const params = {
      		"username": e.detail.value.username,
          "name":e.detail.value.name,
      		"password": e.detail.value.password,
          "email":e.detail.value.email,
          "grade":this.grade,
          "code":e.detail.value.code,
           "setMyHeaderxxx": {
                      'content-type': 'application/x-www-form-urlencoded',
                      "accept": "application/json"
                    }
      	};
        // 开启loading
      	uni.showLoading({
      		title:"注册中"
      	})
        //发送请求
        const {data: res} = await uni.$http.post('http://ckittx.natappfree.cc/user/registerwx', params);
      	
      	if (res.code == '1') {
      		return uni.showToast({
      			title: '注册成功',
      			duration: 2000,
      			icon: 'none'
      		});
      	} else if(res.code == '2'){
      		uni.showToast({
      			title: '用户名已存在',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}else if(res.code == '3'){
          uni.showToast({
          	title: '验证码错误',
          	duration: 2000,
          	icon: 'none'
          });  
        }else if(res.code == '0'){
          uni.showToast({
          	title: '数据库存储失败',
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
    height: 1180rpx;
    padding-top: 50rpx;
    text-align: center;
    background-color: #f2f2f2;
    .uniIcon{
      position: relative;
      top: 0rpx;
      left: 630rpx;
      width: 90rpx;
      height: 80rpx;
    }
    .user{
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 150rpx;
      height: 150rpx;
      margin-left: 300rpx;
      border: 5rpx solid #d3d8d2;
      border-radius: 150rpx;
      background-color: palegoldenrod;
      image{
        height: 100%;
        width: 100%;
      }
    }
    .userName{
      height: 150rpx;
      font-size: 40rpx;
      font-weight: 500;
    }
    .box{
      display: flex;
      flex-wrap: wrap;
      width: 900rpx;
      padding-left: 38rpx;
      .littleBox{
        width: 300rpx;
        height: 300rpx;
        margin-left: 25rpx;
        margin-bottom: 25rpx;
        padding-top: 70rpx;
        text-align: center;
        border-radius: 20rpx;
        background-color: white;
        .icon{
          padding-bottom: 40rpx;
        }
      }
    }
  }
</style>
