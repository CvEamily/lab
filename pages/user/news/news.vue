<template>
  <view class="bg">
    <!-- 聊天窗口 -->
    <div class="body" v-if="staff"> 
      <template v-for="item in message2">
        <div class="task" @click="()=>gotoDetails(item)" :key="item.id">
          <div class="left">
            <image src="https://ts1.cn.mm.bing.net/th/id/R-C.78ea9dbc88906c245b9facd4773a2a61?rik=XCpjJdc17Tf37w&riu=http%3a%2f%2f15wo.oss-cn-beijing.aliyuncs.com%2fwallpaper%2fe8%2f1f1df9b79b78ed76966b3b5a681a9ea72fe9c7.jpg!1275x717&ehk=UsnotNjIM0lLuhwyeHUTdl%2bbReG301pzyqgt6jOzp0A%3d&risl=&pid=ImgRaw&r=0" mode="aspectFill"></image>
          </div>
          <div class="right">
            <div class="headline">{{item.tousername}}</div>
              <div class="mess" :key="item.id">{{item.message}}</div>
          </div>
        </div>
      </template>
    </div>
    <!-- 通讯录 -->
    <div class="body" v-if="!staff">
      <template v-for="item in allUser">
        <div class="task" @click="()=>gotoDetailsss(item)" :key="item.id">
          <div class="left">
            <image src="https://ts1.cn.mm.bing.net/th/id/R-C.78ea9dbc88906c245b9facd4773a2a61?rik=XCpjJdc17Tf37w&riu=http%3a%2f%2f15wo.oss-cn-beijing.aliyuncs.com%2fwallpaper%2fe8%2f1f1df9b79b78ed76966b3b5a681a9ea72fe9c7.jpg!1275x717&ehk=UsnotNjIM0lLuhwyeHUTdl%2bbReG301pzyqgt6jOzp0A%3d&risl=&pid=ImgRaw&r=0" mode="aspectFill"></image>
          </div>
          <div class="right">
            <div class="headline">{{item.nickname?item.nickname:item.username}}</div>
          </div>
        </div>
      </template>
    </div>
    <!-- tab栏 -->
    <div class="tab">
      <div class="tabItem" @click="changeChat">
        <uni-icons type="chatbubble" size="30" color="#888" v-if="chat" ></uni-icons>
        <uni-icons type="chatbubble-filled" size="30" color="#888" v-if="!chat"></uni-icons>
      </div>
      <div class="tabItem" @click="changeStaff">
        <uni-icons type="staff" size="30" color="#888" v-if="staff"></uni-icons>
        <uni-icons type="staff-filled" size="30" color="#888" v-if="!staff"></uni-icons>
      </div>
    </div>
  </view>
</template>

<script>
  import config from '@/utils/config.js'
  export default {
    data() {
      return {
        username: '',
        tousername:'',
        allUser:[
          {
            id:'',
            username:'加载中',
            name:'加载中',
            password:'',
            email:'加载中',
            grade:'加载中',
            profile_photo:'',
            telephoto:'加载中',
            nickname:'加载中',
            profession:'加载中',
            sex:'',
            personalsignature:'加载中',
            create_time:'',
            update_time:'',
          }
        ],
        onlineUsers:[],
        unreadsum:0,
        staff:true,
        chat:false,
        message:[],
        message2:[],
        startPoint:'0',
        slipFlag: false,
        user_info:{
          email:'',
          grade:'',
          nickname:'',
          personalsignature:'',
          profession:'',
          sex:'',
          telephone:'',
          username:''
        }
      };
    },
    async onLoad(){
      this.getUser()
      await this.getMessage()
      // await this.getUserInfo()
    },
    methods:{
      //获取用户信息
      getUser(){
        this.allUser=wx.getStorageSync("allUser")
        this.onlineUsers=wx.getStorageSync("onlineUsers")
        this.unreadsum=wx.getStorageSync("unreadsum")
        this.userInfo=wx.getStorageSync("user_info")
        this.username=this.userInfo.username
      },
      // 滑动事件
      myTouchStart(e) {
          this.slipFlag = true
          this.startPoint = e.touches[0]
      },
      myTouchMove(e) {
          if (((this.startPoint.clientX - e.touches[e.touches.length - 1].clientX) > 80) && this.slipFlag) {
              console.log("左滑事件");
              console.log("i="+i);
              this.slipFlag = false
              this.delete(tousername);
              this.getMessage();
              return
          } else if (((this.startPoint.clientX - e.touches[e.touches.length - 1].clientX) < -80) && this.slipFlag) {
              console.log("右滑事件");
              this.slipFlag = false
              // this.complete(id,i,status);
              return ;
          }
      },
      async delete(tousername) {
      	const params = {
          'tousername':tousername,
          "setMyHeaderxxx": {
              'token': this.token,
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.delete(config.host+`/message`, params);
      	if (res.code == 1) {
          console.log(res.message);
          this.getMessage();
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
      //获取消息列表
      async getMessage(e) {
      	const params = {}
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/message', params);
      	if (res.code == 1) {
          this.message2=res.data
          console.log('1111');
          console.log(this.message2);
      		return ;
      	} 
        console.log(res.code);
        uni.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        });    
      },
      changeStaff(){
        if(this.staff==true){
          this.staff=!this.staff
          this.chat=!this.staff
        }
      },
      changeChat(){
        if(this.chat==true)
        this.chat=!this.chat
        this.staff=!this.chat
      },
      gotoDetails(item){
        uni.navigateTo({
          url: '../news/chatDetails/chatDetails?tousername=' + item.tousername + '&username=' + item.username
        })
      },
      gotoDetailsss(item){
        uni.navigateTo({
          url: '../news/chatDetails/chatDetails?tousername=' + item.username + '&username=' + item.username
        })
      }
    }
  }
</script>

<style lang="scss">
.bg{
  .body{
    overflow-y: scroll;
    width: 680rpx;
    height: 92vh;
    .task{
      width: 710rpx;
      height: 120rpx;
      padding-left: 40rpx;
      padding-top: 30rpx;
      padding-bottom: 10rpx;
      .left{
        float: left;
        width: 100rpx;
        height: 100rpx;
        padding-bottom: 30rpx;
        image{
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
      .right{
        float: right;
        width: 580rpx;
        height: 100rpx;
        .headline{
          padding-bottom: 10rpx;
          font-size: 35rpx;
          font-weight: 500;
        }
        .mess{
          font-size: 30rpx;
          color: #a4a4a4;
        }
      }
    }
  }
  .tab{
    display: flex;
    width: 707rpx;
    height: 60rpx;
    padding: 20rpx;
    margin-top: 0;
    border-top: 1rpx solid #d8d8d8;
    border-bottom: 1rpx solid #d8d8d8;
    .tabItem{
      width: 50%;
      text-align: center;
    }
  }
}
</style>
