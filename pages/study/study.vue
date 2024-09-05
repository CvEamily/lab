<template>
  <view style="_myTheme1">
    <view class="content">
      <view class="study " @click="gotoNote()">
        <view class="head">
          Recent
          <uni-icons type="more-filled" size="15"></uni-icons>
        </view>
        <view class="studyItem">
          {{contentOne}}
        </view>
        <view class="studyItem">
          {{contentTwo}}
        </view>
        <view class="studyItem">
          {{contentThree}}
        </view>
      </view>
      </view>
      <view class="statistic" @click="gotoSta()">
        <view class="ovewview _myTheme1">
          <view class="head">
            概览
            <uni-icons type="right" size="15"></uni-icons>
          </view>
          <view class="time">
            <view class="todayTime timeItem">
              <view class="title">
                <uni-icons type="circle-filled" size="15"></uni-icons>
                <text>今日学习时长</text>
              </view>
              <view class="minute">
                <text class="left">
                  {{day_time}}
                </text>
              </view>
            </view>
            <view class="weekRank timeItem">
              <view class="title">
                <uni-icons type="bars" size="15"></uni-icons>
                <text>本周排名</text>
              </view>
              <view class="minute">
                <text class="left">
                    {{week_desc}}
                </text>
              </view>
            </view>
            <view class="monthTime timeItem">
              <view class="title">
                <uni-icons type="settings" size="15"></uni-icons>
                <text>本周学习时长</text>
              </view>
              <view class="minute">
                <text class="left">
                  {{week_time}}
                </text>
              </view>
            </view>
            <view class="allTime timeItem">
              <view class="title">
                <uni-icons type="medal-filled" size="15"></uni-icons>
                <text>累计学习时长</text>
              </view>
              <view class="minute">
                <text class="left">
                  {{all_time}}
                </text>
              </view>
            </view>
          </view>
        </view>
      <!-- 日历 -->
      <view class="calendar _myTheme1" @click="gotoCalendar">
        <view class="head">
          <text class="t">日历</text>
          <text>连续签到{{con}}天</text>
          <uni-icons type="right" size="15"></uni-icons>
        </view>
        <view class="cal _myTheme1">
          <tmt-calendar defaultDate="2023-4-30"  :point-list="['2023-03-27','2023-04-28','2023-04-29','2023-04-30']" :show="false" :showBtn="false" background="white"  dayColor="black" weekColor="grey" @changeDate="changeDate"></tmt-calendar>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import config from '../../utils/config'
  import { getNote as _getNote, getData as _getData } from '@/api/study/study.js' // 和你的函数重名了 as 重启名字 
  export default {
    data() {
      return {
        contentOne: '加载中',
        contentTwo: '加载中',
        contentThree: '加载中',
        day_time: '0',
        all_time: '0',
        week_time: '0',
        week_desc: '0',
        con: '0',
        addDay: '0',
        sj:[0,0.5,0,0,0,0,0],
        timeNow:'',
        weekName:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
        weekList:[],
        week:'',
      }
    },
    onLoad(){
      this.getStartTime()
      this.timestampToTime()
      this.getWeekList()
      this.getNote()
      this.getData()
      this.getInfo()
    },
    methods: {
      // 获取当天0点的时间戳
      getStartTime(time) {
        const nowTimeDate = new Date(time)
        return nowTimeDate.setHours(0, 0, 0, 0)
      },
      // 时间戳转日期格式
      timestampToTime(timestamp) {
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M =
          (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        var D = date.getDate()
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds();
        // return Y + M + D + ' ' + h + m + s
        return Y + M + D
      },
      // 获取一周的日期
      getWeekList(type) {
        let week = []
        for (let i = 0; i < 7; i++) {
          let weekObj = {
            name: this.weekName[i],
            date: '',
            timeStamp: '',
          }
          week.push(weekObj)
        }
        let today = this.getStartTime(Number(new Date())) // 当天时间戳
        let today_week = new Date().getDay() // 当天星期几
        if (today_week == 0) {
          // 若当天为周日
          week[6].timeStamp = today
        } else {
          week[today_week - 1].timeStamp = today
        }
  
        var leftNum = today_week - 1 // 本周内今天的前几天的数量
        var rightNum = 7 - today_week // 本周内今天的后几天的数量
  
        for (var left = 0; left < leftNum; left++) {
          week[left].timeStamp =
            today - (today_week - left - 1) * 1000 * 60 * 60 * 24
        }
        for (var right = 0; right < rightNum; right++) {
          week[right + today_week].timeStamp =
            today + (right + 1) * 1000 * 60 * 60 * 24
        }
        week.map((el) => {
          el.date = this.timestampToTime(el.timeStamp)
        })
        this.weekList = JSON.parse(JSON.stringify(week))
        console.log(this.weekList)
        let a = this.weekList[0].date+','+this.weekList[1].date+','+this.weekList[2].date+','+this.weekList[3].date+','+this.weekList[4].date+','+this.weekList[5].date+','+this.weekList[6].date
        this.week = a
        console.log(this.week);
      },
      async getInfo(e) {
      	const params = {
          'date':this.week
        };
        console.log(params.date);
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/journal/oneweek?date='+params.date);
      	if (res.code == 1) {
          console.log(res.data);
          this.sj=res.data
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
      async getNote(e) {
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await _getNote() // post 或者get 要传参的 从（id，p1, p2传）
        if (res.code == 1) {
          if(res.data.journalList.length==0){
            this.contentOne='暂无数据'
            this.contentTwo='暂无数据'
            this.contentThree='暂无数据'
            this.day_time=res.data.day_time
            this.all_time=res.data.all_time
            this.week_desc=res.data.week_time_desc
            this.week_time=res.data.week_time
            return;
          } 
          this.contentOne=res.data.journalList[0].content
          this.contentTwo=res.data.journalList[1].content
          this.contentThree=res.data.journalList[2].content
          this.day_time=res.data.day_time
          this.all_time=res.data.all_time
          this.week_desc=res.data.week_time_desc
          this.week_time=res.data.week_time
          return; 
      	} 
        console.log(res.code);
        uni.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        });    
      },
      async getData(e) {
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await _getData();
      	if (res.code == 1) {
          console.log(res.data);
          this.con=res.data.Continuous
          this.addDay=res.data.Addupday
      		return;
      	} 
        console.log(res.code);
        uni.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        });    
      },
      gotoSta(){
        uni.navigateTo({
          url: '../../pages/study/statistic/statistic?sj='+this.sj
        })
      },
      gotoNote(){
       uni.navigateTo({
         url: '../../pages/study/note/note'
       })
      },
      gotoCalendar(){
        uni.navigateTo({
          url: '../calendar/calendar?con=' + this.con + '&addDay=' + this.addDay
        })
      }
    }
  }
</script>

<style lang="scss">
  .tmt-header{
    height: 0rpx !important;
    padding: 0 !important;
  }
  .content{
    padding: 50rpx 20rpx 5rpx 30rpx;
    // 上 右 下 左
    background-color: #f4f4f4;
    .study{
      display: flex;
      height: 370rpx;
      width: 660rpx;
      flex-wrap: wrap;
      border-radius: 20rpx;
      padding-top: 30rpx;
      padding-left: 30rpx;
      background-color: white;
      .head{
        font-weight: 600;
        uni-icons{
          padding-left: 500rpx;
        }
      }
      .studyItem{
        display: block;
        width: 168rpx;
        height: 210rpx;
        padding:10rpx;
        margin-right: 20rpx;
        border-radius: 6%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        border: 5rpx solid black;
      }
    }
  }
  .statistic{
    padding: 35rpx 35rpx 20rpx 35rpx;
    .ovewview{
      border-radius: 20rpx;
      padding-top: 30rpx;
      padding-right: 20rpx;
      padding-left: 20rpx;
      padding-bottom: 20rpx;
        .head{
          font-weight: 600;
          padding-left: 50rpx;
          uni-icons{
            padding-left: 450rpx;
          }
        }
        .time{
          display: flex;
          flex-wrap: wrap;
          padding-left: 30rpx;
          padding-top: 0rpx;
          border-radius: 20rpx;
            .timeItem{
              display: block;
              width: 200rpx;
              padding-top: 20rpx;
              margin-bottom: 10rpx;
              text-overflow: ellipsis;
              word-wrap: break-word;
              font-weight: 200;
              .title{
                padding: 0;
                text{
                  padding-left: 5rpx;
                  font-size: 27rpx;
                }
              }
              .minute{
                padding-top: 35rpx;
                text-align: center;
                .left{
                  font-size: 30rpx;
                }
              }
            }
        }
        .weekRank{
          margin-left: 120rpx;
        }
        .allTime{
          margin-left: 120rpx;
        }
    }
    .calendar{
      margin-top: 40rpx;
      border-radius: 5%;
      .head{
        font-weight: 600;
        padding-top: 30rpx;
        padding-left: 60rpx;
        padding-bottom: 20rpx;
        border-radius: 5%;
        .t{
          font-size: 35rpx;
          padding-right: 350rpx;
          border-radius: 20%;
        }
        text{
          font-weight: 500;
          font-size: 25rpx;
        }
        uni-icons{
          padding-left: 0rpx;
        }
      }
      .cal{
        background-color: pink;
        margin-bottom: 10rpx;
        // border-radius: 20%;
        tmt-calendar{
          // color: black;
          border-radius: 20%;
        }
      }
    }
  }
</style>
