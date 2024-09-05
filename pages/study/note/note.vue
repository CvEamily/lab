<template>
  <view class="bg">
    <div class="task" v-for="(item,i) in note_info" :key="i">
      <div class="right">
        <div class="headline">{{note_info[i].content}}</div>
        <div class="body">{{note_info[i].sum_time}}minutes</div>
      </div>
    </div>
  </view>
</template>

<script>
  import config from '../../../utils/config'
  export default {
    data() {
      return {
        token:'',
        note_info:''
      };
    },
    onLoad() {
      this.getToken()
      this.getNote()
    },
    methods: {
      async getNote(e) {
      	const params = {
          "setMyHeaderxxx": {
              'token': this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        //发送请求
        const {data: res} = await uni.$http.get(config.host+'/journal/wxtakeout', params);
      	if (res.code == 1) {
          this.note_info=res.data.journalList;
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
      gotoIndex(){
       uni.switchTab({
         url: '../../index/index'
       })
      }
    }
  }
</script>

<style lang="scss">
.bg{
  background-color: #fbfbfb;
  padding-top: 40rpx;
  padding-left: 45rpx;
  padding-bottom: 10rpx;
  .task{
    width: 620rpx;
    height: 120rpx;
    margin-bottom: 50rpx;
    padding-top: 30rpx;
    padding-bottom: 10rpx;
    background-color: white;
    border-radius: 20rpx;
    box-shadow:8rpx 8rpx 2rpx 5rpx #f9f9f9;
    .right{
      float: right;
      width: 500rpx;
      height: 100rpx;
      .headline{
        width: 100%;
        height: 75%;
        padding-bottom: 10rpx;
        font-size: 35rpx;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
      }
      .body{
        font-size: 30rpx;
        color: #a4a4a4;
      }
    }
  }
}
</style>
