<template>
  <view>
    <view class="content">
      <div>RECOVER THE PASSWORD</div>
      <form @submit="formSubmit" @reset="formReset">
        <input type="text" name="username" v-model="username" placeholder="Username" placeholder-class="placeholderClass">
        <input type="text" name="password" placeholder="Password" placeholder-class="placeholderClass">
        <input type="text" name="email" placeholder="E-mail" v-model="email" placeholder-class="placeholderClass">
        <input type="text" name="code" placeholder="Captcha" placeholder-class="placeholderClass">
        <button @click="getCaptcha()">获取验证码</button>
        <button form-type="submit" class="send">
          <box class="icon">
            <uni-icons type="paperplane" size="15" color="white"></uni-icons>
          </box>
          SEND
        </button>
      </form>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
            email:'',
            username:''
      }
    },
    onLoad(){
      
    },
    methods: {
      //获取验证码
      async getCaptcha() {
        const params={
          "email":this.email,
          "username":this.username,
          "setMyHeaderxxx": { 
                     'content-type': 'application/x-www-form-urlencoded',
                     "accept": "application/json"
                   }
        },
        //发送请求
         res = await uni.$http.post('http://ckittx.natappfree.cc/user/forgetmail',params)
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
      //登录
      async formSubmit(e) {
        console.log(e);
      	const params = {
      		"username": e.detail.value.username,
      		"password": e.detail.value.password,
          "email":e.detail.value.email,
          "code":e.detail.value.code,
           "setMyHeaderxxx": {
                      'content-type': 'application/x-www-form-urlencoded',
                      "accept": "application/json"
                    }
      	};
        // 开启loading
      	uni.showLoading({
      		title:"确认中"
      	})
        //发送请求
        const {data: res} = await uni.$http.post('http://ckittx.natappfree.cc/user/forgetpassword', params);
      	
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
      },
    }
  }
</script>

<style lang="scss">
  view{
    // position: absolute;
    display: table-cell;
    vertical-align: middle;
    width: 800rpx;
    height: 1206rpx;
    background-color: #ebedee;
    
    .content{
      width: 800rpx;
      height: 850rpx;
      margin: 0 auto;
      text-align: center;
      background-color: #f2f2f2;
      
      div{
        position: relative;
        top: -300rpx;
        left: 0;
        width: 800rpx;
        height: 100rpx;
        font-size: 40rpx;
        font-weight: 700;
        background-color: #f2f2f2;
      }
      
      form{
        position: relative;
        top: -300rpx;
        left: 0;
        
        
        input{
          position: absolute;
          top: 40rpx;
          left: -300rpx;
          width:600rpx;
          height: 90rpx;
          font-size: 20;
          margin: 0 auto;
          padding-left: 40rpx;
          // text-align: center;
          border-radius: 50rpx;
          background-color: white;
        }
        
        .placeholderClass{
          color: #c2c6df;
          font-size: 25rpx;
          font-weight: 700;
          text-align: left;
        }
        
        input:nth-child(2){
          top: 150rpx;
        }
        
        input:nth-child(3){
          top: 260rpx;
        }
        
        input:nth-child(4){
          top: 370rpx;
          width: 250rpx;
        }
        
        button{
          position: absolute;
          top: 375rpx;
          left: 50rpx;
          width: 240rpx;
          height: 80rpx;
          font-size: 35rpx;
          text-align: center;
          line-height: 80rpx;
          color: #827ffe;
        }
        
        .send{
          top: 510rpx;
          left: -85rpx;
          width: 180rpx;
          height: 80rpx;
          color: white;
          font-size: 25rpx;
          font-weight: 700;
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
