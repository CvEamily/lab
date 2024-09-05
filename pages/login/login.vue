<template>
  <view class="bg _myTheme">
    <view class="content _myTheme1">
      <div>LOGIN</div>
      <form @submit="formSubmit" @reset="formReset">
        <input type="text" name="username" v-model="username" placeholder="学号" placeholder-class="placeholderClass">
        <input type="password" name="password" placeholder="密码" placeholder-class="placeholderClass">
        <button form-type="submit" class="send">
          <box class="icon">
            <uni-icons type="paperplane" size="15" color="white"></uni-icons>
          </box>
          SEND
        </button>
      </form>
    </view>
    <div class="forget _myTheme" @click="gotoPassword">Forget password?</div>
    <div class="forget face _myTheme" @click="gotoFace">Face recognition</div>
    <div class="reg" @click="gotoRegister">Register now</div>
  </view>
</template>

<script>
  import config from '../../utils/config'
  export default {
    data() {
      return {
        token:'',
        url:config.host+'/user/login',
        user_info:[],
        username:'',
        socketTask2: null,
        info:[],
      };
    },
    onLoad(){
    },
    methods: {
      closeSocket(){
        // 关闭 WebSocket 连接。
        const that = this
        uni.closeSocket({
          success(res) {
            that.socketOpen = false;
            console.log("关闭成功", res)
          },
          fail(err) {
            console.log("关闭失败", err)
          }
        });
      },
      connectSocketInit(){
        this.socketTask2 = uni.connectSocket({
        	url: config.WebSocket+`/websocket2/${this.username}`,
          success:()=>{
            console.log('this.socketTask = uni.connectSocket success');
          }
        });
        console.log(this.socketTask2);
        // 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
        this.socketTask2.onOpen((res) => {
          console.log("WebSocket连接正常打开中...！");
          this.socketOpen = true;
          // 注：只有连接正常打开中 ，才能正常成功发送消息
          this.socketTask2.send({
            data: "uni-app发送一条消息",
            async success() {
              console.log("消息发送成功");
            },
          });
          // 注：只有连接正常打开中 ，才能正常收到消息
        })
        this.socketTask2.onMessage((res) => {
          this.info=JSON.parse(res.data)
          wx.setStorageSync('allUser',this.info.allUser);
          wx.setStorageSync('onlineUsers',this.info.onlineUsers);
          wx.setStorageSync('unreadsum',this.info.unreadsum);
        });
        this.socketTask2.onClose(() => {
          console.log("已经被关闭了")
        })
      },
      gotoFace(){
        uni.navigateTo({
          url: './faceLogin/faceLogin'
        })
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      setUser(){
        wx.setStorageSync('user_info',this.user_info)
      },
      async allinformation(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/user/allinformation', params);  
      	if (res.code == 1) {
          this.user_info=res.data;
          this.setUser();
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: '加载失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      //登录
			async formSubmit(e) {
				const params = {
					"username": e.detail.value.username,
					"password": e.detail.value.password,
           "setMyHeaderxxx": { 
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json",
          },
          "unToken":true
				};
        // 开启loading
				uni.showLoading({
					title:"登录中"
				})
        //发送请求
        const {data: res} = await uni.$http.post(this.url, params);
				if (res.code == '1') {
          wx.setStorageSync('token',res.data.token);
          this.getToken();
          await this.allinformation();
          await this.connectSocketInit();
          uni.switchTab({
            url:'/pages/index/index'
          })
					return uni.showToast({
						title: '成功',
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '失败',
						duration: 2000,
						icon: 'none'
					});    
				}
			},
      gotoRegister(){
        uni.navigateTo({
          url: './register/register'
        })
      },
      gotoPassword(){
        uni.navigateTo({
          url: './Password/Password'
        })
      }
    }
}
</script>

<style lang="scss">
  .bg{
    display: table-cell;
    vertical-align: middle;
    width: 800rpx;
    height: 1206rpx;
    background-color: #ebedee;
    .content{
      width: 800rpx;
      height: 600rpx;
      text-align: center;
      div{
        display: flex;
        justify-content: center;
        align-item: center;
        flex-direction: column;
        top: -200rpx;
        left: 0;
        width: 800rpx;
        height: 150rpx;
        font-size: 40rpx;
        font-weight: 700;
      }
      form{
        display: flex;
        justify-content: center;
        align-item: center;
        flex-direction: column;
        top: -200rpx;
        left: 0;
        input{
          width:600rpx;
          height: 90rpx;
          font-size: 20;
          margin: 0 auto;
          margin-top: 20rpx;
          padding-left: 40rpx;
          border-radius: 50rpx;
          background-color: #f2f2f2;
        }
        .placeholderClass{
          color: #c2c6df;
          font-size: 25rpx;
          font-weight: 700;
          text-align: left;
        }
        button{
          width: 240rpx;
          height: 80rpx;
          font-size: 35rpx;
          text-align: center;
          line-height: 80rpx;
          color: #827ffe;
        }
        .send{
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
    .forget{
      position: absolute;
      top: 920rpx;
      left: 450rpx;
      width: 300rpx;
      height: 50rpx;
      color: black;
      font-size: 28rpx;
      font-weight: 700;
    }
    .face{
      top: 1000rpx;
    }
    .reg{
      position: absolute;
      top: 920rpx;
      left: 60rpx;
      width: 300rpx;
      height: 50rpx;
      color: #827ffe;
      font-size: 28rpx;
      font-weight: 700;
    }
  }
</style>
