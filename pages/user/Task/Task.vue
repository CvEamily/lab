<template>
  <view class="bg">
    <div class="compose stopbut _myTheme1" @click="open()">
      <uni-icons type="compose" size="30" color=""></uni-icons>
    </div>
    <uni-popup ref="popup" type="bottom" :mask-click="true">
      <textarea name="" id="" cols="30" rows="10" placeholder="请输入任务..." v-model="task"></textarea>
      <textarea name="" id="" cols="30" rows="10" placeholder="请输入时间..." v-model="time"></textarea>
      <button @click="close();add();" v-if="!mod">
        <box class="icon">
          <uni-icons type="paperplane" size="15" color="white"></uni-icons>
        </box>
        SEND
      </button>
      <button @click="close();modify();" v-if="mod" class="modi">
        <box class="icon">
          <uni-icons type="paperplane" size="15" color="white"></uni-icons>
        </box>
        SEND
      </button>
    </uni-popup> 
    <template v-if="task_info[0].id != -1">
      <template v-for="(item, i) in task_info" >
        <div :class="{'task':true,'white':!task_info[i].status,'grey':task_info[i].status,'class3':true,'_myTheme1':true}" @touchstart="myTouchStart" @touchmove="myTouchMove($event,task_info[i].id,i,task_info[i].status)" @longpress="open();PreModify($event,task_info[i].id);" :key="i">
          <div class="left">
            <image src="https://img.ixintu.com/download/jpg/202005/754801cac6b57ddcc755fa9b7428bafe_512_512.jpg!ys" mode="aspectFill"></image>
          </div>
          <div class="right">
            <div class="headline">{{task_info[i].task}}</div>
            <div class="body">{{task_info[i].time}}minutes</div>
          </div>
        </div>
      </template>
    </template>
    <view v-else class="myloading">
      加载中...
    </view>
  </view>
</template>

<script>
  import config from '../../../utils/config'
  import { add as _add } from '@/api/task/task.js'
  export default {
    data() {
      return {
        task:'',
        time:'',
        token:'',
        startPoint:'0', 
        slipFlag: false,
        task_info:[{id:-1,status:0,task:'加载中',time:'加载中',uid:0}],
        mod:false,
        id:''
      }
    },
    async onLoad(){
      this.getToken()
      await this.check()
    },
    methods:{
      //预备修改
      PreModify(e,id){
        this.mod=true;
        this.id=id;
      },
      // 完成任务
      async complete(id,i,status) {
        this.task_info[i].status=1;
        status=1;
        console.log("第"+i+"个任务的status为"+status);
      	const params = {
          'id':id,
          "setMyHeaderxxx": {
              'token': this.token,
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json"
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.put(config.host+ `/schedule/complete/${id}`, params);
      	if (res.code == 1) {
          console.log(res.message);
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
      // 修改任务
      async modify(e,id) {
      	const params = {
          'id':this.id,
          'task':this.task,
          'time':this.time,
          "setMyHeaderxxx": {
            'token': this.token,
            'content-type': 'application/x-www-form-urlencoded',
            "accept": "application/json"
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        //发送请求
        const {data: res} = await uni.$http.put(config.host+`/schedule/modify/${this.id}`, params);
      	if (res.code == 1) {
          console.log(res.message);
          this.mod=false;
          this.check();
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
      // 删除任务
      async delete(id) {
      	const params = {
          'id': id,
          "setMyHeaderxxx": {
              'token': this.token,
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.delete(config.host+`/schedule/delete/${id}`, params);
      	if (res.code == 1) {
          console.log(res.message);
          this.check();
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
      // 滑动事件
      myTouchStart(e) {
          this.slipFlag = true
          this.startPoint = e.touches[0]
      },
      myTouchMove(e,id,i,status) {
          if (((this.startPoint.clientX - e.touches[e.touches.length - 1].clientX) > 80) && this.slipFlag) {
              console.log("左滑事件");
              console.log("i="+i);
              this.slipFlag = false
              this.delete(id);
              return
          } else if (((this.startPoint.clientX - e.touches[e.touches.length - 1].clientX) < -80) && this.slipFlag) {
              console.log("右滑事件");
              this.slipFlag = false
              this.complete(id,i,status);
              return ;
          }
      },
      // 查看任务
      async check(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/schedule/wxcheck', params);
      	if (res.code == 1) {
          this.task_info=res.data;
          console.log(this.task_info);
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
      // 添加任务
      async add(e) {
// 试试
        //发送请求
        const {data: res} = await _add(this.task, this.time,)
      	if (res.code == 1) {
          console.log(res.message);
          this.check();
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
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      //弹出框
      open(){
        this.$refs.popup.open('center')
      },
      close() {
        this.$refs.popup.close()
      }
    }
  }
</script>

<style lang="scss">
  @keyframes y-com-load-move {
      0%, 100% {
        left: -7%;
      }
      25% {
        left: 22.5%;
        transform: scale(1.2);
      }
      50% {
        left: 57%;
      }
      75%{
        transform: scale(.8);
        left: 22.5%;
      }
    }
    @keyframes y-com-load-move2 {
      0%, 100% {
        left: 57%;
      }
      25% {
        left: 22.5%;
        transform: scale(.8);
      }
      50% {
        left: -7%;
      }
      75%{
        transform: scale(1.2);
        left: 22.5%;
      }
    }
    .myloading{
      margin:0  auto;
      width: 20%;
      padding-top: 10%;
      position: absolute;
      left: 50%;
      top: 44%;
      /* background-color: #fff; */
      /* font-size: var(--y-com-fontSize-Big); */
      font-size: 1vw;
      z-index: 1;
      animation: showloading .15s;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      font-weight: 700;
      /* background-color: rgb(221, 27, 27); */
      transform: translate(-50%, -50%);
    }
    .myloading::after{
      content: '';
      position: absolute;
      top: -20%;
      left: -7%;
      width: 50%;
      padding-top: 50%;
      border-radius: 50%;
      background-color: var(--color4);
      opacity: .8;
      animation: y-com-load-move 2.5s infinite ;
      z-index: 1;
    }
    .myloading::before{
      content: '';
      position: absolute;
      top: -20%;
      left: 57%;
      width: 50%;
      padding-top: 50%;
      border-radius: 50%;
      background-color: white;
      opacity: .7;
      z-index: 1;
      animation: y-com-load-move2 2.5s  infinite ;
    }
    .myloadtext{
      position: absolute;
      margin: 20rpx auto;
      width: 250rpx;
      text-align: center;
      font-size: 30rpx;
      /* font-weight: ; */
      /* margin-top: -17vh; */
      left: 50%;
      top: 42%;
      transform: translate(-50%, -50%);
      padding-top: 170rpx;
      padding-bottom: 30rpx;
      box-sizing: border-box;
      /* box-shadow: 0 0 50rpx 1rpx rgba(128, 128, 128, 0.144); */
      /* background: #fff; */
      border-radius: 30rpx;
      z-index: 0;
      color: rgb(87, 87, 87);
      font-weight:800;
      animation: showloading .15s;
    }
  .white{
    color: #030303;
    background-color: white;
  }
  .grey{
    // opacity: 0;
    // overflow: hidden;
    color: #b4b4b4;
    background-color: #ffffff;
  }
  .class3{
    
  }
.bg{
  padding-top: 40rpx;
  padding-left: 45rpx;
  padding-bottom: 10rpx;
  .bgc{
    background-color: #a4a4a4;
  }
  .new-event-test{
    width: 100%;
    height: 200rpx;
    background-color: pink;
  }
  .compose{
    position: fixed;
    top: 850rpx;
    right: 30rpx;
    width: 100rpx;
    height: 100rpx;
    text-align: center;
    line-height: 95rpx;
    padding-left: 10rpx;
    padding-top: 5rpx;
    background-color: #3b968c;
    border-radius: 100rpx;
    box-shadow:4rpx 4rpx 10rpx 4rpx #888;
  }
  uni-popup{
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
      background-color: #3b968c;
      border-radius: 100rpx;
      .icon{
        margin-right: 10rpx;
        font-weight: 400;
      }
    }
    .modi{
      background-color: paleturquoise;
    }
  }
  .task{
    width: 620rpx;
    height: 120rpx;
    margin-bottom: 50rpx;
    padding-left: 40rpx;
    padding-top: 30rpx;
    padding-bottom: 10rpx;
    border-radius: 20rpx;
    box-shadow:4rpx 4rpx 10rpx 4rpx #888;
    .left{
      float: left;
      width: 100rpx;
      height: 100rpx;
      padding-bottom: 30rpx;
      image{
        width: 100%;
        height: 100%;
        border-radius: 30rpx;
      }
    }
    .right{
      float: right;
      width: 500rpx;
      height: 100rpx;
      .headline{
        padding-bottom: 10rpx;
        font-size: 35rpx;
        font-weight: 500;
      }
      .body{
        font-size: 30rpx;
        color: #a4a4a4;
      }
    }
  }
}
</style>
