<template>
  <view class="_myTheme">
    <view class="user" style="background-image: url(../../../static/avatar.jpg);background-size: 100% 100%;" @click="addAvatar()"></view>
    <view class="form" >
      <form @submit="formSubmit" style="background-color: antiquewhite;">
        <input type="number" name="username" placeholder="学号" placeholder-class="placeholderClass">
        <input type="text" name="name" placeholder="真实姓名" placeholder-class="placeholderClass">
        <input type="password" name="password" placeholder="密码" placeholder-class="placeholderClass">
        <view class="grade">
          <view class="uni-list">
            <view class="uni-list-cell" style="border-radius: 50rpx;">
              <view class="uni-list-cell-db">
                <picker @change="bindPickerChange" :value="index" :range="array">
                  <view class="uni-input,placeholderClass">{{array[index]}}</view>
                </picker>
              </view>
            </view>
          </view>
        </view>
        <input type="email" name="email" placeholder="邮箱" v-model="email" class="email" placeholder-class="placeholderClass">
        <input type="text" name="code" placeholder="验证码" class="captchaInput" placeholder-class="placeholderClass">
        <button @click="getCaptcha()">获取验证码</button>
        <button form-type="submit" class="register">
          <view class="icon">
            <uni-icons type="paperplane" size="15" color="white"></uni-icons>
          </view>
          SEND
        </button>
      </form>
    </view>
  </view>
</template>

<script>
  import config from '../../../utils/config'
  export default {
    data() {
      return {
            email:'',
            title: 'picker',
            array: ['——请选择年级——','2019', '2020', '2021', '2022'],
            index: 0,
            grade:'',
            token:'',
      }
    },
    onLoad(){
      this.getToken()
    },
    methods: {
      //获取token
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      //添加头像
      addAvatar() {
        wx.chooseImage({
          count: 1,
          success (res) {
            console.log(res);
            // const tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url:config.host+'/common/upload', 
              filePath: ""+res.tempFilePaths[0],
              name: 'file',
              formData: {
                'user': 'test'
              },
              header: {
                  'token': token
              },
              success (res){
                console.log(res);
                const data = res.data
              }
            })
          }
        })
      },
      //下拉框
      bindPickerChange: function(e) {
                  this.index = e.detail.value
                  this.grade=this.array[this.index]
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
         res = await uni.$http.post(config.host+'/user/mail',params)
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
          },
          "unToken":true
      	};
        // 开启loading
      	uni.showLoading({
      		title:"注册中"
      	})
        //发送请求
        const {data: res} = await uni.$http.post(config.host+'/user/register', params);
      	
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
  view{
    .user{
         position: relative;
         left: 285rpx;
         top: 75rpx;
         z-index: 1;
         width: 190rpx;
         height: 190rpx;
         border-radius: 50%;
       }
    .form {
     position: relative;
     top: 100rpx;
     left: 0;
     padding-left: 70rpx;
       input{
         position: absolute;
         top: 0;
         left: 70rpx;
         width:600rpx;
         height: 80rpx;
         padding-left: 20rpx;
         font-size: 20;
         border: 1rpx solid black;
         border-radius: 50rpx;
       }
       
       .placeholderClass{
         color: #c2c6df;
         font-size: 25rpx;
       }
       
       input:nth-child(2){
         top:120rpx;
       }
       input:nth-child(3){
         top:240rpx;
       }
       .grade{
         position: absolute;
         top: 360rpx;
         left: 70rpx;
         width:620rpx;
         border-radius: 50rpx;
         .uni-list{
           border-radius: 50rpx;
         }
         .uni-list-cell-db{
           border-radius: 50rpx;
           picker{
             border-radius: 50rpx;
             .uni-input{
               width:620rpx;
               height: 80rpx;
               text-align: center;
               line-height: 80rpx;
               border: 1rpx solid black;
               border-radius: 50rpx;
             }
           }
         }
       }
     
       .email{
         top:480rpx;
       }
       
       .captchaInput{
         top:600rpx;
         width: 300rpx;
       }
     
       button{
         position: absolute;
         top: 600rpx;
         left: 430rpx;
         width:250rpx;
         height: 80rpx;
         text-align: center;
         line-height: 80rpx;
         color: #827ffe;
       }
       
       .register{
         top: 750rpx;
         left: 252rpx;
         width:250rpx;
         height: 100rpx;
         padding-left: 70rpx;
         text-align: center;
         line-height: 100rpx;
         color: white;
         font-size: 25rpx;
         font-weight: 700;
         background-color: #827ffe;
         border-radius: 55rpx;
         
         .icon{
           position: absolute;
           top: 0;
           left: 75rpx;
           font-weight: 400;
           background-color: #827ffe;
         }
       }
    }
  }

</style>
