<template>
  <view  class="bg _myTheme">
    <view class="cal">
      <view class="head _myTheme1">
        日历
      </view>
      <view class="calendar _myTheme1">
       <template>
           <tmt-calendar :point-list="['2023-04-30','2023-04-29','2023-04-28','2023-04-27','2023-04-26','2023-04-25','2023-04-24']" :show="true" @changeDate="changeDate" background="#fff" weekColor='grey' actionColor='black' backColor='black' pointColor='#fe6905' ></tmt-calendar>
       </template>
      </view>
      <view class="bottom _myTheme1">
        <view class="left box">
          <text>连续签到</text>
          <view class="days">
            <text>{{con}}</text>
            <text>天</text>
          </view>
        </view>
        <view class="right box">
          <text>累计签到</text>
          <view class="days">
            <text>{{addDay}}</text>
            <text>天</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import config from '@/utils/config.js'
  export default {
    data() {
      return {
        con: '0',
        addDay: '0',
      };
    },
    onLoad(options){
      console.log(options);
      this.con=options.con
      this.addDay=options.addDay
      this.calendar()
    },
    methods: {
      async calendar(e) {
      	const params = {
      		'date':'2023-04-05,2023-04-06',
           "setMyHeaderxxx": { 
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json"
            }
      	};
        // 开启loading
      	uni.showLoading({
      		title:"Loading"
      	})
        //发送请求
        const {data: res} = await uni.$http.post(config.host+'/journal/calendar', params);
      	if (res.code == '1') {
          let i=0;
      		for(i=0;i<=res.data.length-1;i++){
            
          }
      	} else {
      		uni.showToast({
      			title: '失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      // change(){
      //   console.log(this);
      // }
    }
  }
</script>

<style lang="scss">
  .bg{
    height: 1300rpx;
    .cal{
      background-color: white;
      .head{
        height: 70rpx;
        font-size: 35rpx;
        padding-top: 20rpx;
        padding-left: 350rpx;
      }
      .bottom{
        display: flex;
        height: 200rpx;
        border-top: 1px solid gainsboro;
        .box{
          width: 300rpx;
          text{
            display: block;
            margin-top: 40rpx;
            text-align: center;
          }
          .days{
            display: flex;
            padding-top: 20rpx;
            text{
              margin-top: 0;
              padding-left: 100rpx;
            }
            text:nth-child(1){
              font-weight: 700;
              font-size: 45rpx;
            }
            text:nth-child(2){
              color: grey;
              padding-top: 20rpx;
              padding-left: 10rpx;
              font-size: 20rpx;
            }
          }
        }
      }
    }
  }
</style>
