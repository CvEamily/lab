<template>
  <view class="bg">
    <div class="top">
      <div class="title _myTheme1">
        <div class="uniIcon">
          <uni-icons custom-prefix="iconfont" type="icon-time" size="25" color=""></uni-icons>
        </div>
        <text>本周时长</text>
      </div>
    </div>
    <div class="pic _myTheme1">
      <canvas
       style="width: 360px; height: 320px;"
       canvas-id="yueEle"
       binderror="canvasIdErrorCallback"
      ></canvas>
    </div>
  </view>
</template>

<script>
import config from '@/utils/config.js'
const wxCharts = require("../../../utils/wxcharts.js");
let yuelineChart=null;
export default {
    data() {
      return {
         imageWidth:0,
         sj:[0,0.5,0,0,0,0,0],
      };
    },
    onLoad(options){
      console.log(options.sj);
      let str=options.sj
      let a=str.split(',')
      let b=a.map(Number)
      this.sj=b
    },
    onShow:function(){
      var windowWidth = 320;
        try {
         var res = wx.getSystemInfoSync();
         windowWidth = res.windowWidth;
        } catch (e) {
         console.error('getSystemInfoSync failed!');
        }
        yuelineChart = new wxCharts({ 
         canvasId: 'yueEle',
         type: 'line',
         categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
         animation: true,
         series: [{
          name: '签到时长',
          data: this.sj,
          format: function (val, name) {
           return val + '';
          }
         }],
         xAxis: {
          disableGrid: true
         },
         yAxis: {
          title: '签到时长（小时）',
          format: function (val) {
           return val;
          },
          /*max: 20,*/
          min: 0
         },
         width: windowWidth,
         height: 300,
         dataLabel: false,
         dataPointShape: true,
         extra: {
          lineStyle: 'curve'
         }
        });
    },
    
    methods: {
      // async getInfo(e) {
      // 	const params = {
      //     'data':'2023-04-03,2023-04-04,2023-04-05,2023-04-06,2023-04-07,2023-04-08,2023-04-09'
      //   };
      // 	uni.showLoading({
      // 		title:"Loading"
      // 	})
      //   const {data: res} = await uni.$http.get(config.host+'/journal/oneweek?date=2023-04-24,2023-04-25,2023-04-26,2023-04-27,2023-04-28,2023-04-29,2023-04-30');
      // 	if (res.code == 1) {
      //     console.log(res.data);
      //     this.sj=res.data
      //     console.log(this.sj+'22222222');
      // 		return ;
      // 	} else {
      //     console.log(res.code);
      // 		uni.showToast({
      // 			title: '加载失败',
      // 			duration: 2000,
      // 			icon: 'none'
      // 		});    
      // 	}
      // }
    }
  }
</script>

<style lang="scss">
  @import "@/static/iconfont.css";
  .bg{
    .top{
      background-color: white;
      .title{
        height: 80rpx;
        padding-top: 50rpx;
        padding-left: 50rpx;
        .uniIcon{
          float: left;
          margin-right: 10rpx;
        }
        text{
          font-size: 35rpx;
          font-weight: 700;
        }
      }
    }
    .pic{
      padding-top: 90rpx;
      padding-left: 12rpx;
      background-color: white;
      .canvas{
      }
    }
  }
</style>
