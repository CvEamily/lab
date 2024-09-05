<template>
  <view class="bg">
    <div class="top">
      <text>我的收藏</text>
      <div class="author">
        <div class="user">
            <image src="https://tupian.qqw21.com/article/UploadPic/2021-8/20218152156870259.jpg" mode="aspectFill"></image>
        </div>
        <text v-if="this.nickname">{{nickname}}</text>
        <text v-if="!this.nickname">{{username}}</text>
      </div>
    </div>
    <div class="bigBox">
      <div class="sta">
        {{sum}}篇文章
      </div>
      <div class="myBlog">
        <div class="blog" v-for="(item,i) in favor_info" :key="i" @click="gotoDetails($event,item.id)">
            <div class="left">
                <image src="https://tse4-mm.cn.bing.net/th/id/OIP-C.sCgU_kBpXCCIIE77R_tuUAHaNK?pid=ImgDet&rs=1" mode="aspectFill"></image>
            </div>
            <div class="right">
              <div class="headline">{{favor_info[i].title}}</div>
              <div class="author">
                <div class="user">
                    <image src="https://tupian.qqw21.com/article/UploadPic/2021-8/20218152156870259.jpg" mode="aspectFill"></image>
                </div>
                <text v-if="!this.favor_info[i].nickname">{{favor_info[i].nickname}}</text>
                <text v-if="this.favor_info[i].nickname">{{favor_info[i].username}}</text>
              </div>
              <div class="body">{{favor_info[i].content}}</div>
              <div class="icon">
                <div class="uniIcon"><uni-icons type="eye" size="20"></uni-icons>{{favor_info[i].views}}</div>
                <div class="uniIcon"><uni-icons type="hand-up" size="20"></uni-icons>{{favor_info[i].gttu}}</div>
                <div class="uniIcon"><uni-icons type="chatbubble" size="20"></uni-icons>{{favor_info[i].comment_num}}</div>
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
        img:"https://p.qqan.com/up/2020-12/16070652272519101.jpg",
        token:'',
        favor_info:[{comment_num:'',content:'加载中',create_time:'',filename:'',gttu:'',hot:'',id:'-1',nickname:'加载中',outline:'',profile_photo:'',tag:'',title:'',username:'加载中',views:''}],
        sum:'',
        nickname:'',
        username:'',
      };
    },
    async onLoad(){
      this.getToken()
      await this.favorite()
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
      async favorite(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/collect/wxfavorite', params);
      	if (res.code == 1) {
          console.log(res.data);
          this.favor_info=res.data.blogdata;
          this.sum=res.data.collectsum;
          this.nicknam=res.data.nickname;
          this.username=res.data.username;
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
      }
    }
  }
</script>

<style lang="scss">
.bg{
  width: 100%;
  height: 1210rpx;
  background-image: url('https://tse2-mm.cn.bing.net/th/id/OIP-C.CxgJkVtJYdA0amqHN8igHQHaNK?pid=ImgDet&rs=1');
  background-size: 100% 100%;
  .top{
    padding-top: 130rpx;
    padding-left: 40rpx;
    text{
      font-size: 50rpx;
      color: white;
    }
    .author{
      margin-top: 70rpx;
      margin-bottom: 100rpx;
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
        font-size: 30rpx;
        color: white;
        padding-left: 20rpx;
      }
    }
  }
  .bigBox{
    position: sticky;
    top: 10rpx;
    background-color: #f2f3f5;
    border-radius: 30rpx 30rpx 0 0;
    .sta{
      height: 70rpx;
      line-height: 70rpx;
      color: #4f525b;
      padding-top: 30rpx;
      padding-left: 30rpx;
      padding-bottom: 20rpx;
      background-color: white;
      border-radius: 30rpx 30rpx 0 0;
    }
    .myBlog{
      .blog{
        width: 710rpx;
        height: 380rpx;
        padding-left: 40rpx;
        margin-top: 5rpx;
        background-color: white;
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
            height: 40rpx !important;
            padding-top: 10rpx;
            padding-left: 20rpx;
            padding-bottom: 10rpx;
            font-size: 35rpx;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            // background-color: palegreen;
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
              color: #6a6a6a;
              padding-left: 20rpx;
            }
          }
          .body{
            margin-top: 15rpx;
            height: 85px;
            font-size: 30rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            color: #a4a4a4;
          }
          .icon{
            .uniIcon{
              float: left;
              color: #9a9a9a;
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