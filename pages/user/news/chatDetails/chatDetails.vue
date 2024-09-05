<template>
  <view>
    <div class="top">
      <text>{{tousername}}</text>
      <div class="uniIcon">
        <uni-icons color='' type="more-filled" size="15"></uni-icons>
      </div>
    </div>
    <!-- body -->
    <div class="body _myTheme">
      <template v-for="(item,i) in messages">
        <div :class="{'new2': item.username === username , 'new': true }" :key="item.id" v-if="messages.length!=0">
            <view class="user">
              <image :src="item.username === username ? img2 : img" mode="aspectFill"></image>
            </view>
          <text class="_myTheme1">{{item.message}}</text>
        </div>
      </template>
    </div>
    <!-- body -->
    <div class="enter _myTheme1">
      <div class="uniIcon">
        <uni-icons color=''  type="mic" size="28"></uni-icons>
      </div>
      <input class="_myTheme" type="text" v-model="textMessage" @input="changeSend" v-if="!send" focus="true">
      <input class="_myTheme another" type="text" v-model="textMessage" @input="changeSend" v-else focus="true">
      <div class="uniIcon">
        <uni-icons color='' type="heart" size="28"></uni-icons>
      </div>
      <div class="uniIcon" v-if="!send">
        <uni-icons color='' type="plus" size="28"></uni-icons>
      </div>
      <div class="deliver" v-else @click="clickRequest">发送</div>
    </div>
  </view>
</template>

<script>
  import config from '@/utils/config.js'
  export default {
    data() {
      return {
        img:'',
        img2:'',
        tousername: '',
        username: '',
        textMessage:'',
        socketTask: null,
        socketOpen: false,
        socketOpening: false,
        socketMsgQueue: [],
        messages:[
          {
            message:'',
            username:'',
            tousername:''
          }
        ],
        send:false,
      };
    },
    onLoad(options){
      console.log(options);
      this.tousername = options.tousername
      this.username = options.username
      console.log(this.username+'user');
      console.log(this.tousername+'touser');
    },
    onShow(){
      console.log('onshow');
      if (!this.socketOpening && !this.socketOpen) this.connectSocketInit() // 防止 安卓返回桌面超过10s，回到聊天页面websocket自动断开
    },
    onUnload(){
      console.log('onUnload');
      this.closeSocket()
    },
    methods:{
      changeSend(){
        if(this.textMessage){
          this.send=true
        } else{
          this.send=false
        }
      },
      //关闭webSocket
      closeSocket() {
        console.log('调用成功');
        const that = this
        this.socketTask.close({
          success(res) {
            that.socketOpen = false;
            console.log("关闭成功", res)
          },
          fail(err) {
            console.log("关闭失败", err)
          }
        })
      },
      //发送信息
      clickRequest(){
        if (this.socketOpen) {
          let text={
            "message":this.textMessage,
            "username":this.username,
            "to":this.tousername
          };
          console.log(text);
          this.socketTask.send({
            data:JSON.stringify(text),
            async success() {
              console.log("消息发送成功");
            },
          });
          this.socketTask.onMessage((res) => {
            if(res.data.charAt(3)=='c'){
              this.messages=JSON.parse(res.data)
            }
            console.log(res.data);
            console.log(res.data.charAt(3));
          });
        } 
        else 
        {
          socketMsgQueue.push(this.message);
        }
      },
      // 开启 WebSocket 连接。
      connectSocketInit(){
        this.socketOpening = true,
        this.socketTask = uni.connectSocket({ 
        	url: config.WebSocket+`/websocket/${this.username}/${this.tousername}`,
          success:()=>{
            console.log('this.socketTask = uni.connectSocket success');
          }
        });
        this.socketTask.onOpen((res) => {
          console.log("WebSocket连接正常打开中...！");
          this.socketOpen = true;
          this.socketOpening = false,
          this.socketTask.send({
            data: "发送一条消息",
            async success() {
              console.log("消息发送成功");
            },
          });
        })
        this.socketTask.onMessage((res) => {
          if(res.data.charAt(3)=='o'){
            let mess = JSON.parse(res.data)
            this.messages= mess.data.messages
            console.log('888888');
            console.log(this.messages);
            let hashmap = mess.data.hashmap
            console.log('999999');
            let img =this.username
            let img2 = this.tousername
            this.img='http://106.54.177.78:9112/'+hashmap[img]
            this.img2='http://106.54.177.78:9112/'+hashmap[img2]
          }
          console.log(res.data.charAt(3));
        });
        this.socketTask.onClose(() => {
          console.log("已经被关闭了")
        })
      }
    }
  }
</script>

<style lang="scss">
view{
  .top{
    width: 100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    border-bottom: 1rpx solid #e5e5e5;
    text{
      font-weight: 550;
    }
    .uniIcon{
      float: right;
      padding-left: 20rpx;
      padding-right: 20rpx;
    }
  }
  .body{
    overflow-y: scroll;
    width: 100%;
    height: 80vh;
    padding-top: 10rpx;
    background-color: #ededed;
    .new, .new2{
      float: left;
      width: 100%;
      box-sizing: border-box;
      padding: 25rpx;
      .user{
        float: left;
        width: 90rpx;
        height: 90rpx;
        margin-right: 20rpx;
        box-sizing: border-box;
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
      text{
        float: left;
        line-height: 60rpx;
        padding: 15rpx;
        max-width: 530rpx;
        min-height: 60rpx;
        border-radius: 10rpx;
      }
    }
    .new2{
      float: right !important;
      .user{
        float: right !important;
        image{
        }
      }
      text{
        float: right !important;
      }
    }
  }
  .enter{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 10vh;
    .uniIcon{
      float: left;
      padding: 5rpx;
      padding-top: 30rpx;
    }
    .deliver{
      float: right;
      width: 120rpx;
      height: 60rpx;
      margin-top: 25rpx;
      margin-right: 10rpx;
      color: white;
      text-align: center;
      line-height: 60rpx;
      font-size: 30rpx;
      background-color: #07c160;
      border-radius: 10rpx;
    }
    input{
      float: left;
      width: 520rpx;
      height: 70rpx;
      padding-left: 20rpx;
      margin-top: 20rpx;
      // background-color: white;
    }
    .another{
      width: 460rpx;
    }
  }
}
</style>
