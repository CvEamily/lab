<template>
  <view class="bg">
    <div class="search">
      <input type="text" v-model="search"></input>
      <uni-icons type="search" size="20" color="#989898"></uni-icons>
      <text class="sear" @click="searchInfo()">搜索</text>
    </div>
    <div class="tab">
      <v-tabs v-model="current" :tabs="tabs" @change="changeTab" color="grey" activeColor="#1771e3" fontSize="35rpx" bold="false" scroll="false" lineHeight="10rpx" padding="0rpx" paddingItem="55rpx"></v-tabs>
    </div>
    <div class="sort">
      <div class="sortItem" @click="changeCom()">
        <text>综合排序</text>
        <uni-icons type="bottom" size="20" color="#879aa8"></uni-icons>
      </div>
      <div class="sortItem" @click="changeTim()">
        <text>时间不限</text>
        <uni-icons type="bottom" size="20" color="#879aa8"></uni-icons>
      </div>
      <div class="comSort" v-if="com">
        <p @click="changeTimetype($event,0);searchInfo();">综合排序</p>
        <p @click="changeTimetype($event,1);searchInfo();">最新优先</p>
        <p @click="changeTimetype($event,2);searchInfo();">最热优先</p>
      </div>
      <div class="comSort" v-if="tim">
        <p @click="changeSelect($event,0);searchInfo();">时间不限</p>
        <p @click="changeSelect($event,1);searchInfo();">最新一天</p>
        <p @click="changeSelect($event,2);searchInfo();">最近一周</p>
        <p @click="changeSelect($event,3);searchInfo();">最近一月</p>
      </div>
    </div>
    <div class="article _myTheme">
        <div class="blog _myTheme1" v-for="(item, i) in blog_info" :key="item.id" @click="gotoDetails($event,item.id)">
          <div class="left">
            <image src="https://tse4-mm.cn.bing.net/th/id/OIP-C.sCgU_kBpXCCIIE77R_tuUAHaNK?pid=ImgDet&rs=1" mode="aspectFill"></image>
          </div>
          <div class="right">
            <div class="headline">{{blog_info[i].title}}</div>
            <div class="author">
              <div class="user">
                  <image src="https://p.qqan.com/up/2021-6/16246735796128385.png" mode="aspectFill"></image>
              </div>
              <text v-if="blog_info[i].nickname">{{blog_info[i].nickname}}</text>
              <text v-if="!blog_info[i].nickname">{{blog_info[i].username}}</text>
            </div>
            <div class="body">{{blog_info[i].content}}</div>
            <div class="icon">
              <div class="uniIcon"><uni-icons type="eye" size="20"></uni-icons>{{blog_info[i].views}}</div>
              <div class="uniIcon"><uni-icons type="hand-up" size="20"></uni-icons>{{blog_info[i].gttu}}</div>
              <div class="uniIcon"><uni-icons type="chatbubble" size="20"></uni-icons>{{blog_info[i].comment_num}}</div>
            </div>
          </div>
        </div>
        </div>
    </div>
  </view>
</template>

<script>
  import config from '../../../../utils/config.js'
  export default {
    data() {
      return {
        current: 0,
        tabs:["综合","文章","标签","用户"],
        blog_info:[{title:'加载中',username:'加载中',nickname:'加载中',content:'加载中',outline:'',views:'',gttu:'',create_time:'',comment_num:'',filename:'',tag:'',id:''}],
        token:'',
        search:'加载中',
        com: false,
        tim: false,
        timeType: 0,
        selectType: 0,
        type: 0,
      };
    },
    async onLoad(){
      this.getToken()
      this.getSearch()
      this.getSear()
    },
    methods:{
      changeSelect(e,number){
        this.selectType=number
      },
      changeTimetype(e,number){
       this.timeType=number;
      },
      changeTim(){
        this.tim=!this.tim
        this.com=false
      },
      changeCom(){
        this.com=!this.com;
        this.tim=false
      },
      gotoDetails(e,id){
        uni.navigateTo({
          url:'../../../blog/details/details',
          events:{
            acceptDataFromOpenedPage: function(data) {
              console.log(data)
            },
            someEvent: function(data) {
              console.log(data)
            }
          },
          success: function(res) {
              res.eventChannel.emit('acceptDataFromOpenerPage', { id: id})
          }
        })
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      async searchInfo() {
      	const params = {
          'search': this.search,
          'timeType':this.timeType,
          'selectType':this.selectType,
          'type':this.type,
          "setMyHeaderxxx": {
            "token":this.token,
            'content-type': 'application/x-www-form-urlencoded',
            "accept": "application/json"
           }
      	};
        console.log('search2D:'+this.search);
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.post(config.host+'/blog/wxsearch', params);
        console.log(res, '$$$$$$$$$$');
      	if (res.code == 1) {
          // this.search=search //没适配暗夜模式
          this.blog_info=res.data;
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
       getSearch(option){
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('acceptDataFromOpenedPage', {data: 'data from test page'});
        eventChannel.emit('someEvent', {data: 'data from test page for someEvent'});
        let _this=this
        eventChannel.on('acceptDataFromOpenerPage', async function(data) {
          console.log(data);
          _this.search=data.search
          // console.log('search:'+_this.search);
         wx.setStorageSync('search',data.search)
         this.search=wx.getStorageSync("search")
          await _this.searchInfo()
        })
      },
      changeTab(index) {
        console.log('当前选中的项：' + index)
        this.type=index
        this.searchInfo()
      },
      getSear(){
        this.search=wx.getStorageSync("search")
      }
    }
  }
</script>

<style lang="scss">
.bg{
  .search{
    display: flex;
    padding-top: 40rpx;
    height: 120rpx;
    background-color: white;
    input{
      width: 520rpx;
      height: 80rpx;
      padding-left: 80rpx;
      margin-left: 25rpx;
      margin-right: 30rpx;
      border-radius: 15rpx;
      background-color: #eeeeee;
    }
    .sea{
      color: #b9bec2;
    }
    uni-icons{
      position: absolute;
      top: 60rpx;
      left: 50rpx;
    }
    .sear{
      width: 80rpx;
      height: 50rpx;
      color: #007afd;
      padding-top: 20rpx;
    }
  }
  .tab{
    width: 100%;
    height: 50rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
  .sort{
    display: flex;
    width: 100%;
    height: 100rpx;
    background-color: white;
    .sortItem{
      width: 50%;
      color:#879aa8;
      text-align: center;
      padding-top: 30rpx;
    }
    .comSort{
      position: fixed;
      top: 320rpx;
      left: 0;
      width: 100%;
      height: 200rpx;
      p{
        height: 90rpx;
        line-height: 90rpx;
        padding-left: 60rpx;
        background-color: white;
        font-size: 30rpx;
        color: #99a0aa;
        border-bottom: 1rpx solid #f0f0f0;
      }
    }
    .timeSort{
      width: 100%;
      height: 200rpx;
    }
  }
  .article{
    margin-top: 20rpx;
    background-color: #eef3f7;
    .blog{
      display: flex;
      width: 700rpx;
      height: 350rpx;
      padding-left: 40rpx;
      padding-top: 40rpx;
      margin-top: 20rpx;
      // background-color: white;
      .left{
        width: 220rpx;
        height: 300rpx;
        padding-bottom: 30rpx;
        image{
          width: 100%;
          height: 100%;
        }
      }
      .right{
        display: flex;
        flex-direction: column;
        width: 450rpx;
        height: 300rpx;
        padding-left: 40rpx;
        .headline{
          padding-top: 10rpx;
          padding-bottom: 10rpx;
          font-size: 35rpx;
          font-weight: 500;
        }
        .author{
          display: flex;
          .user{
            width: 50rpx;
            height: 50rpx;
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
            padding-left: 20rpx;
          }
        }
        .body{
          height: 50rpx;
          margin-top: 15rpx;
          height: 150rpx;
          font-size: 30rpx;
          color: #a4a4a4;
        }
        .icon{
          display: flex;
          .uniIcon{
            margin-right: 30rpx;
          }
        }
      }
    }
  }
}
</style>
