<template>
  <view class="bg">
    <view class="infor">
      <view class="user">
        <image :src="img" mode="aspectFill"></image>
      </view>
      <div class="username">
        账号 {{user_info.username}}
      </div>
      <div class="realname">
        姓名 {{user_info.name}}
      </div>
      <div class="sex">
        性别 {{user_info.sex?user_info.sex:'未填写'}}
      </div>
      <div class="grade">
        年级 {{user_info.grade}}
      </div>
      <div class="pro">
        专业 {{user_info.profession?user_info.profession:'未填写'}}
      </div>
      <div class="phone">
        手机 {{user_info.telephone?user_info.telephone:'未填写'}}
      </div>
      <div class="email">
        邮箱 {{user_info.email}}
      </div>
      <view class="signature">
        个性签名：{{user_info.personalsignature?user_info.personalsignature:'这家伙很懒什么都没留下。'}}
      </view>
      <button class="register" @click="gotoRevise()">
        Revise
      </button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
            email:'',
            title: 'picker',
            array: ['——请选择年级——','2019', '2020', '2021', '2022'],
            index: 0,
            grade:'',
            token:'',
            img:'https://ts1.cn.mm.bing.net/th/id/R-C.20dc03ef0ee10f50f8ccba5c38e6ac7d?rik=7dzyx%2bhMuJu73g&riu=http%3a%2f%2fwww.gx8899.com%2fuploads%2fallimg%2f2018040709%2frhilmrbilow.jpg&ehk=V9Dt0TaIN2I%2fhzL3NDXhpRzfZ7eNx8lLv6f1iw9AjG0%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
            user_info:[],
      }
    },
    onLoad(){
      this.getToken()
      this.getUser()
    },
    methods: {
      getUser(){
       this.user_info=wx.getStorageSync("user_info")
       console.log(this.user_info);
      },
      //获取token
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      //跳转修改个人信息页面
      gotoRevise(){
       uni.navigateTo({
         url: '../revise/revise'
       })
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
    height: 2000rpx;
    background-color: #ebedee;
    .infor{
      padding-top: 100rpx;
      padding-bottom: 50rpx;
      background-color: #f2f2f2;
      .user{
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 150rpx;
        height: 150rpx;
        margin-left: 300rpx;
        border: 8rpx solid white;
        border-radius: 150rpx;
        image{
          height: 100%;
          width: 100%;
        }
      }
      div{
        width:600rpx;
        height: 100rpx;
        padding-left: 50rpx;
        margin-top: 20rpx;
        margin-left: 50rpx;
        line-height: 100rpx;
        border-radius: 50rpx;
        background-color: white;
      }
      .username{
        margin-top: 50rpx;
      }
      .signature{
        width: 580rpx;
        height: 200rpx;
        margin-top: 40rpx;
        margin-bottom: 70rpx;
        margin-left: 45rpx;
        padding: 40rpx;
        border-radius: 50rpx;
        background-color: white;
      }
    }
    .register{
      width: 200rpx;
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      color: white;
      font-size: 30rpx;
      font-weight: 900;
      background-color: #827ffe;
      border-radius: 50rpx;
    }
  }
</style>
