<template>
  <view class="bg">
    <div class="compose stopbut" @click="gotoWrite()">
      <uni-icons type="compose" size="30" color="white"></uni-icons>    
    </div>
    <uni-popup ref="popup" type="bottom" :mask-click="true">
      <textarea name="" id="" cols="30" rows="10" placeholder="请输入任务..." v-model="content"></textarea>
      <button @click="close()">
        <box class="icon">
          <uni-icons type="paperplane" size="15" color="white"></uni-icons>
        </box>
        SEND
      </button>
    </uni-popup>
    <div class="bigBox _myTheme">
      <view class="User">
        <image :src="img" mode="aspectFill"></image>
      </view>
      <div class="sta _myTheme1">
        <div class="number">
          <div class="content _myTheme1">
            <div class="top">
              {{upperdata.sumgttu}}
            </div>
            <div class="bottom">
              获赞
            </div>
          </div>
          <div class="content _myTheme1">
            <div class="top">
              {{upperdata.sumcollect}}
            </div>
            <div class="bottom">
              被收藏
            </div>
          </div>
          <div class="content _myTheme1">
            <div class="top">
              {{upperdata.sumviews}}
            </div>
            <div class="bottom">
              访问
            </div>
          </div>
        </div>
        <text v-if="this.myBlog_info.nickname">{{myBlog_info.nickname}}</text>
        <text v-if="!this.myBlog_info.nickname">{{upperdata.username}}</text>
      </div>
      <div class="myBlog _myTheme1" v-for="(item, i) in myBlog_info" :key="i" @click="gotoDetails($event,item.id)">
        <div class="blog">
          <div class="left">
              <image src="https://tse4-mm.cn.bing.net/th/id/OIP-C.sCgU_kBpXCCIIE77R_tuUAHaNK?pid=ImgDet&rs=1" mode="aspectFill"></image>
          </div>
          <div class="right">
            <div class="headline">{{myBlog_info[i].title}}</div>
            <div class="author">
              <div class="user">
                  <image src="https://tupian.qqw21.com/article/UploadPic/2021-8/20218152156870259.jpg" mode="aspectFill"></image>
              </div>
              <text v-if="myBlog_info[i].nickname">{{myBlog_info[i].nickname}}</text>
              <text v-if="!myBlog_info[i].nickname">{{myBlog_info[i].username}}</text>
            </div>
            <div class="body">{{myBlog_info[i].content}}</div>
            <div class="icon">
              <div class="uniIcon"><uni-icons type="eye" size="15" color="#9a9a9a"></uni-icons>{{myBlog_info[i].views}}</div>
              <div class="uniIcon"><uni-icons type="hand-up" size="15" color="#9a9a9a"></uni-icons>{{myBlog_info[i].gttu}}</div>
              <div class="uniIcon"><uni-icons type="chatbubble" size="15" color="#9a9a9a"></uni-icons>{{myBlog_info[i].comment_num}}</div>
            </div>
        </div>
        </div>
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
        img:"https://p.qqan.com/up/2020-12/16070652272519101.jpg",
        myBlog_info:[{title:'加载中',username:'加载中',nickname:'加载中',content:'加载中',outline:'',views:'',gttu:'',create_time:'',comment_num:'',filename:'',tag:''}],
        upperdata:[{sumcollect:'加载中',sumgttu:'加载中',sumviews:'加载中',username:''}],
      };
    },
    async onLoad(){
      this.getToken()
      await this.myBlog()
    },
    methods:{
      gotoDetails(e,id){
        uni.navigateTo({
          url:'../../blog/details/details',
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
      async myBlog(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/blog/wxmyallblog', params);
      	if (res.code == 1) {
          this.myBlog_info=res.data.blogdata;
          this.upperdata=res.data.upperdata;
          return ;
      	} 
        console.log(res.code);
        uni.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        });    
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      gotoWrite(){
        uni.navigateTo({
          url:'./write/write'
        })
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
.bg{
  width: 100%;
  height: 1210rpx;
  padding-top: 190rpx;
  background-image: url('https://tse2-mm.cn.bing.net/th/id/OIP-C.Yy5uxVxvFfrlHTt__7rm1QHaKD?pid=ImgDet&rs=1');
  background-size: 100% 100%;
  .compose{
    position: fixed;
    top: 980rpx;
    right: 30rpx;
    width: 100rpx;
    height: 100rpx;
    text-align: center;
    line-height: 95rpx;
    background-color: #3b968c;
    border-radius: 100rpx;
  }
  uni-popup{
    // background-color: palegoldenrod;
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
  }
  .bigBox{
    // height: 1200rpx;
    background-color: #f6f6f6;
    border-radius: 30rpx 30rpx 0 0;
    .User{
      position: absolute;
      top: 110rpx;
      left: 20rpx;
      width: 150rpx;
      height: 150rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      box-shadow: 3rpx 3rpx 2rpx 2rpx #e8e8e8;
      border-radius: 90rpx;
      border: 7rpx solid white;
      image{
        height: 100%;
        width: 100%;
      }
    }
    .sta{
      padding-top: 10rpx;
      padding-left: 30rpx;
      padding-bottom: 60rpx;
      background-color: white;
      border-radius: 30rpx 30rpx 0 0;
      .number{
        margin-left: 200rpx;
        margin-bottom: 100rpx;
        .content{
          float: left;
          margin-left: 10rpx;
          margin-right: 80rpx;
          .top{
            text-align: center;
            font-weight: 700;
          }
          .bottom{
            color: #989898;
          }
        }
      }
      text{
        font-size: 40rpx;
      }
    }
    .myBlog{
      .blog{
        width: 710rpx;
        height: 380rpx;
        padding-left: 40rpx;
        margin-top: 20rpx;
        .left{
          float: left;
          width: 220rpx;
          height: 300rpx;
          padding-top: 40rpx;
          padding-bottom: 30rpx;
          image{
            width: 100%;
            height: 100%;
          }
        }
        .right{
          float: right;
          width: 450rpx;
          height: 300rpx;
          padding-top: 30rpx;
          .headline{
            width: 100%;
            height: 40rpx;
            padding-top: 10rpx;
            padding-bottom: 10rpx;
            font-size: 35rpx;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
          }
          .author{
            .user{
              float: left;
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
            height: 160rpx;
            margin-top: 15rpx;
            font-size: 30rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
          }
          .icon{
            .uniIcon{
              float: left;
              font-size: 25rpx;
              margin-right: 30rpx;
            }
          }
        }
      }
    }
  }
}
</style>